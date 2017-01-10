const ingredientParser = require('../ingredient.grammar.peg');

export class Ingredient {
    description: string;
    quantity?: number;
    container?: any;
    name?: string;
    unit?: string;
    type?: string;
}

export class Recipe {
    _id: string;
    title: string;
    cookTime: number;
    prepTime: number;
    totalTime: number;
    recipeYield: number;
    image: string;
    ingredientsUnit: string;
    ingredients: Ingredient[];
    recipeInstructions: string[];
    notes: string;
    rating: number;
    originalUrl: string;
    user: string;
    created: Date;
    isDeleted: boolean;

    constructor(data: any = {}) {
        Object.assign(this, data);
    }

    get combinedIngredients(): string {
        const combinedIngredients: string[] = [];

        if (!this.ingredients) return '';

        this.ingredients.forEach((ingredient: Ingredient) => {
            combinedIngredients.push(ingredient.description);
        });

        return combinedIngredients.join("\n");
    }

    set combinedIngredients(combinedIngredients: string) {
        const ingredientsList = combinedIngredients.split("\n");
        const ingredients: Ingredient[] = [];

        ingredientsList.forEach((ingredient: string) => {
            if (ingredient && ingredient != '') {
                ingredients.push(Object.assign({
                    description: ingredient
                }, this.parseIngredient(ingredient)));
            }
        });

        this.ingredients = ingredients;
    }

    get combinedInstructions(): string {
        const combinedInstructions: string[] = [];

        if (!this.recipeInstructions) return '';

        this.recipeInstructions.forEach((instruction: string) => {
            combinedInstructions.push(instruction);
        });

        return combinedInstructions.join("\n");
    }

    set combinedInstructions(combinedInstructions: string) {
        const instructionsList = combinedInstructions.split("\n");
        const instructions: string[] = [];

        instructionsList.forEach((instruction: string) => {
            if (instruction && instruction != '') instructions.push(instruction);
        });

        this.recipeInstructions = instructions;
    }

    parseIngredient(description: string): Ingredient {
        let parsedIngredient: Ingredient;

        try {
            parsedIngredient = ingredientParser.parse(description.trim());
            if (parsedIngredient.quantity) {
                parsedIngredient.quantity = parsedIngredient.quantity;
            }
        } catch(error) {
            console.warn(error);
        }

        return parsedIngredient;
    }
}

export class RecipeSummary {
    _id: string;
    title: string;
    image: string;
}