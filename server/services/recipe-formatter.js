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
            let description = ingredient.description;

            if (description) {
              description = description.trim();
              description = description.replace(/([\n\s])+/g, " ");
              description = description.replace(/’/, "'");
              description = description.replace(/([0-9]),([0-9])/g, '$1.$2');
              description = description.replace(/¼/, '1/4');
              description = description.replace(/½/, '1/2');
              description = description.replace(/¾/, '3/4');
              description = description.replace(/⅓/, '1/3');
              description = description.replace(/⅔/, '2/3');
              description = description.replace(/⅕/, '1/5');
              description = description.replace(/⅖/, '2/5');
              description = description.replace(/⅗/, '3/5');
              description = description.replace(/⅘/, '4/5');
              description = description.replace(/⅙/, '1/6');
              description = description.replace(/⅚/, '5/6');
              description = description.replace(/⅛/, '1/8');
              description = description.replace(/⅜/, '3/8');
              description = description.replace(/⅝/, '5/8');
              description = description.replace(/⅞/, '7/8');
              description = description.replace(/⅒/, '1/10');

              ingredient.description = description;
            }

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
