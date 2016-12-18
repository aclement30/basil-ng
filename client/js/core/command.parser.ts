export const Recipe = {
    START: 'recipe/START',
    END: 'recipe/END',
};

export const Steps = {
    READ_STEP: 'steps/READ_STEP',
    NEXT_STEP: 'steps/NEXT_STEP',
    PREVIOUS_STEP: 'steps/PREVIOUS_STEP',
    LAST_STEP: 'steps/LAST_STEP',
};

export const Timer = {
    START: 'timer/START',
    STOP: 'timer/STOP',
};

export class CommandParser {

    parse(input: string) {
        const parsingMethods: Function[] = [
            this.parseRecipe,
            this.parseSteps,
            this.parseTimer,
        ];

        let parsingResult: any = false;

        parsingMethods.some((method) => {
            const result = method(input);

            return parsingResult = result;
        });

        return parsingResult;
    }

    private parseRecipe(input: string) {
        if (input.match(/finir la recette/)) {
            return {
                name: Recipe.END,
            }
        } else if (input.match(/terminer la recette/)) {
            return {
                name: Recipe.END,
            }
        }

        return false;
    }

    private parseSteps(input: string) {
        let matches: any;
        if (matches = input.match(/l'étape ([0-9]+)/)) {
            return {
                name: Steps.READ_STEP,
                step: parseInt(matches[1]),
            }
        } else if (matches = input.match(/l'étape ([0-9]+)/)) {
            return {
                name: Steps.READ_STEP,
                step: parseInt(matches[1]),
            }
        } else if (matches = input.match(/première étape/)) {
            return {
                name: Steps.READ_STEP,
                step: 1,
            }
        } else if (matches = input.match(/(seconde|deuxième) étape/)) {
            return {
                name: Steps.READ_STEP,
                step: 2,
            }
        } else if (matches = input.match(/troisième étape/)) {
            return {
                name: Steps.READ_STEP,
                step: 3,
            }
        } else if (matches = input.match(/([0-9]+)e étape/)) {
            return {
                name: Steps.READ_STEP,
                step: parseInt(matches[1]),
            }
        } else if (input.match(/prochaine étape/)) {
            return {
                name: Steps.NEXT_STEP,
            }
        } else if (input.match(/étape suivante/)) {
            return {
                name: Steps.NEXT_STEP,
            }
        } else if (input.match(/étape précédente/)) {
            return {
                name: Steps.PREVIOUS_STEP,
            }
        } else if (input.match(/l'étape d'avant/)) {
            return {
                name: Steps.PREVIOUS_STEP,
            }
        } else if (input.match(/dernière étape/)) {
            return {
                name: Steps.LAST_STEP,
            }
        }

        return false;
    }

    private parseTimer(input: string) {
        let matches: any;

        const parseDescription = (transcript: string) => {
            let description = transcript.replace(/^(le|la|les)\s/, '').trim();
            description = description.charAt(0).toUpperCase() + description.substr(1).toLowerCase();
            return description;
        };

        if (matches = input.match(/minuterie ([0-9]+) heure(s)? (et)? ([0-9]+) minute pour (.+)/)) {
            return {
                name: Timer.START,
                duration: (parseInt(matches[1]) * 3600) + (parseInt(matches[2]) * 60),
                description: parseDescription(matches[3]),
            }
        } else if (matches = input.match(/minuterie ([0-9]+)h([0-9]+)/)) {
            return {
                name: Timer.START,
                duration: (parseInt(matches[1]) * 3600) + (parseInt(matches[2]) * 60),
            }
        } else if (matches = input.match(/minuterie ([0-9]+) heure(s)? (et)? trois quart/)) {
            return {
                name: Timer.START,
                duration: (parseInt(matches[1]) * 3600) + (45 * 60),
            }
        } else if (matches = input.match(/minuterie ([0-9]+)h (et)? trois quart/)) {
            return {
                name: Timer.START,
                duration: (parseInt(matches[1]) * 3600) + (45 * 60),
            }
        } else if (matches = input.match(/minuterie ([0-9]+) minute(s)? (et)? ([0-9]+) seconde(s)? pour (.+)/)) {
            return {
                name: Timer.START,
                duration: (parseInt(matches[1]) * 60) + (parseInt(matches[2])),
                description: parseDescription(matches[3]),
            }
        } else if (matches = input.match(/minuterie ([0-9]+) minute(s)? ([0-9]+)/)) {
            return {
                name: Timer.START,
                duration: (parseInt(matches[1]) * 60) + (parseInt(matches[3])),
            }
        } else if (matches = input.match(/minuterie ([0-9]+) minute(s)? pour (.+)/)) {
            return {
                name: Timer.START,
                duration: parseInt(matches[1]) * 60,
                description: parseDescription(matches[3]),
            }
        } else if (matches = input.match(/minuterie ([0-9]+) seconde/)) {
            return {
                name: Timer.START,
                duration: parseInt(matches[1]),
            }
        }

        return false;
    }
};
