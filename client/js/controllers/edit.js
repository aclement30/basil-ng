'use strict';

/* jshint -W098 */
angular.module('mean.kitchen').controller('EditController', ['$scope', '$state', '$stateParams', 'Recipes', 'Ingredient', '$filter', function($scope, $state, $stateParams, Recipes, Ingredient, $filter){

    $scope.recipeId = $stateParams.id;

    // Retrieve current recipe
    Recipes.get({
        recipeId: $scope.recipeId
    }, function(recipe) {
        angular.forEach(recipe.ingredients, function(ingredient, key){
            if (!ingredient.description) {
                ingredient.description = $filter('ingredientQuantity')(ingredient.quantity, 'text');
                if (ingredient.unit) ingredient.description += ' ' + $filter('ingredientUnit')(ingredient.unit);
                ingredient.description += ' ' + ingredient.name;
                if (ingredient.type) ingredient.description += ' ' + ingredient.type;
            }
        });

        recipe.combinedIngredients = $scope.combineIngredients(recipe.ingredients);
        recipe.combinedInstructions = $scope.combineInstructions(recipe.recipeInstructions);
        $scope.recipe = recipe;

        $scope.yield = $scope.recipe.recipeYield;
    });

    /*$scope.addIngredient = function() {
        $scope.recipe.ingredients.push({});
    };

    $scope.removeIngredient = function(index) {
        $scope.recipe.ingredients.splice(index, 1);
    };*/

    $scope.combineIngredients = function(ingredients) {
        var combinedIngredients = [];

        angular.forEach(ingredients, function(ingredient, key) {
            combinedIngredients.push(ingredient.description);
        });

        return combinedIngredients.join("\n");
    };

    $scope.parseIngredients = function() {
        $scope.recipe.ingredients = Ingredient.parseCombined($scope.recipe.combinedIngredients);
    };

    /*$scope.addStep = function() {
        $scope.recipe.recipeInstructions.push({description: null});
    };

    $scope.removeStep = function(index) {
        $scope.recipe.recipeInstructions.splice(index, 1);
    };*/

    $scope.combineInstructions = function(instructions) {
        var combinedInstructions = [];

        angular.forEach(instructions, function(instruction, key) {
            combinedInstructions.push(instruction.description);
        });

        return combinedInstructions.join("\n");
    };

    $scope.parseInstructions = function() {
        var instructionsList = $scope.recipe.combinedInstructions.split("\n"),
            instructions = [];

        angular.forEach(instructionsList, function(instruction, key) {
            instructions.push({
                description: instruction
            });
        });

        $scope.recipe.recipeInstructions = instructions;
    };

    $scope.delete = function() {
        if (confirm("Voulez-vous vraiment supprimer cette recette?")) {
            $scope.recipe.$remove(function(response) {
                $state.go('recipes');
            });
        }
    };

    $scope.save = function() {
        var recipe = $scope.recipe;
        recipe.updated = new Date().getTime();

        recipe.$update(function() {
            $state.go('detail', {id: $scope.recipe._id});
        });
    };
}]);