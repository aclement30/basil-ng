'use strict';

/* jshint -W098 */
angular.module('mean.kitchen').controller('NewController', ['$scope', '$state', 'Recipes', 'Ingredient', '$http', function($scope, $state, Recipes, Ingredient, $http){

        $scope.selectedTabIndex = 0;

        $scope.recipe = {
            ingredients: [],
            combinedIngredients: null,
            ingredientsUnit: 'metric',
            recipeInstructions: [],
            combinedInstructions: null,
            recipeYield: 1,
        };

        $scope.yield = $scope.recipe.recipeYield;

        /*$scope.addIngredient = function() {
            $scope.recipe.ingredients.push({});
        };

        $scope.removeIngredient = function(index) {
            $scope.recipe.ingredients.splice(index, 1);
        };*/

        $scope.parseIngredients = function() {
            $scope.recipe.ingredients = Ingredient.parseCombined($scope.recipe.combinedIngredients);
        };

        /*$scope.addStep = function() {
            $scope.recipe.recipeInstructions.push({description: null});
        };

        $scope.removeStep = function(index) {
            $scope.recipe.recipeInstructions.splice(index, 1);
        };*/

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

        $scope.parseUrl = function() {
            $http.post('/api/recipes/parseUrl/', {
                url: $scope.remoteUrl
            }).then(function successCallback(response) {
                $scope.recipe = response.data;

                $scope.selectedTabIndex = 1;
            }, function errorCallback(response) {
                debugger;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };

        $scope.save = function() {
            var recipe = new Recipes($scope.recipe);

            recipe.$save(function(response) {
                $state.go('detail', {id: response._id});
            });

            $scope.recipe = {};
        };
    }]);