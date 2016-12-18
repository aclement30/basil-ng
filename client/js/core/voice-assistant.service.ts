import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';
import * as moment from 'moment';

import { CommandParser, Recipe as RecipeCommands, Steps as StepsCommands, Timer as TimerCommands } from './command.parser';
import { ICookingRecipes, IUI } from '../redux';
import { Recipe } from '../recipes/recipe.model';
import { RecipesActions, UIActions } from '../core/redux.actions';
import { SpeakerService } from './speaker.service';
import { TimerService } from './timer.service';

export interface IWindow extends Window {
    webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = <IWindow>window;

@Injectable()
export class VoiceAssistantService {
    @select('cookingRecipes') cookingRecipes$: Observable<ICookingRecipes>;
    @select('ui') ui$: Observable<IUI>;
    private voiceAssistantEnabled: boolean = false;
    private recognition: any;

    constructor(
        private commandParser: CommandParser,
        private recipesActions: RecipesActions,
        private speakerService: SpeakerService,
        private timerService: TimerService,
        private uiActions: UIActions,
        private zone: NgZone) {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = 'fr-FR';
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.onresult = this.onRecognitionResult;
        this.recognition.onsoundstart = this.onRecognitionSoundStart;
        this.recognition.onsoundend = this.onRecognitionSoundEnd;
        this.recognition.onerror = this.onRecognitionError;

        this.ui$.subscribe(this.onUIChange);
        this.speakerService.speaking.subscribe(this.onSpeakerSpeaks);
    }

    onUIChange = (ui: IUI) => {
        if (ui.voiceAssistant.enabled !== this.voiceAssistantEnabled) {
            if (ui.voiceAssistant.enabled) {
                this.speakerService.speak('Je suis à l\'écoute.', { ding: true });
            } else {
                this.recognition.stop();
            }

            this.voiceAssistantEnabled = ui.voiceAssistant.enabled;
        }
    }

    onRecognitionResult = (event: any) => {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The [last] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object

        let last = event.results.length - 1;
        let transcript = event.results[last][0].transcript;

        const command = this.matchCommand(transcript);
        if (command) {
            this.executeCommand(command);
        } else {
            this.speakerService.speak('Désolé, je n\'ai pas compris.', { dialogTitle: ':(' });
        }

        console.log('Event results', event.results);
        console.log('Result received:', transcript);
        console.log('Confidence: ' + event.results[0][0].confidence);
        console.log('---');
    }

    onRecognitionSoundStart = () => {
        this.zone.run(() => {
            this.uiActions.startListening();
        });

        console.log('sound started');
    }

    onRecognitionSoundEnd = () => {
        this.zone.run(() => {
            this.uiActions.stopListening();
        });

        console.log("sound stopped");
    }

    onRecognitionError = (event: any) => {
        console.log('Error occurred in recognition:', event);
    }

    onSpeakerSpeaks = (isSpeaking: boolean) => {
        if (!this.voiceAssistantEnabled) return;

        if (isSpeaking) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    private matchCommand(transcript: string): string {
       return this.commandParser.parse(transcript.trim());
    }

    private executeCommand(command: any) {
        const commandType: string = command.name.split('/')[0];

        this.currentRecipe$.first().subscribe((currentRecipe: Recipe) => {
            this.zone.run(() => {
                switch (commandType) {
                    case 'recipe':
                        if (command.name === RecipeCommands.END) {
                            if (currentRecipe) {
                                this.recipesActions.stopCooking(currentRecipe);
                                this.speakerService.speak('La recette est terminée.');
                            } else {
                                this.speakerService.speak('Vous n\'avez aucune recette en cours !');
                            }
                        }
                        break;
                    case 'steps':
                        let recipeInstruction: string;
                        let responseTitle: string;

                        if (command.name === StepsCommands.READ_STEP) {
                            responseTitle = `Étape ${command.step}`;
                            recipeInstruction = currentRecipe.recipeInstructions[(command.step - 1)];
                        } else if (command.name === StepsCommands.NEXT_STEP) {
                            recipeInstruction = currentRecipe.recipeInstructions[1];
                        } else if (command.name === StepsCommands.PREVIOUS_STEP) {
                            recipeInstruction = currentRecipe.recipeInstructions[0];
                        } else if (command.name === StepsCommands.LAST_STEP) {
                            responseTitle = 'Dernière étape';
                            recipeInstruction = currentRecipe.recipeInstructions[(currentRecipe.recipeInstructions.length - 1)];
                        }

                        if (recipeInstruction) {
                            this.speakerService.speak(`${responseTitle}: ${recipeInstruction}`, {
                                dialogTitle: responseTitle,
                                dialogText: recipeInstruction
                            });
                        } else {
                            this.speakerService.speak('Je ne trouve pas cette étape dans la recette !', {dialogTitle: ':('});
                        }
                        break;
                    case 'timer':
                        if (command.name === TimerCommands.START) {
                            let description = command.description || null;
                            if (!description && currentRecipe) {
                                description = currentRecipe.title;
                            }

                            const options = {
                                description: description,
                                recipeId: currentRecipe ? currentRecipe._id : null,
                            };

                            let humanDuration = '';
                            const hours = Math.floor(command.duration / 3600);
                            const minutes = Math.floor((command.duration - (hours * 3600)) / 60);
                            const seconds = Math.floor((command.duration - (hours * 3600)) - (minutes * 60));

                            if (hours >= 1) {
                                humanDuration += `${hours} heures `;
                            }
                            if (minutes >= 1) {
                                humanDuration += `${minutes} minutes `;
                            }
                            if (seconds >= 1) {
                                humanDuration += `${seconds} secondes `;
                            }

                            this.timerService.create(command.duration, options);
                            this.speakerService.speak(`Minuterie : ${humanDuration}`, {dialogTitle: 'Minuterie'});
                        }

                        break;
                    default:
                        this.speakerService.speak('Désolé. Je ne supporte pas encore cette commande.', {dialogTitle: ':('});
                        console.log('Unknown command:', command);
                }
            });
        });
    }

    get currentRecipe$(): Observable<Recipe> {
        return this.cookingRecipes$.map((cookingRecipes: ICookingRecipes) => {
            return cookingRecipes.current;
        });
    }
}