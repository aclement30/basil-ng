class RecipeFormatterService {

    constructor() {}

    formatRecipe(recipe) {
        recipe.ingredients = this.formatIngredients(recipe.ingredients);

        let combinedIngredients = [];
        recipe.ingredients.forEach((ingredient) => {
            combinedIngredients.push(ingredient.description);
        });
        recipe.combinedIngredients = combinedIngredients.join("\n");
        recipe.recipeInstructions = this.formatInstructions(recipe.recipeInstructions);

        return recipe;
    }

    formatIngredients(ingredients) {
        return ingredients.map((ingredient) => {
            ingredient.description = ingredient.description.trim();
            ingredient.description = ingredient.description.replace(/([\n\s])+/g, " ");
            return ingredient;
        });
    }
    formatInstructions(instructions) {
        // Remove line numbers
        return instructions.map((instruction) => {
            instruction = instruction.trim();
            instruction = instruction.replace(/^([0-9])+\.\s/g, '');
            return instruction;
        });
    }
}

module.exports = new RecipeFormatterService();
