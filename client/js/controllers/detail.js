'use strict';

/* jshint -W098 */
angular.module('mean.kitchen').controller('DetailController', ['$scope', '$state', '$stateParams', 'Recipes', 'Kitchen', function($scope, $state, $stateParams, Recipes, Kitchen){

        $scope.units = {
            m: {
                code: 'metric',
                name: 'Métrique',
                icon: 'scale'
            },
            i: {
                code: 'imperial',
                name: 'Impérial',
                icon: 'measuring-cup'
            }
        };

        $scope.unit = $scope.units.m;
        $scope.recipeId = $stateParams.id;

        // Retrieve current recipe
        Recipes.get({
            recipeId: $scope.recipeId
        }, function(recipe) {
            $scope.recipe = recipe;

            $scope.yield = $scope.recipe.recipeYield;
        });

        var originatorEv;

        $scope.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.selectUnit = function(unit)  {
            $scope.unit = $scope.units[unit];
        };

        $scope.selectYield = function(portions)  {
            $scope.yield = portions;
        };

        $scope.isCooking = function() {
            return Kitchen.isCooking($scope.recipeId)
        };

        $scope.startCooking = function() {
            Kitchen.startCooking($scope.recipeId);
        };

        $scope.stopCooking = function() {
            Kitchen.stopCooking($scope.recipeId);
        };

        $scope.toggleFavorite = function() {
            Kitchen.toggleFavorite($scope.recipeId);
        };

        $scope.edit = function() {
            $state.go('edit', {id: $scope.recipeId});
        };

        $scope.getConvertedIngredient = function(originalIngredient) {
            var originalUnit = 'metric';
            var convertedIngredient;

            if ($scope.recipe.ingredientsUnit) {
                originalUnit = $scope.recipe.ingredientsUnit;
            }

            if (originalIngredient.unit) {
                var weightUnits = {
                    "mg": ["oz", 0.5],
                    "g": ["cup", 0.621371],
                    "kg": ["mi/s", 0.277778, 0.000172603109]
                };

                var volumeUnits = {
                    "ml": ["cup", 0.00422675284],
                    "cl": ["cup", 0.0422675284],
                    "dl": ["cup", 0.422675284],
                    "l": ["cup", 4.22675284]
                };

                switch(originalIngredient.unit) {

                }
            } else {
                convertedIngredient = originalIngredient;
            }
        };
    }]);