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
'use strict';

/* jshint -W098 */
angular.module('mean.kitchen').controller('IndexController', ['$scope', 'Global', 'Kitchen', '$mdBottomSheet','$mdSidenav', '$mdDialog', 'Recipes', 'Category', '$timeout',
    function($scope, Global, Kitchen, $mdBottomSheet, $mdSidenav, $mdDialog, Recipes, Category, $timeout) {
        $scope.global = Global;

        Recipes.query(function(recipes) {
            $scope.recipes = recipes;
        });

        $scope.favoriteRecipes = Kitchen.getFavorites();

        $scope.categories = Category.get();
    }
]);
'use strict';

/* jshint -W098 */
angular.module('mean.kitchen').controller('KitchenController', ['$scope', 'Global', 'Kitchen',
  function($scope, Global, Kitchen) {
    $scope.global = Global;

    $scope.cookingRecipes = Kitchen.getCooking;
  }
]);

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