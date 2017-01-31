const ingredientParser = require('../ingredient.grammar.peg');
const Fraction = require('fraction.js');

export class Ingredient {
    description: string;
    quantity?: number;
    container?: any;
    name?: string;
    unit?: string;
    type?: string;

    constructor(data: any = {}) {
        Object.assign(this, data);
    }

    multiply(multiplier: number) {
        if (!multiplier) return;

        let newQuantity;
        let matches;

        if (String(this.quantity).match(/^([0-9.])+$/)) {
            newQuantity = new Fraction(+this.quantity * multiplier);
        } else if (matches = String(this.quantity).match(/^([0-9])+\/([0-9])+$/)) {
            newQuantity = new Fraction(+matches[1] * multiplier, +matches[2]);
        } else if (matches = String(this.quantity).match(/^([0-9])+\s([0-9])+\/([0-9])+$/)) {
            let numerator = (+matches[1] * +matches[3]) + +matches[2];
            newQuantity = new Fraction(numerator * multiplier, +matches[3]);
        }

        return this._formatFraction(newQuantity.toFraction(true));
    }

    _formatFraction(fraction: string) {
        fraction = fraction.replace('1/4', '¼');
        fraction = fraction.replace('1/2', '½');
        fraction = fraction.replace('3/4', '¾');
        fraction = fraction.replace('1/3', '⅓');
        fraction = fraction.replace('2/3', '⅔');
        fraction = fraction.replace('1/6', '⅙');
        fraction = fraction.replace('1/8', '⅛');

        return fraction;
    }
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

        if (this.ingredients) {
            this.ingredients = this.ingredients.map((ingredient) => {
                return new Ingredient(ingredient);
            });
        }
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
                ingredients.push(new Ingredient(Object.assign({
                    description: ingredient
                }, this.parseIngredient(ingredient))));
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
    multiplier: number;
    started: string;

    constructor(data: any = {}) {
        Object.assign(this, data);
    }
}