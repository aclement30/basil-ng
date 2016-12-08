'use strict';

angular.module('basilApp').factory('Ingredient', ['$filter',
    function($filter) {
        //-- Methods --//
        return {
            parse: function(ingredient) {
                try {
                    var parsedResult = Ingreedy.parse(ingredient.description);

                    ingredient.quantity = $filter('ingredientQuantity')(parsedResult.quantity, 'float');
                    ingredient.name = parsedResult.name;
                    ingredient.unit = parsedResult.unit;
                    ingredient.type = parsedResult.type;
                    if (parsedResult.container) {
                        ingredient.quantity = parseFloat(parsedResult.container.quantity);
                        ingredient.unit = parsedResult.container.unit;
                    }
                    console.log(ingredient);
                }
                catch(err) {
                    console.log(err);
                }

                return ingredient;
            },

            parseCombined: function(combinedIngredients) {
                var ingredientsList = combinedIngredients.split("\n"),
                    ingredients = [],
                    me = this;

                angular.forEach(ingredientsList, function(ingredient, key) {
                    var parsedIngredient = {
                        description: ingredient
                    };

                    parsedIngredient = me.parse(parsedIngredient);

                    ingredients.push(parsedIngredient);
                });

                return ingredients;
            },

            /**
             * Convert and editable quantity to a storable quantity
             *
             * @param originalQuantity
             */
            getStorableQuantity: function(originalQuantity) {

            },

            getConvertedIngredient: function(originalIngredient) {
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
            }
        };
    }
]);