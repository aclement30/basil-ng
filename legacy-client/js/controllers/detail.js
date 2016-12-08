(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('DetailController', DetailController);

    function DetailController($state, $stateParams, Recipe, Kitchen) {
        var self = this;

        self.units = {
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

        self.unit = self.units.m;
        self.recipeId = $stateParams.id;

        // Retrieve current recipe
        Recipe.get({
            id: self.recipeId
        }, function(recipe) {
            self.recipe = recipe;

            self.yield = self.recipe.recipeYield;
        });

        var originatorEv;

        self.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        self.selectUnit = function(unit)  {
            self.unit = self.units[unit];
        };

        self.selectYield = function(portions)  {
            self.yield = portions;
        };

        self.isCooking = function() {
            return Kitchen.isCooking(self.recipeId)
        };

        self.startCooking = function() {
            Kitchen.toggleCooking(self.recipeId);
        };

        self.stopCooking = function() {
            Kitchen.toggleCooking(self.recipeId);
        };

        self.toggleFavorite = function() {
            Kitchen.toggleFavorite(self.recipeId);
        };

        self.edit = function() {
            $state.go('edit', {id: self.recipeId});
        };

        self.getConvertedIngredient = function(originalIngredient) {
            var originalUnit = 'metric';
            var convertedIngredient;

            if (self.recipe.ingredientsUnit) {
                originalUnit = self.recipe.ingredientsUnit;
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
    }
})();