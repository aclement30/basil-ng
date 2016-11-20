(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('EditController', EditController);

    function EditController($state, $stateParams, $mdDialog, $mdToast, Recipe, Ingredient, $filter) {
        var self = this;

        self.recipe = {};
        self.recipeId = $stateParams.id;
        self.isSaving = false;
        self.editMode = false;

        // Retrieve current recipe
        if (self.recipeId) {
            Recipe.get({
                id: self.recipeId
            }, function (recipe) {
                angular.forEach(recipe.ingredients, function (ingredient, key) {
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

            self.editMode = true;
        }

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
            //self.recipe.ingredients = Ingredient.parseCombined(self.recipe.combinedIngredients);

            var ingredientsList = self.recipe.combinedIngredients.split("\n"),
                ingredients = [];

            angular.forEach(ingredientsList, function(ingredient, key) {
                ingredients.push({description: ingredient});
            });

            self.recipe.ingredients = ingredients;
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
                combinedInstructions.push(instruction);
            });

            return combinedInstructions.join("\n");
        };

        self.parseInstructions = function() {
            var instructionsList = self.recipe.combinedInstructions.split("\n"),
                instructions = [];

            angular.forEach(instructionsList, function(instruction, key) {
                instructions.push(instruction);
            });

            self.recipe.recipeInstructions = instructions;
        };

        self.delete = function() {
            if (confirm("Voulez-vous vraiment supprimer cette recette?")) {
                self.isSaving = true;

                Recipe.delete({id: self.recipeId}, function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Recette supprimée')
                            .highlightAction(true)
                            .position('top right')
                            .hideDelay(3000)
                    );

                    self.isSaving = false;

                    $state.go('recipes');
                });
            }
        };

        self.save = function() {
            self.isSaving = true;

            var successCallback = function() {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Recette enregistrée')
                        .position('top right')
                        .hideDelay(3000)
                );

                self.isSaving = false;

                if (self.editMode) {
                    $state.go('detail', {id: self.recipe._id});
                } else {
                    $state.go('recipes');
                }
            };
            var errorCallback = function(response) {
                self.isSaving = false;

                var errorMessage = "erreur serveur";
                if (response.data.error) {
                    errorMessage = response.data.error.message;
                }

                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Erreur')
                        .textContent('La sauvegarde a échouée (' + errorMessage + ')')
                        .ok('OK')
                );
            };

            var recipe;

            if (self.editMode) {
                recipe = self.recipe;

                Recipe.update(recipe, successCallback, errorCallback);
            } else {
                recipe = new Recipe();

                recipe.title = self.recipe.title;
                recipe.ingredients = self.recipe.ingredients;
                recipe.recipeInstructions = self.recipe.recipeInstructions;
                recipe.cookTime = self.recipe.cookTime || 0;
                recipe.prepTime = self.recipe.prepTime || 0;
                recipe.recipeYield = self.recipe.recipeYield || 1;
                recipe.image = self.recipe.image;
                recipe.originalUrl = self.recipe.originalUrl;

                Recipe.save(recipe, successCallback, errorCallback);
            }
        };
    }
})();