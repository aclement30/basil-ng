import { Injectable, NgZone } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { APP_CONFIG } from '../app.config';
import { Ingredient as IngredientCommands, Recipe as RecipeCommands, Steps as StepsCommands, Timer as TimerCommands } from './command.parser';
import { ICookingRecipes, ISession, IUI } from '../redux';
import { Recipe } from '../recipes/recipe.model';
import { RecipesActions, UIActions } from '../core/redux.actions';
import { SpeakerService } from './speaker.service';
import { TimerService } from './timer.service';

const BOT_HEADERS = new Headers({ 'Authorization': `Bearer ${APP_CONFIG.bot.accessToken}` });

export interface IWindow extends Window {
    webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = <IWindow>window;

@Injectable()
export class VoiceAssistantService {
    @select('cookingRecipes') cookingRecipes$: Observable<ICookingRecipes>;
    @select('ui') ui$: Observable<IUI>;
    @select('session') session$: Observable<ISession>;
    private voiceAssistantEnabled: boolean = false;
    private recognition: any;
    private currentRecipe: Recipe;

    constructor(
        private http: Http,
        private recipesActions: RecipesActions,
        private speakerService: SpeakerService,
        private timerService: TimerService,
        private uiActions: UIActions,
        private zone: NgZone) {

        if (APP_CONFIG.canSpeechRecognition) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.lang = 'fr-FR';
            //this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.onresult = this.parseVoiceCommand;
            this.recognition.onsoundstart = this.onRecognitionSoundStart;
            this.recognition.onsoundend = this.onRecognitionSoundEnd;
            this.recognition.onerror = this.onRecognitionError;
        }

        this.ui$.subscribe(this.onUIChange);
        this.cookingRecipes$.subscribe(this.onCookingRecipesChange);

        this.speakerService.speaking.subscribe(this.onSpeakerSpeaks);
    }

    onUIChange = (ui: IUI) => {
        if (this.recognition && ui.voiceAssistant.enabled !== this.voiceAssistantEnabled) {
            if (ui.voiceAssistant.enabled) {
                this.speakerService.speak('Je suis à l\'écoute.', { ding: true });
            } else {
                this.recognition.stop();
            }

            this.voiceAssistantEnabled = ui.voiceAssistant.enabled;
        }
    }

    onCookingRecipesChange = (cookingRecipes: ICookingRecipes) => {
        let currentRecipe = cookingRecipes.current;

        if (currentRecipe && this.currentRecipe && currentRecipe._id === this.currentRecipe._id) {
            return;
        }

        this.currentRecipe = currentRecipe;

        let options = new RequestOptions({ headers: BOT_HEADERS });

        this.session$.first().subscribe((session: ISession) => {
            if (currentRecipe) {
                const params = {
                    name: 'recipe',
                    parameters: {
                        id: currentRecipe._id,
                        title: currentRecipe.title,
                    },
                };

                // Notify bot of current recipe
                this.http.post(`${APP_CONFIG.bot.url}/contexts?v=${APP_CONFIG.bot.version}&sessionId=${session.user.id}`, params, options).subscribe();
            }
        });
    }

    parseVoiceCommand = (event: any) => {
        let last = event.results.length - 1;
        let transcript = event.results[last][0].transcript;

        let options = new RequestOptions({ headers: BOT_HEADERS });

        this.session$.first().subscribe((session: ISession) => {
            const params = {
                lang: 'fr',
                sessionId: session.user.id,
                query: transcript,
            };

            // Send vocal transcript to bot
            this.http.post(`${APP_CONFIG.bot.url}/query?v=${APP_CONFIG.bot.version}`, params, options)
                .toPromise()
                .then(this.executeCommand)
                .catch(this.onBotError);
        });

        // const command = this.matchCommand(transcript);
        // if (command) {
        //     this.executeCommand(command);
        // } else {
        //     this.speakerService.speak('Désolé, je n\'ai pas compris.', { dialogTitle: ':(' });
        // }

        console.log('Event results', event.results);
        console.log('Result received:', transcript);
        console.log('Confidence: ' + event.results[0][0].confidence);
        console.log('---');
    }

    onRecognitionSoundStart = () => {
        this.zone.run(() => {
            this.uiActions.startListening();
        });
    }

    onRecognitionSoundEnd = () => {
        this.zone.run(() => {
            this.uiActions.stopListening();
        });
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

    onBotError = (error: any) => {
        debugger
    }

    executeCommand = (response: any) => {
        const command = response.json().result;
        const commandType: string = command.action.split('.')[0];

        this.currentRecipe$.first().subscribe((currentRecipe: Recipe) => {
            this.zone.run(() => {
                switch (commandType) {
                    case 'ingredient':
                        if (command.name === IngredientCommands.QUANTITY) {
                            if (currentRecipe) {
                                const matchingIngredients = currentRecipe.ingredients.filter((ingredient) => (ingredient.name.indexOf(command.parameters.ingredient) >= 0));
                                if (matchingIngredients.length === 1) {
                                    const ingredient = matchingIngredients[0];
                                    let unit: string;

                                    switch (ingredient.unit) {
                                        case 'cup':
                                            unit = 'tasse de';
                                            break;
                                        case 'box':
                                            unit = 'contenant de';
                                            break;
                                        case 'tsp':
                                            unit = 'cuillère à thé de';
                                            break;
                                        case 'tbsp':
                                            unit = 'cuillère à soupe de';
                                            break;
                                        case 'pinch':
                                            unit = 'pincée de';
                                            break;
                                        default:
                                            unit = ingredient.unit || '';
                                    }

                                    this.speakerService.speak(`${ingredient.quantity} ${unit} ${ingredient.name}`, {dialogTitle: 'Ingrédient'});
                                } else if (matchingIngredients.length > 1) {
                                    this.speakerService.speak(`Il y a plusieurs ${command.parameters.ingredient} dans les ingrédients. Pouvez-vous préciser ?`);
                                } else {
                                    this.speakerService.speak(`Je ne trouve pas l'ingrédient ${command.parameters.ingredient}. Pouvez-vous préciser ?`);
                                }
                            } else {
                                this.speakerService.speak('Vous n\'avez aucune recette en cours !');
                            }
                        }
                        break;
                    case 'recipe':
                        if (command.action === RecipeCommands.STOP) {
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

                        if (command.action === StepsCommands.READ_STEP) {
                            responseTitle = `Étape ${command.parameters.step}`;
                            recipeInstruction = currentRecipe.recipeInstructions[(command.parameters.step - 1)];
                        } else if (command.action === StepsCommands.NEXT_STEP) {
                            recipeInstruction = currentRecipe.recipeInstructions[1];
                        } else if (command.action === StepsCommands.PREVIOUS_STEP) {
                            recipeInstruction = currentRecipe.recipeInstructions[0];
                        } else if (command.action === StepsCommands.LAST_STEP) {
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
                        if (command.action === TimerCommands.START) {
                            let title = command.parameters.title || null;
                            let contextualDescription = command.parameters.title || null;

                            if (currentRecipe) {
                                title = currentRecipe.title;
                            }

                            const options = {
                                title: title,
                                contextualDescription: contextualDescription,
                                recipeId: currentRecipe ? currentRecipe._id : null,
                            };

                            let duration = command.parameters.duration.amount;
                            if (command.parameters.duration.unit === 'minute') {
                                duration = duration * 60;
                            } else if (command.parameters.duration.unit === 'h') {
                                duration = duration * 3600;
                            }

                            let humanDuration = '';
                            const hours = Math.floor(duration / 3600);
                            const minutes = Math.floor((duration - (hours * 3600)) / 60);
                            const seconds = Math.floor((duration - (hours * 3600)) - (minutes * 60));

                            if (hours >= 1) {
                                humanDuration += `${hours} heures `;
                            }
                            if (minutes >= 1) {
                                humanDuration += `${minutes} minutes `;
                            }
                            if (seconds >= 1) {
                                humanDuration += `${seconds} secondes `;
                            }

                            this.timerService.create(duration, options);
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