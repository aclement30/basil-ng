import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { APP_CONFIG } from '../app.config';
import { Ingredient as IngredientCommands, Recipe as RecipeCommands, Steps as StepsCommands, Timer as TimerCommands } from '../core/command.parser';
import { Recipe } from '../models/recipe.model';
import { SpeakerService } from './speaker.service';
import { TimerService } from './timer.service';
import { getCurrentCookingRecipe } from '../store/cooking-recipes.reducer';
import { getUIState, UIState } from '../store/ui.reducer';
import { getCurrentUser } from '../store/session.reducer';
import { UIActions } from '../store/ui.actions';
import { CookingRecipesActions } from '../store/cooking-recipes.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/index';
import { User } from '../models/user.model';

const BOT_HEADERS = { headers: { 'Authorization': `Bearer ${APP_CONFIG.bot.accessToken}` } };

const IDLE_TIMEOUT = 10000;

export interface IWindow extends Window {
    webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = <IWindow>window;

@Injectable()
export class VoiceAssistantService {
    private voiceAssistantEnabled = false;
    private recognition: any;
    private currentRecipe: Recipe;
    private waitingTimeout: any;

    constructor(
        private http: HttpClient,
        private recipesActions: CookingRecipesActions,
        private speakerService: SpeakerService,
        private store: Store<AppState>,
        private timerService: TimerService,
        private translate: TranslateService,
        private uiActions: UIActions,
        private zone: NgZone
    ) {
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

        this.store.select(getUIState).subscribe(this.onUIChange);
        this.store.select(getCurrentCookingRecipe).subscribe(this.onCookingRecipeChange);

        this.speakerService.speaking.subscribe(this.onSpeakerSpeaks);
    }

    onUIChange = (ui: UIState) => {
        if (this.recognition && ui.voiceAssistant.enabled !== this.voiceAssistantEnabled) {
            if (ui.voiceAssistant.enabled) {
                this.speakerService.speak(this.translate.instant('voiceAssistant.listening'), { ding: true });
                this.startIdleTimeout();
            } else {
                this.recognition.stop();
                this.stopIdleTimeout();
            }

            this.voiceAssistantEnabled = ui.voiceAssistant.enabled;
        }
    }

    onCookingRecipeChange = (currentRecipe: Recipe) => {
        if (currentRecipe && this.currentRecipe && currentRecipe._id === this.currentRecipe._id) {
            return;
        }

        this.currentRecipe = currentRecipe;

        if (currentRecipe) {
          this.store.select(getCurrentUser).take(1).subscribe((user: User) => {
            const params = {
              name: 'recipe',
              parameters: {
                id: currentRecipe._id,
                title: currentRecipe.title,
              },
            };

            // Notify bot of current recipe
            this.http.post(`${APP_CONFIG.bot.url}/contexts?v=${APP_CONFIG.bot.version}&sessionId=${user.id}`, params, BOT_HEADERS).subscribe();
          });
        }
    }

    parseVoiceCommand = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;

        this.store.select(getCurrentUser).take(1).subscribe((user: User) => {
            const params = {
                lang: 'fr',
                sessionId: user.id,
                query: transcript,
            };

            // Send vocal transcript to bot
            this.http.post(`${APP_CONFIG.bot.url}/query?v=${APP_CONFIG.bot.version}`, params, BOT_HEADERS)
                .subscribe(this.executeCommand, this.onBotError);
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
            this.stopIdleTimeout();

            this.uiActions.startListening();
        });
    }

    onRecognitionSoundEnd = () => {
        this.zone.run(() => {
            this.startIdleTimeout();

            this.uiActions.stopListening();
        });
    }

    onRecognitionError = (event: any) => {
        console.log('Error occurred in recognition:', event);
    }

    onSpeakerSpeaks = (isSpeaking: boolean) => {
        if (!this.voiceAssistantEnabled) return;

        if (isSpeaking) {
            this.stopIdleTimeout();
            this.recognition.stop();
        } else {
            this.startIdleTimeout();
            this.recognition.start();
        }
    }

    onBotError = (error: any) => {
        debugger
    }

    startIdleTimeout() {
        this.stopIdleTimeout();

        this.waitingTimeout = setTimeout(this.stopVoiceAssistant, IDLE_TIMEOUT);
    }

    stopIdleTimeout() {
        if (this.waitingTimeout) {
            clearTimeout(this.waitingTimeout);
        }
    }

    stopVoiceAssistant = () => {
        this.stopIdleTimeout();

        this.uiActions.disableVoiceAssistant();
    }

    executeCommand = (response: any) => {
        const command = response.json().result;
        const commandType: string = command.action.split('.')[0];

          this.zone.run(() => {
              switch (commandType) {
                  case 'ingredient':
                      if (command.name === IngredientCommands.QUANTITY) {
                          if (this.currentRecipe) {
                              const matchingIngredients = this.currentRecipe.ingredients.filter((ingredient) => (ingredient.name.indexOf(command.parameters.ingredient) >= 0));
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

                                  this.speakerService.speak(`${ingredient.quantity} ${unit} ${ingredient.name}`, { dialogTitle: this.translate.instant('common.ingredient') });
                              } else if (matchingIngredients.length > 1) {
                                  this.speakerService.speak(this.translate.instant('voiceAssistant.manySimilarIngredients', { ingredient: command.parameters.ingredient }));
                              } else {
                                  this.speakerService.speak(this.translate.instant('voiceAssistant.cannotFindIngredient', { ingredient: command.parameters.ingredient }));
                              }
                          } else {
                              this.speakerService.speak(this.translate.instant('voiceAssistant.noCookingRecipe'));
                          }
                      }
                      break;
                  case 'recipe':
                      if (command.action === RecipeCommands.STOP) {
                          if (this.currentRecipe) {
                              this.recipesActions.stopCooking(this.currentRecipe);
                              this.speakerService.speak(this.translate.instant('voiceAssistant.recipeCompleted'));
                          } else {
                              this.speakerService.speak(this.translate.instant('voiceAssistant.noCookingRecipe'));
                          }
                      }
                      break;
                  case 'steps':
                      let recipeInstruction: string;
                      let responseTitle: string;

                      if (command.action === StepsCommands.READ_STEP) {
                          responseTitle = `${this.translate.instant('common.step')} ${command.parameters.step}`;
                          recipeInstruction = this.currentRecipe.recipeInstructions[(command.parameters.step - 1)];
                      } else if (command.action === StepsCommands.NEXT_STEP) {
                          recipeInstruction = this.currentRecipe.recipeInstructions[1];
                      } else if (command.action === StepsCommands.PREVIOUS_STEP) {
                          recipeInstruction = this.currentRecipe.recipeInstructions[0];
                      } else if (command.action === StepsCommands.LAST_STEP) {
                          responseTitle = this.translate.instant('voiceAssistant.lastStep');
                          recipeInstruction = this.currentRecipe.recipeInstructions[(this.currentRecipe.recipeInstructions.length - 1)];
                      }

                      if (recipeInstruction) {
                          this.speakerService.speak(`${responseTitle}: ${recipeInstruction}`, {
                              dialogTitle: responseTitle,
                              dialogText: recipeInstruction
                          });
                      } else {
                          this.speakerService.speak(this.translate.instant('voiceAssistant.cannotFindStep'), {dialogTitle: ':('});
                      }
                      break;
                  case 'timer':
                      if (command.action === TimerCommands.START) {
                          let title = command.parameters.title || null;
                          const contextualDescription = command.parameters.title || null;

                          if (this.currentRecipe) {
                              title = this.currentRecipe.title;
                          }

                          const options = {
                              title: title,
                              contextualDescription: contextualDescription,
                              recipeId: this.currentRecipe ? this.currentRecipe._id : null,
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
                              humanDuration += `${hours} ${this.translate.instant('common.hours')} `;
                          }
                          if (minutes >= 1) {
                              humanDuration += `${minutes} ${this.translate.instant('common.minutes')} `;
                          }
                          if (seconds >= 1) {
                              humanDuration += `${seconds} ${this.translate.instant('common.seconds')} `;
                          }

                          this.timerService.create(duration, options);
                          this.speakerService.speak(`${this.translate.instant('common.timer')}: ${humanDuration}`, {dialogTitle: this.translate.instant('common.timer')});
                      }

                      break;
                  default:
                      this.speakerService.speak(this.translate.instant('voiceAssistant.unknownCommand'), {dialogTitle: ':('});
                      console.log('Unknown command:', command);
              }
          });
    }
}
