(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('AppController', AppController);

    function AppController ($mdSidenav, $rootScope, Auth, $scope, $state, Kitchen) {
        var self = this;

        var _defaultUI = {
            section: null,
            addButton: true,
            backButton: true
        };

        self.ui = angular.extend({}, _defaultUI);

        $rootScope.$on('$stateChangeStart', function(event, toState){
            if (toState.data) {
                self.ui = angular.extend({}, _defaultUI, toState.data.ui);
            } else {
                self.ui = angular.extend({}, _defaultUI);
            }
        });

        self.closeMenu = closeMenu;
        self.toggleMenu = toggleMenu;
        self.logout = logout;

        self.cookingRecipes = Kitchen.cookingRecipes;

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function closeMenu() {
            $mdSidenav('left').close();
        }

        function logout() {
            Auth.logout(function(){
                $scope.setCurrentUser(null);
            });

            $state.go('login');
        }

        Auth.login(function() {
            $scope.setCurrentUser(Auth.user);
        });

        $scope.setCurrentUser = function (user) {
            $rootScope.currentUser = user;
        };
    }
})();
(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('DetailController', DetailController);

    function DetailController($state, $stateParams, Recipes, Kitchen) {
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

        self.unit = $scope.units.m;
        self.recipeId = $stateParams.id;

        // Retrieve current recipe
        Recipes.get({
            recipeId: self.recipeId
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
            Kitchen.startCooking(self.recipeId);
        };

        self.stopCooking = function() {
            Kitchen.stopCooking(self.recipeId);
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
(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('IndexController', IndexController);

    function IndexController(Global, Kitchen, $mdBottomSheet, $mdSidenav, $mdDialog, Recipe, Category) {
        var self = this;

        self.global = Global;

        Recipe.query(function(recipes) {
            self.recipes = recipes;
        });

        self.favoriteRecipes = Kitchen.favoriteRecipes;

        self.categories = Category.list;
    }
})();
(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('KitchenController', KitchenController);

    function KitchenController(Kitchen) {
        var self = this;

        //self.global = Global;

        self.cookingRecipes = Kitchen.getCooking;
    }
})();
