(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('EditController', EditController);

    function EditController($state, $stateParams, Recipe, Ingredient, $filter) {
        var self = this;

        self.recipeId = $stateParams.id;

        // Retrieve current recipe
        Recipe.get({
            recipeId: self.recipeId
        }, function(recipe) {
            angular.forEach(recipe.ingredients, function(ingredient, key){
                if (!ingredient.description) {
                    ingredient.description = $filter('ingredientQuantity')(ingredient.quantity, 'text');
                    if (ingredient.unit) ingredient.description += ' ' + $filter('ingredientUnit')(ingredient.unit);
                    ingredient.description += ' ' + ingredient.name;
                    if (ingredient.type) ingredient.description += ' ' + ingredient.type;
                }
            });

            recipe.combinedIngredients = self.combineIngredients(recipe.ingredients);
            recipe.combinedInstructions = self.combineInstructions(recipe.recipeInstructions);
            self.recipe = recipe;

            self.yield = self.recipe.recipeYield;
        });

        /*self.addIngredient = function() {
         self.recipe.ingredients.push({});
         };

         self.removeIngredient = function(index) {
         self.recipe.ingredients.splice(index, 1);
         };*/

        self.combineIngredients = function(ingredients) {
            var combinedIngredients = [];

            angular.forEach(ingredients, function(ingredient, key) {
                combinedIngredients.push(ingredient.description);
            });

            return combinedIngredients.join("\n");
        };

        self.parseIngredients = function() {
            self.recipe.ingredients = Ingredient.parseCombined(self.recipe.combinedIngredients);
        };

        /*self.addStep = function() {
         self.recipe.recipeInstructions.push({description: null});
         };

         self.removeStep = function(index) {
         self.recipe.recipeInstructions.splice(index, 1);
         };*/

        self.combineInstructions = function(instructions) {
            var combinedInstructions = [];

            angular.forEach(instructions, function(instruction, key) {
                combinedInstructions.push(instruction.description);
            });

            return combinedInstructions.join("\n");
        };

        self.parseInstructions = function() {
            var instructionsList = self.recipe.combinedInstructions.split("\n"),
                instructions = [];

            angular.forEach(instructionsList, function(instruction, key) {
                instructions.push({
                    description: instruction
                });
            });

            self.recipe.recipeInstructions = instructions;
        };

        self.delete = function() {
            if (confirm("Voulez-vous vraiment supprimer cette recette?")) {
                self.recipe.$remove(function(response) {
                    $state.go('recipes');
                });
            }
        };

        self.save = function() {
            var recipe = self.recipe;
            recipe.updated = new Date().getTime();

            recipe.$update(function() {
                $state.go('detail', {id: self.recipe._id});
            });
        };
    }
})();