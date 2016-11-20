(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//'use strict';
// Declare app level module which depends on filters, and services
angular.module('basilApp', [
        'basilApp.controllers',
        'basilApp.directives',
        'basilApp.filters',
        'basilApp.services',
        'ui.router',
        'ngMaterial',
        'ngResource',
        'ngMessages',
        'ngSanitize',
        'angularMoment',
        'md.data.table',
        'LocalStorageModule'
    ])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('KITCHEN_EVENTS', {
        cookingRecipesUpdate: 'cooking-recipes-update'
    })
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$mdThemingProvider',
        '$mdIconProvider',
        '$mdDateLocaleProvider',
        'moment',
        '$httpProvider',
        'localStorageServiceProvider',

        function($stateProvider,
                 $urlRouterProvider,
                 $mdThemingProvider,
                 $mdIconProvider,
                 $mdDateLocaleProvider,
                 moment,
                 $httpProvider,
                 USER_ROLES,
                 localStorageServiceProvider) {

            /*localStorageServiceProvider
                .setPrefix('basil');*/

            $urlRouterProvider.otherwise('/recipes');

            $stateProvider
                .state('recipes', {
                    url: '/recipes',
                    templateUrl: 'views/index/index.html',
                    controller: 'IndexController',
                    controllerAs: 'ctrl'
                })
                .state('new', {
                    url: '/recipes/add',
                    templateUrl: 'views/edit/edit.html',
                    controller: 'EditController',
                    controllerAs: 'ctrl'
                })
                .state('detail', {
                    url: '/recipes/{id}',
                    templateUrl: 'views/detail/detail.html',
                    controller: 'DetailController',
                    controllerAs: 'ctrl'
                })
                .state('edit', {
                    url: '/recipes/{id}/edit',
                    templateUrl: 'views/edit/edit.html',
                    controller: 'EditController',
                    controllerAs: 'ctrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'LoginController',
                    data: {
                        currentSection: {
                            title: 'Connexion',
                            state: 'login'
                        }
                    }
                });

            $mdIconProvider
                .defaultFontSet('material-icons');

            $mdThemingProvider.theme('default')
                .primaryPalette('teal')
                .accentPalette('lime')
                .warnPalette('deep-orange')
                .backgroundPalette('grey');

            $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            $mdDateLocaleProvider.shortMonths = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
            $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
            $mdDateLocaleProvider.firstDayOfWeek = 1;
            $mdDateLocaleProvider.formatDate = function(date) {
                return moment(date).format('DD.MM.YYYY');
            };
            $mdDateLocaleProvider.msgCalendar = 'Calendrier';
            $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';

            $httpProvider.interceptors.push([
                '$injector',
                function ($injector) {
                    return $injector.get('AuthInterceptor');
                }
            ]);
        }
    ])
    .run([
        '$rootScope',
        'amMoment',
        'Auth',
        'AUTH_EVENTS',
        '$state',

        function ($rootScope, amMoment, Auth, AUTH_EVENTS, $state) {
            amMoment.changeLocale('fr');

            $rootScope.currentPage = {
                requests: {}
            };

            $rootScope.serverIsOnline = true;
            $rootScope.tasks = {};

            /*$rootScope.$on('$stateChangeStart', function (event, next) {
                if (!Auth.isAuthenticated()) {
                    event.preventDefault();

                    // User is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }

                if (next.name == 'login' && Auth.isAuthenticated()) {
                    event.preventDefault();
                    $state.go('recipes');
                }
            });*/

            $rootScope.$on(AUTH_EVENTS.loginFailed, function(event){
                $state.go('login');
            });
        }
    ]);

angular.module('basilApp.controllers', []);
angular.module('basilApp.filters', []);
angular.module('basilApp.services', []);
angular.module('basilApp.directives', []);
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('IndexController', IndexController);

    function IndexController(Kitchen, $mdBottomSheet, $mdSidenav, $mdDialog, Recipe, Category) {
        var self = this;

        Recipe.query(function(recipes) {
            self.recipes = recipes;
        });

        self.favoriteRecipes = Kitchen.favoriteRecipes;

        self.categories = Category.list;
    }
})();
},{}],6:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('LoginController', LoginController);

    function LoginController ($mdDialog, $sce) {
        var self = this;

        var queryStringValue = function (field) {
            var href = window.location.href;
            var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
            var string = reg.exec(href);
            return string ? string[1] : null;
        };

        var authError = queryStringValue('error');

        if (authError) {
            var authErrorMessage;
            switch(authError) {
                default:
                    authErrorMessage = "Erreur inconnue lors de l'authentification via Google";
                    break;
            }

            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Erreur')
                    .htmlContent($sce.trustAsHtml(authErrorMessage))
                    .ok('OK')
            );
        }
    }
})();
},{}],7:[function(require,module,exports){

},{}],8:[function(require,module,exports){
'use strict';

angular.module('basilApp')
    .filter('ingredientUnit', function() {
        return function (input) {
            switch (input) {
                case 'cup':
                    return 'tasse';
                    break;
                case 'box':
                    return 'contenant';
                    break;
                case 'tsp':
                    return 'c. à c.';
                    break;
                case 'tbsp':
                    return 'c. à s.';
                    break;
                case 'pinch':
                    return 'pincée';
                    break;
                default:
                    return input;
                    break;
            }
        }
    })

    .filter('capitalize', function() {
        return function(input, scope) {
            if (input!=null)
                input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
    });
},{}],9:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('basilApp.services')
        .factory('Auth', AuthService);

    function AuthService($rootScope, $http, AUTH_EVENTS, localStorageService) {
        var AuthService = {
            user: null,
            authenticated: false
        };

        // Retrieve user auth details from local storage
        if (localStorageService.isSupported) {
            var user = localStorageService.get('user');
            if (user) {
                AuthService.user = user;
                AuthService.authenticated = true;
            }
        }

        AuthService.login = function(callback) {
            $http({ method: 'GET', url: '/api/user' })

                // User successfully authenticates
                .success(function(data, status, headers, config) {
                    AuthService.authenticated = true;
                    AuthService.user = data;

                    // Store user auth details in local storage
                    if (localStorageService.isSupported) {
                        localStorageService.set('user', data);
                    }

                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                    if (typeof(callback) === typeof(Function)) callback();
                })

                // Not logged in
                .error(function(data, status, headers, config) {
                    AuthService.authenticated = false;
                    AuthService.user = null;

                    if (localStorageService.isSupported) {
                        localStorageService.remove('user');
                    }

                    if (typeof(callback) === typeof(Function)) callback();

                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);

                    if (typeof(callback) === typeof(Function)) callback();
                });
        };

        AuthService.logout = function(callback) {
            AuthService.authenticated = false;
            AuthService.user = null;

            $http({ method: 'GET', url: '/logout' })

            // User successfully logged out
                .success(function(data, status, headers, config) {
                    if (localStorageService.isSupported) {
                        localStorageService.remove('user');
                    }

                    if (typeof(callback) === typeof(Function)) callback();
                })

                // Sign out error
                .error(function(data, status, headers, config) {
                    if (typeof(callback) === typeof(Function)) callback();
                });
        };

        AuthService.isAuthenticated = function () {
            return AuthService.authenticated;
        };

        return AuthService;
    }
})();
},{}],10:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('basilApp.services')
        .factory('AuthInterceptor', AuthInterceptor);

    function AuthInterceptor($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return $q.reject(response);
            }
        };
    }
})();
},{}],11:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('basilApp.services')
        .factory('AuthResolver', AuthResolver);

    function AuthResolver($q, $rootScope, $state) {
        return {
            resolve: function () {
                var deferred = $q.defer();
                var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
                    if (angular.isDefined(currentUser)) {
                        if (currentUser) {
                            deferred.resolve(currentUser);
                        } else {
                            deferred.reject();
                            $state.go('login');
                        }

                        unwatch();
                    }
                });
                return deferred.promise;
            }
        };
    }
})();
},{}],12:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('basilApp.services')
        .factory('Category', Category);

    function Category (){
        var Category = {};

        //-- Variables --//
        var _categories = [
            {
                name: 'Déjeuner',
                alias: 'dejeuner'
            },
            {
                name: 'Boissons & cocktails',
                alias: 'boissons'
            },
            {
                name: 'Collations',
                alias: 'collations'
            },
            {
                name: 'Bouchées & entrées',
                alias: 'bouchees'
            },
            {
                name: 'Soupes & potages',
                alias: 'soupes'
            },
            {
                name: 'Lunch & salade',
                alias: 'lunch'
            },
            {
                name: 'Sandwichs',
                alias: 'sandwichs'
            },
            {
                name: 'Légumes & gratins',
                alias: 'légumes'
            },
            {
                name: 'Pâtes & riz',
                alias: 'pates'
            },
            {
                name: 'Poisson & fruit de mer',
                alias: 'poisson'
            },
            {
                name: 'Viande',
                alias: 'viande'
            },
            {
                name: 'Dessert',
                alias: 'dessert'
            }
        ];

        Category.list = {};

        angular.forEach(_categories, function(category){
            Category.list[category.alias] = category;
        });

        return Category;
    }
})();
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('basilApp.services')
        .factory('Kitchen', Kitchen);

    function Kitchen (Recipe, $rootScope, $http, KITCHEN_EVENTS){
        var Kitchen = {};

        //-- Variables --//
        var _recipes = [
            {
                id: 1,
                title: 'Cari de poulet et de poivron rouge',
                cookTime: 15,
                prepTime: 10,
                totalTime: 25,
                recipeCategory: '',
                image: 'http://www.ricardocuisine.com/pictures/cache/d7dd18bd7059b1e3ce588a0bf45c2af7_w1074.jpg',
                recipeYield: 4,
                ingredients: [
                    {
                        quantity: 1,
                        name: 'Oignon',
                        type: 'coupé en quartier'
                    },
                    {
                        quantity: 1,
                        name: 'Poivron rouge',
                        type: 'coupé en cubes'
                    },
                    {
                        quantity: 30,
                        unit: 'ml',
                        name: 'Huile d\'olive'
                    }
                ],
                recipeInstructions: [
                    {
                        description: "Dans une grande poêle, dorer l'oignon et le poivron dans l'huile à feu vif jusqu'à ce qu'ils soient tendres. Ajouter le poulet, l'ail et les épices. Faire dorer environ 2 minutes. Saler et poivrer."
                    },
                    {
                        description: "Ajouter le lait de coco et le miel. Porter à ébullition et laisser mijoter doucement environ 8 minutes ou jusqu'à ce que le poulet soit cuit. Rectifier l'assaisonnement."
                    },
                    {
                        description: "Servir sur un riz basmati."
                    }
                ],
                notes: [],
                rating: 4,
                originalUrl: 'http://www.ricardocuisine.com/recettes/3012-cari-de-poulet-et-de-poivron-rouge'
            },
            {
                id: 2,
                title: 'Cake au citron, framboise & yogourt',
                cookTime: 15,
                prepTime: 45,
                totalTime: 60,
                recipeCategory: '',
                image: 'http://cdn-tfpj.telusportal.com/documents/1364213/0/Cake-au-citron-et-framboises+M.jpg/b1aa0d0f-a6ff-47ae-8b40-6dc641bbac84?t=1440426476000',
                recipeYield: 6,
                ingredientsUnit: 'imperial',
                ingredients: [
                    {
                        quantity: 1.5,
                        unit: 'cup',
                        name: 'Farine'
                    },
                    {
                        quantity: 4.5,
                        unit: 'tsp',
                        name: 'Poudre à pâte'
                    },
                    {
                        quantity: 1,
                        unit: 'pinch',
                        name: 'Sel'
                    },
                    {
                        quantity: 1,
                        unit: 'tbsp',
                        name: 'Zeste de citron'
                    },
                    {
                        quantity: 3,
                        unit: 'tbsp',
                        name: 'Jus de citron'
                    },
                    {
                        quantity: 0.75,
                        unit: 'cup',
                        name: 'Sucre'
                    },
                    {
                        quantity: 2,
                        name: 'Oeufs'
                    },
                    {
                        quantity: 0.5,
                        unit: 'cup',
                        name: 'Huile de canola'
                    },
                    {
                        quantity: 0.75,
                        unit: 'cup',
                        name: 'Yogourt grec',
                        type: 'à la vanille'
                    },
                    {
                        quantity: 1,
                        unit: 'box',
                        name: 'Framboises fraîches'
                    },
                ],
                recipeInstructions: [
                    {
                        description: "Préchauffer le four à 350 °F. Tapisser un moule à pain de papier parchemin. Réserver."
                    },
                    {
                        description: "Dans un bol, mélanger la farine, le bicarbonate de soude et le sel. Réserver."
                    },
                    {
                        description: "Dans un autre bol, mélanger le zeste et le jus de citron avec le sucre."
                    },
                    {
                        description: "Incorporer les œufs un à un, en fouettant entre chaque addition, puis ajouter l'huile et le yogourt."
                    },
                    {
                        description: "Verser la farine, bien mélanger, puis ajouter les framboises délicatement sans trop mélanger."
                    },
                    {
                        description: "Verser au fond du moule, puis enfourner pendant 45 minutes, ou jusqu'à ce que le centre soit bien cuit."
                    }
                ],
                notes: [],
                rating: 4,
                originalUrl: 'http://www.troisfoisparjour.com/fr/web/trois-fois-par-jour/recettes/desserts/cake-au-citron-framboise-yogourt'
            },
            {
                id: 3,
                title: 'Muffins pommes et cheddar',
                cookTime: 25,
                prepTime: 10,
                totalTime: 35,
                recipeCategory: '',
                image: 'http://www.meilleuravecdubeurre.com/wp-content/uploads/2013/10/muffins_pommes_cheddar1.jpg',
                recipeYield: 10,
                ingredientsUnit: 'imperial',
                ingredients: [
                    {
                        quantity: 0.25,
                        unit: 'cup',
                        name: 'Beurre',
                        type: 'fondu'
                    },
                    {
                        quantity: 0.5,
                        unit: 'cup',
                        name: 'Sirop d\'érable'
                    },
                    {
                        quantity: 0.5,
                        unit: 'tsp',
                        name: 'Vanille'
                    },
                    {
                        quantity: 1,
                        name: 'Oeuf'
                    },
                    {
                        quantity: 1,
                        unit: 'cup',
                        name: 'Farine'
                    },
                    {
                        quantity: 0.5,
                        unit: 'tsp',
                        name: 'Bicarbonate de soude'
                    },
                    {
                        quantity: 1,
                        unit: 'tsp',
                        name: 'Poudre à pâte'
                    },
                    {
                        quantity: 1,
                        unit: 'pinch',
                        name: 'Sel'
                    },
                    {
                        quantity: 0.5,
                        unit: 'tsp',
                        name: 'Cannelle'
                    },
                    {
                        quantity: 0.25,
                        unit: 'tsp',
                        name: 'Muscade'
                    },
                    {
                        quantity: 0.5,
                        unit: 'cup',
                        name: 'Yogourt grec',
                        type: 'à la vanille'
                    },
                    {
                        quantity: 1.5,
                        unit: 'cup',
                        name: 'Pommes',
                        type: 'coupées en dés'
                    },
                    {
                        quantity: 1,
                        unit: 'cup',
                        name: 'Cheddar',
                        type: 'râpé'
                    }
                ],
                recipeInstructions: [
                    {
                        description: "Préchauffer le four à 350 °F."
                    },
                    {
                        description: "Dans un bol, battre l’huile, l’oeuf, le sucre, et la vanille à l’aide d’un fouet."
                    },
                    {
                        description: "Dans un autre bol, mélanger tous les ingrédients secs. Incorporer graduellement le mélange de farine dans le premier mélange en alternant avec le lait."
                    },
                    {
                        description: "Ajouter les pommes et le fromage râpé. Mélanger légèrement."
                    },
                    {
                        description: "Verser le mélange dans des moules à muffins et cuire environ 20-25 minutes."
                    }
                ],
                notes: [],
                rating: 4,
                originalUrl: 'http://www.meilleuravecdubeurre.com/2013/10/08/muffins-pommes-cheddar/'
            },
            {
                id: 4,
                title: 'Gâteau aux carottes',
                cookTime: 40,
                prepTime: 20,
                totalTime: 60,
                recipeCategory: '',
                image: 'http://p8.storage.canalblog.com/82/59/145454/21238289_p.jpg',
                recipeYield: 8,
                ingredientsUnit: 'metric',
                ingredients: [
                    {
                        quantity: 280,
                        unit: 'g',
                        name: 'Carottes',
                        type: 'râpées'
                    },
                    {
                        quantity: 100,
                        unit: 'g',
                        name: 'Farine'
                    },
                    {
                        quantity: 1,
                        unit: 'tsp',
                        name: 'Poudre à pâte'
                    },
                    {
                        quantity: 3,
                        name: 'Oeufs'
                    },
                    {
                        quantity: 200,
                        unit: 'g',
                        name: 'Cassonade'
                    },
                    {
                        quantity: 125,
                        unit: 'g',
                        name: 'Poudre de noisette'
                    },
                    {
                        quantity: 125,
                        unit: 'g',
                        name: 'Poudre d\'amande'
                    },
                    {
                        quantity: 1,
                        name: 'Jus de citron + zeste'
                    },
                    {
                        quantity: 0.75,
                        unit: 'cup',
                        name: 'Yogourt grec',
                        type: 'à la vanille'
                    },
                    {
                        quantity: 1,
                        unit: 'tsp',
                        name: 'Cannelle'
                    },
                    {
                        quantity: 1,
                        unit: 'tsp',
                        name: 'Gingembre moulu'
                    },
                    {
                        quantity: 0.5,
                        unit: 'tsp',
                        name: 'Poudre de muscade'
                    },
                    {
                        quantity: 1,
                        unit: 'pinch',
                        name: 'Sel'
                    }
                ],
                recipeInstructions: [
                    {
                        description: "Préchauffer le four à 180°C."
                    },
                    {
                        description: "Râper les carottes et les mélanger au jus de citron."
                    },
                    {
                        description: "Fouetter les oeuf et la cassonade. Ajouter la farine, la levure, les poudres de noisettes et amandes, le sel. Mélanger et rajouter ensuite le yogourt, les épices et les carottes rapées."
                    },
                    {
                        description: "Beurrer un moule à cake."
                    },
                    {
                        description: "Enfourner pour 40 min en vérifiant la cuisson à l'aide d'un pic en bois."
                    },
                    {
                        description: "Laisser refroidir dans le moule et retourner sur le plat de présentation."
                    }
                ],
                notes: [],
                rating: 4,
                originalUrl: 'http://delicesdhelene.canalblog.com/archives/2008/01/21/7630661.html'
            }
        ];

        Kitchen.recipes = {};
        Kitchen.favoriteRecipes = {};
        Kitchen.cookingRecipes = {};

        Kitchen.toggleCooking = function(id) {
            if (!Kitchen.cookingRecipes[id]) {
                $http({ method: 'PATCH', url: '/api/recipes/' + id + '/startCooking' })
                    .success(function(data, status, headers, config) {
                        $rootScope.$broadcast(KITCHEN_EVENTS.cookingRecipesUpdate);
                    });
            } else {
                $http({ method: 'PATCH', url: '/api/recipes/' + id + '/stopCooking' })
                    .success(function(data, status, headers, config) {
                        $rootScope.$broadcast(KITCHEN_EVENTS.cookingRecipesUpdate);
                    });
            }
        };

        Kitchen.toggleFavorite = function(id) {
            var recipe = Kitchen.recipes[id];
            recipe.isFavorite = !recipe.isFavorite;

            if (recipe.isFavorite) {
                Kitchen.cookingRecipes[id] = recipe;
            } else {
                delete Kitchen.recipes[id];
            }
        };

        Kitchen.isCooking = function(id) {
            return !!Kitchen.cookingRecipes[id];
        };

        var fetchCookingRecipes = function() {
            $http({ method: 'GET', url: '/api/cookingRecipes' })
                .success(function(data, status, headers, config) {
                    $rootScope.cookingRecipes = Kitchen.cookingRecipes = data;
                });
        };

        fetchCookingRecipes();

        $rootScope.$on(KITCHEN_EVENTS.cookingRecipesUpdate, function(event){
            fetchCookingRecipes();
        });

        return Kitchen;
    }
})();
},{}],15:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('basilApp.services')
        .factory('Recipe', Recipe);

    function Recipe ($resource){
        var resource =  $resource('/api/recipes/:id', {id:'@_id'}, {
            query: {
                method: 'GET',
                isArray: false,
                transformResponse: [function(data, headersGetter) {
                    if( headersGetter('X-Total-Count') ) {
                        resource.totalCount = Number(headersGetter('X-Total-Count'));
                    }

                    return angular.fromJson(data);
                }]
            },
            update: {
                method: 'PUT'
            }
        });

        resource.totalCount = 0;

        return resource;
    }
})();
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvYXBwLmpzIiwiY2xpZW50L2pzL2NvbnRyb2xsZXJzL2FwcC5qcyIsImNsaWVudC9qcy9jb250cm9sbGVycy9kZXRhaWwuanMiLCJjbGllbnQvanMvY29udHJvbGxlcnMvZWRpdC5qcyIsImNsaWVudC9qcy9jb250cm9sbGVycy9pbmRleC5qcyIsImNsaWVudC9qcy9jb250cm9sbGVycy9sb2dpbi5qcyIsImNsaWVudC9qcy9jb250cm9sbGVycy9uZXcuanMiLCJjbGllbnQvanMvZmlsdGVycy9nbG9iYWwuanMiLCJjbGllbnQvanMvc2VydmljZXMvYXV0aC5qcyIsImNsaWVudC9qcy9zZXJ2aWNlcy9hdXRoSW50ZXJjZXB0b3IuanMiLCJjbGllbnQvanMvc2VydmljZXMvYXV0aFJlc29sdmVyLmpzIiwiY2xpZW50L2pzL3NlcnZpY2VzL2NhdGVnb3J5LmpzIiwiY2xpZW50L2pzL3NlcnZpY2VzL2luZ3JlZGllbnQuanMiLCJjbGllbnQvanMvc2VydmljZXMva2l0Y2hlbi5qcyIsImNsaWVudC9qcy9zZXJ2aWNlcy9yZWNpcGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vJ3VzZSBzdHJpY3QnO1xuLy8gRGVjbGFyZSBhcHAgbGV2ZWwgbW9kdWxlIHdoaWNoIGRlcGVuZHMgb24gZmlsdGVycywgYW5kIHNlcnZpY2VzXG5hbmd1bGFyLm1vZHVsZSgnYmFzaWxBcHAnLCBbXG4gICAgICAgICdiYXNpbEFwcC5jb250cm9sbGVycycsXG4gICAgICAgICdiYXNpbEFwcC5kaXJlY3RpdmVzJyxcbiAgICAgICAgJ2Jhc2lsQXBwLmZpbHRlcnMnLFxuICAgICAgICAnYmFzaWxBcHAuc2VydmljZXMnLFxuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ25nTWF0ZXJpYWwnLFxuICAgICAgICAnbmdSZXNvdXJjZScsXG4gICAgICAgICduZ01lc3NhZ2VzJyxcbiAgICAgICAgJ25nU2FuaXRpemUnLFxuICAgICAgICAnYW5ndWxhck1vbWVudCcsXG4gICAgICAgICdtZC5kYXRhLnRhYmxlJyxcbiAgICAgICAgJ0xvY2FsU3RvcmFnZU1vZHVsZSdcbiAgICBdKVxuICAgIC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pXG4gICAgLmNvbnN0YW50KCdLSVRDSEVOX0VWRU5UUycsIHtcbiAgICAgICAgY29va2luZ1JlY2lwZXNVcGRhdGU6ICdjb29raW5nLXJlY2lwZXMtdXBkYXRlJ1xuICAgIH0pXG4gICAgLmNvbmZpZyhbXG4gICAgICAgICckc3RhdGVQcm92aWRlcicsXG4gICAgICAgICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgICAgICAnJG1kVGhlbWluZ1Byb3ZpZGVyJyxcbiAgICAgICAgJyRtZEljb25Qcm92aWRlcicsXG4gICAgICAgICckbWREYXRlTG9jYWxlUHJvdmlkZXInLFxuICAgICAgICAnbW9tZW50JyxcbiAgICAgICAgJyRodHRwUHJvdmlkZXInLFxuICAgICAgICAnbG9jYWxTdG9yYWdlU2VydmljZVByb3ZpZGVyJyxcblxuICAgICAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlcixcbiAgICAgICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICRtZEljb25Qcm92aWRlcixcbiAgICAgICAgICAgICAgICAgJG1kRGF0ZUxvY2FsZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICBtb21lbnQsXG4gICAgICAgICAgICAgICAgICRodHRwUHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgIFVTRVJfUk9MRVMsXG4gICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2VQcm92aWRlcikge1xuXG4gICAgICAgICAgICAvKmxvY2FsU3RvcmFnZVNlcnZpY2VQcm92aWRlclxuICAgICAgICAgICAgICAgIC5zZXRQcmVmaXgoJ2Jhc2lsJyk7Ki9cblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3JlY2lwZXMnKTtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3JlY2lwZXMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9yZWNpcGVzJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9pbmRleC9pbmRleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0luZGV4Q29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ25ldycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3JlY2lwZXMvYWRkJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9lZGl0L2VkaXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0Q29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2RldGFpbCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3JlY2lwZXMve2lkfScsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZGV0YWlsL2RldGFpbC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0RldGFpbENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdlZGl0Jywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcmVjaXBlcy97aWR9L2VkaXQnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2VkaXQvZWRpdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2VjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQ29ubmV4aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogJ2xvZ2luJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRtZEljb25Qcm92aWRlclxuICAgICAgICAgICAgICAgIC5kZWZhdWx0Rm9udFNldCgnbWF0ZXJpYWwtaWNvbnMnKTtcblxuICAgICAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgICAgICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ3RlYWwnKVxuICAgICAgICAgICAgICAgIC5hY2NlbnRQYWxldHRlKCdsaW1lJylcbiAgICAgICAgICAgICAgICAud2FyblBhbGV0dGUoJ2RlZXAtb3JhbmdlJylcbiAgICAgICAgICAgICAgICAuYmFja2dyb3VuZFBhbGV0dGUoJ2dyZXknKTtcblxuICAgICAgICAgICAgJG1kRGF0ZUxvY2FsZVByb3ZpZGVyLm1vbnRocyA9IFsnamFudmllcicsICdmw6l2cmllcicsICdtYXJzJywgJ2F2cmlsJywgJ21haScsICdqdWluJywgJ2p1aWxsZXQnLCAnYW/Du3QnLCAnc2VwdGVtYnJlJywgJ29jdG9icmUnLCAnbm92ZW1icmUnLCAnZMOpY2VtYnJlJ107XG4gICAgICAgICAgICAkbWREYXRlTG9jYWxlUHJvdmlkZXIuc2hvcnRNb250aHMgPSBbJ2phbnYuJywgJ2bDqXZyLicsICdtYXJzJywgJ2F2cmlsJywgJ21haScsICdqdWluJywgJ2p1aWwuJywgJ2Fvw7t0JywgJ3NlcHQuJywgJ29jdC4nLCAnbm92LicsICdkw6ljLiddO1xuICAgICAgICAgICAgJG1kRGF0ZUxvY2FsZVByb3ZpZGVyLmRheXMgPSBbJ2RpbWFuY2hlJywgJ2x1bmRpJywgJ21hcmRpJywgJ21lcmNyZWRpJywgJ2pldWRpJywgJ3ZlbmRyZWRpJywgJ3NhbWVkaSddO1xuICAgICAgICAgICAgJG1kRGF0ZUxvY2FsZVByb3ZpZGVyLnNob3J0RGF5cyA9IFsnRGknLCAnTHUnLCAnTWEnLCAnTWUnLCAnSmUnLCAnVmUnLCAnU2EnXTtcbiAgICAgICAgICAgICRtZERhdGVMb2NhbGVQcm92aWRlci5maXJzdERheU9mV2VlayA9IDE7XG4gICAgICAgICAgICAkbWREYXRlTG9jYWxlUHJvdmlkZXIuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnREQuTU0uWVlZWScpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRtZERhdGVMb2NhbGVQcm92aWRlci5tc2dDYWxlbmRhciA9ICdDYWxlbmRyaWVyJztcbiAgICAgICAgICAgICRtZERhdGVMb2NhbGVQcm92aWRlci5tc2dPcGVuQ2FsZW5kYXIgPSAnT3V2cmlyIGxlIGNhbGVuZHJpZXInO1xuXG4gICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgIF0pXG4gICAgLnJ1bihbXG4gICAgICAgICckcm9vdFNjb3BlJyxcbiAgICAgICAgJ2FtTW9tZW50JyxcbiAgICAgICAgJ0F1dGgnLFxuICAgICAgICAnQVVUSF9FVkVOVFMnLFxuICAgICAgICAnJHN0YXRlJyxcblxuICAgICAgICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgYW1Nb21lbnQsIEF1dGgsIEFVVEhfRVZFTlRTLCAkc3RhdGUpIHtcbiAgICAgICAgICAgIGFtTW9tZW50LmNoYW5nZUxvY2FsZSgnZnInKTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50UGFnZSA9IHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0czoge31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRyb290U2NvcGUuc2VydmVySXNPbmxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgJHJvb3RTY29wZS50YXNrcyA9IHt9O1xuXG4gICAgICAgICAgICAvKiRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgbmV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghQXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVzZXIgaXMgbm90IGxvZ2dlZCBpblxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5leHQubmFtZSA9PSAnbG9naW4nICYmIEF1dGguaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdyZWNpcGVzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7Ki9cblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9naW5GYWlsZWQsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIF0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmFzaWxBcHAuY29udHJvbGxlcnMnLCBbXSk7XG5hbmd1bGFyLm1vZHVsZSgnYmFzaWxBcHAuZmlsdGVycycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdiYXNpbEFwcC5zZXJ2aWNlcycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdiYXNpbEFwcC5kaXJlY3RpdmVzJywgW10pOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYmFzaWxBcHAuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIEFwcENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQXBwQ29udHJvbGxlciAoJG1kU2lkZW5hdiwgJHJvb3RTY29wZSwgQXV0aCwgJHNjb3BlLCAkc3RhdGUsIEtpdGNoZW4pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBfZGVmYXVsdFVJID0ge1xuICAgICAgICAgICAgc2VjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIGFkZEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2tCdXR0b246IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVpID0gYW5ndWxhci5leHRlbmQoe30sIF9kZWZhdWx0VUkpO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcbiAgICAgICAgICAgIGlmICh0b1N0YXRlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnVpID0gYW5ndWxhci5leHRlbmQoe30sIF9kZWZhdWx0VUksIHRvU3RhdGUuZGF0YS51aSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYudWkgPSBhbmd1bGFyLmV4dGVuZCh7fSwgX2RlZmF1bHRVSSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuY2xvc2VNZW51ID0gY2xvc2VNZW51O1xuICAgICAgICBzZWxmLnRvZ2dsZU1lbnUgPSB0b2dnbGVNZW51O1xuICAgICAgICBzZWxmLmxvZ291dCA9IGxvZ291dDtcblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgICAgICAgICAgJG1kU2lkZW5hdignbGVmdCcpLnRvZ2dsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2xvc2VNZW51KCkge1xuICAgICAgICAgICAgJG1kU2lkZW5hdignbGVmdCcpLmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgICAgICBBdXRoLmxvZ291dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICRzY29wZS5zZXRDdXJyZW50VXNlcihudWxsKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIH1cblxuICAgICAgICBBdXRoLmxvZ2luKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnNldEN1cnJlbnRVc2VyKEF1dGgudXNlcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5zZXRDdXJyZW50VXNlciA9IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYmFzaWxBcHAuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRGV0YWlsQ29udHJvbGxlcicsIERldGFpbENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRGV0YWlsQ29udHJvbGxlcigkc3RhdGUsICRzdGF0ZVBhcmFtcywgUmVjaXBlLCBLaXRjaGVuKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLnVuaXRzID0ge1xuICAgICAgICAgICAgbToge1xuICAgICAgICAgICAgICAgIGNvZGU6ICdtZXRyaWMnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdNw6l0cmlxdWUnLFxuICAgICAgICAgICAgICAgIGljb246ICdzY2FsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpOiB7XG4gICAgICAgICAgICAgICAgY29kZTogJ2ltcGVyaWFsJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnSW1ww6lyaWFsJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnbWVhc3VyaW5nLWN1cCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVuaXQgPSBzZWxmLnVuaXRzLm07XG4gICAgICAgIHNlbGYucmVjaXBlSWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG5cbiAgICAgICAgLy8gUmV0cmlldmUgY3VycmVudCByZWNpcGVcbiAgICAgICAgUmVjaXBlLmdldCh7XG4gICAgICAgICAgICBpZDogc2VsZi5yZWNpcGVJZFxuICAgICAgICB9LCBmdW5jdGlvbihyZWNpcGUpIHtcbiAgICAgICAgICAgIHNlbGYucmVjaXBlID0gcmVjaXBlO1xuXG4gICAgICAgICAgICBzZWxmLnlpZWxkID0gc2VsZi5yZWNpcGUucmVjaXBlWWllbGQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBvcmlnaW5hdG9yRXY7XG5cbiAgICAgICAgc2VsZi5vcGVuTWVudSA9IGZ1bmN0aW9uKCRtZE9wZW5NZW51LCBldikge1xuICAgICAgICAgICAgb3JpZ2luYXRvckV2ID0gZXY7XG4gICAgICAgICAgICAkbWRPcGVuTWVudShldik7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5zZWxlY3RVbml0ID0gZnVuY3Rpb24odW5pdCkgIHtcbiAgICAgICAgICAgIHNlbGYudW5pdCA9IHNlbGYudW5pdHNbdW5pdF07XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5zZWxlY3RZaWVsZCA9IGZ1bmN0aW9uKHBvcnRpb25zKSAge1xuICAgICAgICAgICAgc2VsZi55aWVsZCA9IHBvcnRpb25zO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuaXNDb29raW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gS2l0Y2hlbi5pc0Nvb2tpbmcoc2VsZi5yZWNpcGVJZClcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnN0YXJ0Q29va2luZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgS2l0Y2hlbi50b2dnbGVDb29raW5nKHNlbGYucmVjaXBlSWQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuc3RvcENvb2tpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIEtpdGNoZW4udG9nZ2xlQ29va2luZyhzZWxmLnJlY2lwZUlkKTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnRvZ2dsZUZhdm9yaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBLaXRjaGVuLnRvZ2dsZUZhdm9yaXRlKHNlbGYucmVjaXBlSWQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuZWRpdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdlZGl0Jywge2lkOiBzZWxmLnJlY2lwZUlkfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5nZXRDb252ZXJ0ZWRJbmdyZWRpZW50ID0gZnVuY3Rpb24ob3JpZ2luYWxJbmdyZWRpZW50KSB7XG4gICAgICAgICAgICB2YXIgb3JpZ2luYWxVbml0ID0gJ21ldHJpYyc7XG4gICAgICAgICAgICB2YXIgY29udmVydGVkSW5ncmVkaWVudDtcblxuICAgICAgICAgICAgaWYgKHNlbGYucmVjaXBlLmluZ3JlZGllbnRzVW5pdCkge1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsVW5pdCA9IHNlbGYucmVjaXBlLmluZ3JlZGllbnRzVW5pdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9yaWdpbmFsSW5ncmVkaWVudC51bml0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHdlaWdodFVuaXRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcIm1nXCI6IFtcIm96XCIsIDAuNV0sXG4gICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBbXCJjdXBcIiwgMC42MjEzNzFdLFxuICAgICAgICAgICAgICAgICAgICBcImtnXCI6IFtcIm1pL3NcIiwgMC4yNzc3NzgsIDAuMDAwMTcyNjAzMTA5XVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgdm9sdW1lVW5pdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwibWxcIjogW1wiY3VwXCIsIDAuMDA0MjI2NzUyODRdLFxuICAgICAgICAgICAgICAgICAgICBcImNsXCI6IFtcImN1cFwiLCAwLjA0MjI2NzUyODRdLFxuICAgICAgICAgICAgICAgICAgICBcImRsXCI6IFtcImN1cFwiLCAwLjQyMjY3NTI4NF0sXG4gICAgICAgICAgICAgICAgICAgIFwibFwiOiBbXCJjdXBcIiwgNC4yMjY3NTI4NF1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoKG9yaWdpbmFsSW5ncmVkaWVudC51bml0KSB7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnZlcnRlZEluZ3JlZGllbnQgPSBvcmlnaW5hbEluZ3JlZGllbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2Jhc2lsQXBwLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRDb250cm9sbGVyJywgRWRpdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRWRpdENvbnRyb2xsZXIoJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRtZERpYWxvZywgJG1kVG9hc3QsIFJlY2lwZSwgSW5ncmVkaWVudCwgJGZpbHRlcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5yZWNpcGUgPSB7fTtcbiAgICAgICAgc2VsZi5yZWNpcGVJZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgc2VsZi5pc1NhdmluZyA9IGZhbHNlO1xuICAgICAgICBzZWxmLmVkaXRNb2RlID0gZmFsc2U7XG5cbiAgICAgICAgLy8gUmV0cmlldmUgY3VycmVudCByZWNpcGVcbiAgICAgICAgaWYgKHNlbGYucmVjaXBlSWQpIHtcbiAgICAgICAgICAgIFJlY2lwZS5nZXQoe1xuICAgICAgICAgICAgICAgIGlkOiBzZWxmLnJlY2lwZUlkXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVjaXBlKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJlY2lwZS5pbmdyZWRpZW50cywgZnVuY3Rpb24gKGluZ3JlZGllbnQsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWluZ3JlZGllbnQuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZ3JlZGllbnQuZGVzY3JpcHRpb24gPSAkZmlsdGVyKCdpbmdyZWRpZW50UXVhbnRpdHknKShpbmdyZWRpZW50LnF1YW50aXR5LCAndGV4dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZ3JlZGllbnQudW5pdCkgaW5ncmVkaWVudC5kZXNjcmlwdGlvbiArPSAnICcgKyAkZmlsdGVyKCdpbmdyZWRpZW50VW5pdCcpKGluZ3JlZGllbnQudW5pdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmdyZWRpZW50LmRlc2NyaXB0aW9uICs9ICcgJyArIGluZ3JlZGllbnQubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmdyZWRpZW50LnR5cGUpIGluZ3JlZGllbnQuZGVzY3JpcHRpb24gKz0gJyAnICsgaW5ncmVkaWVudC50eXBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZWNpcGUuY29tYmluZWRJbmdyZWRpZW50cyA9IHNlbGYuY29tYmluZUluZ3JlZGllbnRzKHJlY2lwZS5pbmdyZWRpZW50cyk7XG4gICAgICAgICAgICAgICAgcmVjaXBlLmNvbWJpbmVkSW5zdHJ1Y3Rpb25zID0gc2VsZi5jb21iaW5lSW5zdHJ1Y3Rpb25zKHJlY2lwZS5yZWNpcGVJbnN0cnVjdGlvbnMpO1xuICAgICAgICAgICAgICAgIHNlbGYucmVjaXBlID0gcmVjaXBlO1xuXG4gICAgICAgICAgICAgICAgc2VsZi55aWVsZCA9IHNlbGYucmVjaXBlLnJlY2lwZVlpZWxkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGYuZWRpdE1vZGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLypzZWxmLmFkZEluZ3JlZGllbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgIHNlbGYucmVjaXBlLmluZ3JlZGllbnRzLnB1c2goe30pO1xuICAgICAgICAgfTtcblxuICAgICAgICAgc2VsZi5yZW1vdmVJbmdyZWRpZW50ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgIHNlbGYucmVjaXBlLmluZ3JlZGllbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICB9OyovXG5cbiAgICAgICAgc2VsZi5jb21iaW5lSW5ncmVkaWVudHMgPSBmdW5jdGlvbihpbmdyZWRpZW50cykge1xuICAgICAgICAgICAgdmFyIGNvbWJpbmVkSW5ncmVkaWVudHMgPSBbXTtcblxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGluZ3JlZGllbnRzLCBmdW5jdGlvbihpbmdyZWRpZW50LCBrZXkpIHtcbiAgICAgICAgICAgICAgICBjb21iaW5lZEluZ3JlZGllbnRzLnB1c2goaW5ncmVkaWVudC5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbWJpbmVkSW5ncmVkaWVudHMuam9pbihcIlxcblwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnBhcnNlSW5ncmVkaWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vc2VsZi5yZWNpcGUuaW5ncmVkaWVudHMgPSBJbmdyZWRpZW50LnBhcnNlQ29tYmluZWQoc2VsZi5yZWNpcGUuY29tYmluZWRJbmdyZWRpZW50cyk7XG5cbiAgICAgICAgICAgIHZhciBpbmdyZWRpZW50c0xpc3QgPSBzZWxmLnJlY2lwZS5jb21iaW5lZEluZ3JlZGllbnRzLnNwbGl0KFwiXFxuXCIpLFxuICAgICAgICAgICAgICAgIGluZ3JlZGllbnRzID0gW107XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbmdyZWRpZW50c0xpc3QsIGZ1bmN0aW9uKGluZ3JlZGllbnQsIGtleSkge1xuICAgICAgICAgICAgICAgIGluZ3JlZGllbnRzLnB1c2goe2Rlc2NyaXB0aW9uOiBpbmdyZWRpZW50fSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2VsZi5yZWNpcGUuaW5ncmVkaWVudHMgPSBpbmdyZWRpZW50cztcbiAgICAgICAgfTtcblxuICAgICAgICAvKnNlbGYuYWRkU3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgc2VsZi5yZWNpcGUucmVjaXBlSW5zdHJ1Y3Rpb25zLnB1c2goe2Rlc2NyaXB0aW9uOiBudWxsfSk7XG4gICAgICAgICB9O1xuXG4gICAgICAgICBzZWxmLnJlbW92ZVN0ZXAgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgc2VsZi5yZWNpcGUucmVjaXBlSW5zdHJ1Y3Rpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICB9OyovXG5cbiAgICAgICAgc2VsZi5jb21iaW5lSW5zdHJ1Y3Rpb25zID0gZnVuY3Rpb24oaW5zdHJ1Y3Rpb25zKSB7XG4gICAgICAgICAgICB2YXIgY29tYmluZWRJbnN0cnVjdGlvbnMgPSBbXTtcblxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGluc3RydWN0aW9ucywgZnVuY3Rpb24oaW5zdHJ1Y3Rpb24sIGtleSkge1xuICAgICAgICAgICAgICAgIGNvbWJpbmVkSW5zdHJ1Y3Rpb25zLnB1c2goaW5zdHJ1Y3Rpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjb21iaW5lZEluc3RydWN0aW9ucy5qb2luKFwiXFxuXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYucGFyc2VJbnN0cnVjdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnN0cnVjdGlvbnNMaXN0ID0gc2VsZi5yZWNpcGUuY29tYmluZWRJbnN0cnVjdGlvbnMuc3BsaXQoXCJcXG5cIiksXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zID0gW107XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnN0cnVjdGlvbnNMaXN0LCBmdW5jdGlvbihpbnN0cnVjdGlvbiwga2V5KSB7XG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goaW5zdHJ1Y3Rpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGYucmVjaXBlLnJlY2lwZUluc3RydWN0aW9ucyA9IGluc3RydWN0aW9ucztcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLmRlbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbmZpcm0oXCJWb3VsZXotdm91cyB2cmFpbWVudCBzdXBwcmltZXIgY2V0dGUgcmVjZXR0ZT9cIikpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmlzU2F2aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIFJlY2lwZS5kZWxldGUoe2lkOiBzZWxmLnJlY2lwZUlkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KFxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2ltcGxlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dENvbnRlbnQoJ1JlY2V0dGUgc3VwcHJpbcOpZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhpZ2hsaWdodEFjdGlvbih0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wb3NpdGlvbigndG9wIHJpZ2h0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGlkZURlbGF5KDMwMDApXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pc1NhdmluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncmVjaXBlcycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5pc1NhdmluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBzdWNjZXNzQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KFxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRleHRDb250ZW50KCdSZWNldHRlIGVucmVnaXN0csOpZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9zaXRpb24oJ3RvcCByaWdodCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGlkZURlbGF5KDMwMDApXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIHNlbGYuaXNTYXZpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmVkaXRNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnZGV0YWlsJywge2lkOiBzZWxmLnJlY2lwZS5faWR9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3JlY2lwZXMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGVycm9yQ2FsbGJhY2sgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNTYXZpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBcImVycmV1ciBzZXJ2ZXVyXCI7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gcmVzcG9uc2UuZGF0YS5lcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KFxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsaWNrT3V0c2lkZVRvQ2xvc2UodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aXRsZSgnRXJyZXVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0Q29udGVudCgnTGEgc2F1dmVnYXJkZSBhIMOpY2hvdcOpZSAoJyArIGVycm9yTWVzc2FnZSArICcpJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vaygnT0snKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgcmVjaXBlO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5lZGl0TW9kZSkge1xuICAgICAgICAgICAgICAgIHJlY2lwZSA9IHNlbGYucmVjaXBlO1xuXG4gICAgICAgICAgICAgICAgUmVjaXBlLnVwZGF0ZShyZWNpcGUsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlY2lwZSA9IG5ldyBSZWNpcGUoKTtcblxuICAgICAgICAgICAgICAgIHJlY2lwZS50aXRsZSA9IHNlbGYucmVjaXBlLnRpdGxlO1xuICAgICAgICAgICAgICAgIHJlY2lwZS5pbmdyZWRpZW50cyA9IHNlbGYucmVjaXBlLmluZ3JlZGllbnRzO1xuICAgICAgICAgICAgICAgIHJlY2lwZS5yZWNpcGVJbnN0cnVjdGlvbnMgPSBzZWxmLnJlY2lwZS5yZWNpcGVJbnN0cnVjdGlvbnM7XG4gICAgICAgICAgICAgICAgcmVjaXBlLmNvb2tUaW1lID0gc2VsZi5yZWNpcGUuY29va1RpbWUgfHwgMDtcbiAgICAgICAgICAgICAgICByZWNpcGUucHJlcFRpbWUgPSBzZWxmLnJlY2lwZS5wcmVwVGltZSB8fCAwO1xuICAgICAgICAgICAgICAgIHJlY2lwZS5yZWNpcGVZaWVsZCA9IHNlbGYucmVjaXBlLnJlY2lwZVlpZWxkIHx8IDE7XG4gICAgICAgICAgICAgICAgcmVjaXBlLmltYWdlID0gc2VsZi5yZWNpcGUuaW1hZ2U7XG4gICAgICAgICAgICAgICAgcmVjaXBlLm9yaWdpbmFsVXJsID0gc2VsZi5yZWNpcGUub3JpZ2luYWxVcmw7XG5cbiAgICAgICAgICAgICAgICBSZWNpcGUuc2F2ZShyZWNpcGUsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2Jhc2lsQXBwLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0luZGV4Q29udHJvbGxlcicsIEluZGV4Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBJbmRleENvbnRyb2xsZXIoS2l0Y2hlbiwgJG1kQm90dG9tU2hlZXQsICRtZFNpZGVuYXYsICRtZERpYWxvZywgUmVjaXBlLCBDYXRlZ29yeSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgUmVjaXBlLnF1ZXJ5KGZ1bmN0aW9uKHJlY2lwZXMpIHtcbiAgICAgICAgICAgIHNlbGYucmVjaXBlcyA9IHJlY2lwZXM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuZmF2b3JpdGVSZWNpcGVzID0gS2l0Y2hlbi5mYXZvcml0ZVJlY2lwZXM7XG5cbiAgICAgICAgc2VsZi5jYXRlZ29yaWVzID0gQ2F0ZWdvcnkubGlzdDtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYmFzaWxBcHAuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgTG9naW5Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExvZ2luQ29udHJvbGxlciAoJG1kRGlhbG9nLCAkc2NlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB2YXIgcXVlcnlTdHJpbmdWYWx1ZSA9IGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICAgICAgdmFyIGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCAnWz8mXScgKyBmaWVsZCArICc9KFteJiNdKiknLCAnaScgKTtcbiAgICAgICAgICAgIHZhciBzdHJpbmcgPSByZWcuZXhlYyhocmVmKTtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcgPyBzdHJpbmdbMV0gOiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBhdXRoRXJyb3IgPSBxdWVyeVN0cmluZ1ZhbHVlKCdlcnJvcicpO1xuXG4gICAgICAgIGlmIChhdXRoRXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBhdXRoRXJyb3JNZXNzYWdlO1xuICAgICAgICAgICAgc3dpdGNoKGF1dGhFcnJvcikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGF1dGhFcnJvck1lc3NhZ2UgPSBcIkVycmV1ciBpbmNvbm51ZSBsb3JzIGRlIGwnYXV0aGVudGlmaWNhdGlvbiB2aWEgR29vZ2xlXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxuICAgICAgICAgICAgICAgICAgICAuY2xpY2tPdXRzaWRlVG9DbG9zZSh0cnVlKVxuICAgICAgICAgICAgICAgICAgICAudGl0bGUoJ0VycmV1cicpXG4gICAgICAgICAgICAgICAgICAgIC5odG1sQ29udGVudCgkc2NlLnRydXN0QXNIdG1sKGF1dGhFcnJvck1lc3NhZ2UpKVxuICAgICAgICAgICAgICAgICAgICAub2soJ09LJylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2Jhc2lsQXBwJylcbiAgICAuZmlsdGVyKCdpbmdyZWRpZW50VW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY3VwJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd0YXNzZSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JveCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29udGVuYW50JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndHNwJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjLiDDoCBjLic7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Ric3AnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2MuIMOgIHMuJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncGluY2gnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3BpbmPDqWUnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC5maWx0ZXIoJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBzY29wZSkge1xuICAgICAgICAgICAgaWYgKGlucHV0IT1udWxsKVxuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwxKS50b1VwcGVyQ2FzZSgpK2lucHV0LnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuICAgIH0pOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYmFzaWxBcHAuc2VydmljZXMnKVxuICAgICAgICAuZmFjdG9yeSgnQXV0aCcsIEF1dGhTZXJ2aWNlKTtcblxuICAgIGZ1bmN0aW9uIEF1dGhTZXJ2aWNlKCRyb290U2NvcGUsICRodHRwLCBBVVRIX0VWRU5UUywgbG9jYWxTdG9yYWdlU2VydmljZSkge1xuICAgICAgICB2YXIgQXV0aFNlcnZpY2UgPSB7XG4gICAgICAgICAgICB1c2VyOiBudWxsLFxuICAgICAgICAgICAgYXV0aGVudGljYXRlZDogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXRyaWV2ZSB1c2VyIGF1dGggZGV0YWlscyBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZVNlcnZpY2UuaXNTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHZhciB1c2VyID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ3VzZXInKTtcbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UudXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UuYXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvdXNlcicgfSlcblxuICAgICAgICAgICAgICAgIC8vIFVzZXIgc3VjY2Vzc2Z1bGx5IGF1dGhlbnRpY2F0ZXNcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UudXNlciA9IGRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU3RvcmUgdXNlciBhdXRoIGRldGFpbHMgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlU2VydmljZS5pc1N1cHBvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ3VzZXInLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoY2FsbGJhY2spID09PSB0eXBlb2YoRnVuY3Rpb24pKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBOb3QgbG9nZ2VkIGluXG4gICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UudXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZVNlcnZpY2UuaXNTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKCd1c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSA9PT0gdHlwZW9mKEZ1bmN0aW9uKSkgY2FsbGJhY2soKTtcblxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5GYWlsZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoY2FsbGJhY2spID09PSB0eXBlb2YoRnVuY3Rpb24pKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBBdXRoU2VydmljZS5hdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICBBdXRoU2VydmljZS51c2VyID0gbnVsbDtcblxuICAgICAgICAgICAgJGh0dHAoeyBtZXRob2Q6ICdHRVQnLCB1cmw6ICcvbG9nb3V0JyB9KVxuXG4gICAgICAgICAgICAvLyBVc2VyIHN1Y2Nlc3NmdWxseSBsb2dnZWQgb3V0XG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZVNlcnZpY2UuaXNTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKCd1c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSA9PT0gdHlwZW9mKEZ1bmN0aW9uKSkgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gU2lnbiBvdXQgZXJyb3JcbiAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYWxsYmFjaykgPT09IHR5cGVvZihGdW5jdGlvbikpIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0ZWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdiYXNpbEFwcC5zZXJ2aWNlcycpXG4gICAgICAgIC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBBdXRoSW50ZXJjZXB0b3IpO1xuXG4gICAgZnVuY3Rpb24gQXV0aEludGVyY2VwdG9yKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICAgICAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICAgICAgICAgIDQ0MDogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXRcbiAgICAgICAgICAgICAgICB9W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYmFzaWxBcHAuc2VydmljZXMnKVxuICAgICAgICAuZmFjdG9yeSgnQXV0aFJlc29sdmVyJywgQXV0aFJlc29sdmVyKTtcblxuICAgIGZ1bmN0aW9uIEF1dGhSZXNvbHZlcigkcSwgJHJvb3RTY29wZSwgJHN0YXRlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNvbHZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICB2YXIgdW53YXRjaCA9ICRyb290U2NvcGUuJHdhdGNoKCdjdXJyZW50VXNlcicsIGZ1bmN0aW9uIChjdXJyZW50VXNlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoY3VycmVudFVzZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGN1cnJlbnRVc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB1bndhdGNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYmFzaWxBcHAuc2VydmljZXMnKVxuICAgICAgICAuZmFjdG9yeSgnQ2F0ZWdvcnknLCBDYXRlZ29yeSk7XG5cbiAgICBmdW5jdGlvbiBDYXRlZ29yeSAoKXtcbiAgICAgICAgdmFyIENhdGVnb3J5ID0ge307XG5cbiAgICAgICAgLy8tLSBWYXJpYWJsZXMgLS0vL1xuICAgICAgICB2YXIgX2NhdGVnb3JpZXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0TDqWpldW5lcicsXG4gICAgICAgICAgICAgICAgYWxpYXM6ICdkZWpldW5lcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0JvaXNzb25zICYgY29ja3RhaWxzJyxcbiAgICAgICAgICAgICAgICBhbGlhczogJ2JvaXNzb25zJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQ29sbGF0aW9ucycsXG4gICAgICAgICAgICAgICAgYWxpYXM6ICdjb2xsYXRpb25zJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQm91Y2jDqWVzICYgZW50csOpZXMnLFxuICAgICAgICAgICAgICAgIGFsaWFzOiAnYm91Y2hlZXMnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdTb3VwZXMgJiBwb3RhZ2VzJyxcbiAgICAgICAgICAgICAgICBhbGlhczogJ3NvdXBlcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0x1bmNoICYgc2FsYWRlJyxcbiAgICAgICAgICAgICAgICBhbGlhczogJ2x1bmNoJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnU2FuZHdpY2hzJyxcbiAgICAgICAgICAgICAgICBhbGlhczogJ3NhbmR3aWNocydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0zDqWd1bWVzICYgZ3JhdGlucycsXG4gICAgICAgICAgICAgICAgYWxpYXM6ICdsw6lndW1lcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1DDonRlcyAmIHJpeicsXG4gICAgICAgICAgICAgICAgYWxpYXM6ICdwYXRlcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1BvaXNzb24gJiBmcnVpdCBkZSBtZXInLFxuICAgICAgICAgICAgICAgIGFsaWFzOiAncG9pc3NvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1ZpYW5kZScsXG4gICAgICAgICAgICAgICAgYWxpYXM6ICd2aWFuZGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdEZXNzZXJ0JyxcbiAgICAgICAgICAgICAgICBhbGlhczogJ2Rlc3NlcnQnXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgQ2F0ZWdvcnkubGlzdCA9IHt9O1xuXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChfY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0ZWdvcnkpe1xuICAgICAgICAgICAgQ2F0ZWdvcnkubGlzdFtjYXRlZ29yeS5hbGlhc10gPSBjYXRlZ29yeTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIENhdGVnb3J5O1xuICAgIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmFzaWxBcHAnKS5mYWN0b3J5KCdJbmdyZWRpZW50JywgWyckZmlsdGVyJyxcbiAgICBmdW5jdGlvbigkZmlsdGVyKSB7XG4gICAgICAgIC8vLS0gTWV0aG9kcyAtLS8vXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24oaW5ncmVkaWVudCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWRSZXN1bHQgPSBJbmdyZWVkeS5wYXJzZShpbmdyZWRpZW50LmRlc2NyaXB0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICBpbmdyZWRpZW50LnF1YW50aXR5ID0gJGZpbHRlcignaW5ncmVkaWVudFF1YW50aXR5JykocGFyc2VkUmVzdWx0LnF1YW50aXR5LCAnZmxvYXQnKTtcbiAgICAgICAgICAgICAgICAgICAgaW5ncmVkaWVudC5uYW1lID0gcGFyc2VkUmVzdWx0Lm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGluZ3JlZGllbnQudW5pdCA9IHBhcnNlZFJlc3VsdC51bml0O1xuICAgICAgICAgICAgICAgICAgICBpbmdyZWRpZW50LnR5cGUgPSBwYXJzZWRSZXN1bHQudHlwZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlZFJlc3VsdC5jb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZ3JlZGllbnQucXVhbnRpdHkgPSBwYXJzZUZsb2F0KHBhcnNlZFJlc3VsdC5jb250YWluZXIucXVhbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5ncmVkaWVudC51bml0ID0gcGFyc2VkUmVzdWx0LmNvbnRhaW5lci51bml0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZ3JlZGllbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5ncmVkaWVudDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHBhcnNlQ29tYmluZWQ6IGZ1bmN0aW9uKGNvbWJpbmVkSW5ncmVkaWVudHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5ncmVkaWVudHNMaXN0ID0gY29tYmluZWRJbmdyZWRpZW50cy5zcGxpdChcIlxcblwiKSxcbiAgICAgICAgICAgICAgICAgICAgaW5ncmVkaWVudHMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgbWUgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGluZ3JlZGllbnRzTGlzdCwgZnVuY3Rpb24oaW5ncmVkaWVudCwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWRJbmdyZWRpZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGluZ3JlZGllbnRcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBwYXJzZWRJbmdyZWRpZW50ID0gbWUucGFyc2UocGFyc2VkSW5ncmVkaWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5ncmVkaWVudHMucHVzaChwYXJzZWRJbmdyZWRpZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBpbmdyZWRpZW50cztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ29udmVydCBhbmQgZWRpdGFibGUgcXVhbnRpdHkgdG8gYSBzdG9yYWJsZSBxdWFudGl0eVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSBvcmlnaW5hbFF1YW50aXR5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFN0b3JhYmxlUXVhbnRpdHk6IGZ1bmN0aW9uKG9yaWdpbmFsUXVhbnRpdHkpIHtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0Q29udmVydGVkSW5ncmVkaWVudDogZnVuY3Rpb24ob3JpZ2luYWxJbmdyZWRpZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsVW5pdCA9ICdtZXRyaWMnO1xuICAgICAgICAgICAgICAgIHZhciBjb252ZXJ0ZWRJbmdyZWRpZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5yZWNpcGUuaW5ncmVkaWVudHNVbml0KSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVW5pdCA9ICRzY29wZS5yZWNpcGUuaW5ncmVkaWVudHNVbml0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbEluZ3JlZGllbnQudW5pdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd2VpZ2h0VW5pdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1nXCI6IFtcIm96XCIsIDAuNV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogW1wiY3VwXCIsIDAuNjIxMzcxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2dcIjogW1wibWkvc1wiLCAwLjI3Nzc3OCwgMC4wMDAxNzI2MDMxMDldXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZvbHVtZVVuaXRzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJtbFwiOiBbXCJjdXBcIiwgMC4wMDQyMjY3NTI4NF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsXCI6IFtcImN1cFwiLCAwLjA0MjI2NzUyODRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkbFwiOiBbXCJjdXBcIiwgMC40MjI2NzUyODRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsXCI6IFtcImN1cFwiLCA0LjIyNjc1Mjg0XVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaChvcmlnaW5hbEluZ3JlZGllbnQudW5pdCkge1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWRJbmdyZWRpZW50ID0gb3JpZ2luYWxJbmdyZWRpZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5dKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2Jhc2lsQXBwLnNlcnZpY2VzJylcbiAgICAgICAgLmZhY3RvcnkoJ0tpdGNoZW4nLCBLaXRjaGVuKTtcblxuICAgIGZ1bmN0aW9uIEtpdGNoZW4gKFJlY2lwZSwgJHJvb3RTY29wZSwgJGh0dHAsIEtJVENIRU5fRVZFTlRTKXtcbiAgICAgICAgdmFyIEtpdGNoZW4gPSB7fTtcblxuICAgICAgICAvLy0tIFZhcmlhYmxlcyAtLS8vXG4gICAgICAgIHZhciBfcmVjaXBlcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0NhcmkgZGUgcG91bGV0IGV0IGRlIHBvaXZyb24gcm91Z2UnLFxuICAgICAgICAgICAgICAgIGNvb2tUaW1lOiAxNSxcbiAgICAgICAgICAgICAgICBwcmVwVGltZTogMTAsXG4gICAgICAgICAgICAgICAgdG90YWxUaW1lOiAyNSxcbiAgICAgICAgICAgICAgICByZWNpcGVDYXRlZ29yeTogJycsXG4gICAgICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vd3d3LnJpY2FyZG9jdWlzaW5lLmNvbS9waWN0dXJlcy9jYWNoZS9kN2RkMThiZDcwNTliMWUzY2U1ODhhMGJmNDVjMmFmN193MTA3NC5qcGcnLFxuICAgICAgICAgICAgICAgIHJlY2lwZVlpZWxkOiA0LFxuICAgICAgICAgICAgICAgIGluZ3JlZGllbnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ09pZ25vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY291cMOpIGVuIHF1YXJ0aWVyJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdQb2l2cm9uIHJvdWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb3Vww6kgZW4gY3ViZXMnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQ6ICdtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnSHVpbGUgZFxcJ29saXZlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZWNpcGVJbnN0cnVjdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRGFucyB1bmUgZ3JhbmRlIHBvw6psZSwgZG9yZXIgbCdvaWdub24gZXQgbGUgcG9pdnJvbiBkYW5zIGwnaHVpbGUgw6AgZmV1IHZpZiBqdXNxdSfDoCBjZSBxdSdpbHMgc29pZW50IHRlbmRyZXMuIEFqb3V0ZXIgbGUgcG91bGV0LCBsJ2FpbCBldCBsZXMgw6lwaWNlcy4gRmFpcmUgZG9yZXIgZW52aXJvbiAyIG1pbnV0ZXMuIFNhbGVyIGV0IHBvaXZyZXIuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQWpvdXRlciBsZSBsYWl0IGRlIGNvY28gZXQgbGUgbWllbC4gUG9ydGVyIMOgIMOpYnVsbGl0aW9uIGV0IGxhaXNzZXIgbWlqb3RlciBkb3VjZW1lbnQgZW52aXJvbiA4IG1pbnV0ZXMgb3UganVzcXUnw6AgY2UgcXVlIGxlIHBvdWxldCBzb2l0IGN1aXQuIFJlY3RpZmllciBsJ2Fzc2Fpc29ubmVtZW50LlwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlNlcnZpciBzdXIgdW4gcml6IGJhc21hdGkuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgbm90ZXM6IFtdLFxuICAgICAgICAgICAgICAgIHJhdGluZzogNCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFVybDogJ2h0dHA6Ly93d3cucmljYXJkb2N1aXNpbmUuY29tL3JlY2V0dGVzLzMwMTItY2FyaS1kZS1wb3VsZXQtZXQtZGUtcG9pdnJvbi1yb3VnZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdDYWtlIGF1IGNpdHJvbiwgZnJhbWJvaXNlICYgeW9nb3VydCcsXG4gICAgICAgICAgICAgICAgY29va1RpbWU6IDE1LFxuICAgICAgICAgICAgICAgIHByZXBUaW1lOiA0NSxcbiAgICAgICAgICAgICAgICB0b3RhbFRpbWU6IDYwLFxuICAgICAgICAgICAgICAgIHJlY2lwZUNhdGVnb3J5OiAnJyxcbiAgICAgICAgICAgICAgICBpbWFnZTogJ2h0dHA6Ly9jZG4tdGZwai50ZWx1c3BvcnRhbC5jb20vZG9jdW1lbnRzLzEzNjQyMTMvMC9DYWtlLWF1LWNpdHJvbi1ldC1mcmFtYm9pc2VzK00uanBnL2IxYWEwZDBmLWE2ZmYtNDdhZS04YjQwLTZkYzY0MWJiYWM4ND90PTE0NDA0MjY0NzYwMDAnLFxuICAgICAgICAgICAgICAgIHJlY2lwZVlpZWxkOiA2LFxuICAgICAgICAgICAgICAgIGluZ3JlZGllbnRzVW5pdDogJ2ltcGVyaWFsJyxcbiAgICAgICAgICAgICAgICBpbmdyZWRpZW50czogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMS41LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ2N1cCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRmFyaW5lJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogNC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ3RzcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUG91ZHJlIMOgIHDDonRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQ6ICdwaW5jaCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU2VsJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQ6ICd0YnNwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdaZXN0ZSBkZSBjaXRyb24nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ3Ric3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0p1cyBkZSBjaXRyb24nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAwLjc1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ2N1cCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU3VjcmUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ09ldWZzJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ2N1cCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnSHVpbGUgZGUgY2Fub2xhJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMC43NSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQ6ICdjdXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1lvZ291cnQgZ3JlYycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnw6AgbGEgdmFuaWxsZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAnYm94JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdGcmFtYm9pc2VzIGZyYcOuY2hlcydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlY2lwZUluc3RydWN0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJQcsOpY2hhdWZmZXIgbGUgZm91ciDDoCAzNTAgwrBGLiBUYXBpc3NlciB1biBtb3VsZSDDoCBwYWluIGRlIHBhcGllciBwYXJjaGVtaW4uIFLDqXNlcnZlci5cIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJEYW5zIHVuIGJvbCwgbcOpbGFuZ2VyIGxhIGZhcmluZSwgbGUgYmljYXJib25hdGUgZGUgc291ZGUgZXQgbGUgc2VsLiBSw6lzZXJ2ZXIuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRGFucyB1biBhdXRyZSBib2wsIG3DqWxhbmdlciBsZSB6ZXN0ZSBldCBsZSBqdXMgZGUgY2l0cm9uIGF2ZWMgbGUgc3VjcmUuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSW5jb3Jwb3JlciBsZXMgxZN1ZnMgdW4gw6AgdW4sIGVuIGZvdWV0dGFudCBlbnRyZSBjaGFxdWUgYWRkaXRpb24sIHB1aXMgYWpvdXRlciBsJ2h1aWxlIGV0IGxlIHlvZ291cnQuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVmVyc2VyIGxhIGZhcmluZSwgYmllbiBtw6lsYW5nZXIsIHB1aXMgYWpvdXRlciBsZXMgZnJhbWJvaXNlcyBkw6lsaWNhdGVtZW50IHNhbnMgdHJvcCBtw6lsYW5nZXIuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVmVyc2VyIGF1IGZvbmQgZHUgbW91bGUsIHB1aXMgZW5mb3VybmVyIHBlbmRhbnQgNDUgbWludXRlcywgb3UganVzcXUnw6AgY2UgcXVlIGxlIGNlbnRyZSBzb2l0IGJpZW4gY3VpdC5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBub3RlczogW10sXG4gICAgICAgICAgICAgICAgcmF0aW5nOiA0LFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVXJsOiAnaHR0cDovL3d3dy50cm9pc2ZvaXNwYXJqb3VyLmNvbS9mci93ZWIvdHJvaXMtZm9pcy1wYXItam91ci9yZWNldHRlcy9kZXNzZXJ0cy9jYWtlLWF1LWNpdHJvbi1mcmFtYm9pc2UteW9nb3VydCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdNdWZmaW5zIHBvbW1lcyBldCBjaGVkZGFyJyxcbiAgICAgICAgICAgICAgICBjb29rVGltZTogMjUsXG4gICAgICAgICAgICAgICAgcHJlcFRpbWU6IDEwLFxuICAgICAgICAgICAgICAgIHRvdGFsVGltZTogMzUsXG4gICAgICAgICAgICAgICAgcmVjaXBlQ2F0ZWdvcnk6ICcnLFxuICAgICAgICAgICAgICAgIGltYWdlOiAnaHR0cDovL3d3dy5tZWlsbGV1cmF2ZWNkdWJldXJyZS5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMTMvMTAvbXVmZmluc19wb21tZXNfY2hlZGRhcjEuanBnJyxcbiAgICAgICAgICAgICAgICByZWNpcGVZaWVsZDogMTAsXG4gICAgICAgICAgICAgICAgaW5ncmVkaWVudHNVbml0OiAnaW1wZXJpYWwnLFxuICAgICAgICAgICAgICAgIGluZ3JlZGllbnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAwLjI1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ2N1cCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQmV1cnJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmb25kdSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQ6ICdjdXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1Npcm9wIGRcXCfDqXJhYmxlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ3RzcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnVmFuaWxsZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT2V1ZidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAnY3VwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdGYXJpbmUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAndHNwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdCaWNhcmJvbmF0ZSBkZSBzb3VkZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAndHNwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdQb3VkcmUgw6AgcMOidGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ3BpbmNoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdTZWwnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAndHNwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdDYW5uZWxsZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDAuMjUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAndHNwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdNdXNjYWRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ2N1cCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWW9nb3VydCBncmVjJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICfDoCBsYSB2YW5pbGxlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMS41LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ2N1cCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUG9tbWVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb3Vww6llcyBlbiBkw6lzJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQ6ICdjdXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0NoZWRkYXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3LDonDDqSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVjaXBlSW5zdHJ1Y3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlByw6ljaGF1ZmZlciBsZSBmb3VyIMOgIDM1MCDCsEYuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRGFucyB1biBib2wsIGJhdHRyZSBs4oCZaHVpbGUsIGzigJlvZXVmLCBsZSBzdWNyZSwgZXQgbGEgdmFuaWxsZSDDoCBs4oCZYWlkZSBk4oCZdW4gZm91ZXQuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRGFucyB1biBhdXRyZSBib2wsIG3DqWxhbmdlciB0b3VzIGxlcyBpbmdyw6lkaWVudHMgc2Vjcy4gSW5jb3Jwb3JlciBncmFkdWVsbGVtZW50IGxlIG3DqWxhbmdlIGRlIGZhcmluZSBkYW5zIGxlIHByZW1pZXIgbcOpbGFuZ2UgZW4gYWx0ZXJuYW50IGF2ZWMgbGUgbGFpdC5cIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBam91dGVyIGxlcyBwb21tZXMgZXQgbGUgZnJvbWFnZSByw6Jww6kuIE3DqWxhbmdlciBsw6lnw6hyZW1lbnQuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVmVyc2VyIGxlIG3DqWxhbmdlIGRhbnMgZGVzIG1vdWxlcyDDoCBtdWZmaW5zIGV0IGN1aXJlIGVudmlyb24gMjAtMjUgbWludXRlcy5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBub3RlczogW10sXG4gICAgICAgICAgICAgICAgcmF0aW5nOiA0LFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVXJsOiAnaHR0cDovL3d3dy5tZWlsbGV1cmF2ZWNkdWJldXJyZS5jb20vMjAxMy8xMC8wOC9tdWZmaW5zLXBvbW1lcy1jaGVkZGFyLydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDQsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdHw6J0ZWF1IGF1eCBjYXJvdHRlcycsXG4gICAgICAgICAgICAgICAgY29va1RpbWU6IDQwLFxuICAgICAgICAgICAgICAgIHByZXBUaW1lOiAyMCxcbiAgICAgICAgICAgICAgICB0b3RhbFRpbWU6IDYwLFxuICAgICAgICAgICAgICAgIHJlY2lwZUNhdGVnb3J5OiAnJyxcbiAgICAgICAgICAgICAgICBpbWFnZTogJ2h0dHA6Ly9wOC5zdG9yYWdlLmNhbmFsYmxvZy5jb20vODIvNTkvMTQ1NDU0LzIxMjM4Mjg5X3AuanBnJyxcbiAgICAgICAgICAgICAgICByZWNpcGVZaWVsZDogOCxcbiAgICAgICAgICAgICAgICBpbmdyZWRpZW50c1VuaXQ6ICdtZXRyaWMnLFxuICAgICAgICAgICAgICAgIGluZ3JlZGllbnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAyODAsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAnZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ2Fyb3R0ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3LDonDDqWVzJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ2cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0ZhcmluZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAndHNwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdQb3VkcmUgw6AgcMOidGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ09ldWZzJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ2cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0Nhc3NvbmFkZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDEyNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQ6ICdnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdQb3VkcmUgZGUgbm9pc2V0dGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxMjUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAnZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUG91ZHJlIGRcXCdhbWFuZGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0p1cyBkZSBjaXRyb24gKyB6ZXN0ZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDAuNzUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAnY3VwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdZb2dvdXJ0IGdyZWMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ8OgIGxhIHZhbmlsbGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ3RzcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ2FubmVsbGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ3RzcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnR2luZ2VtYnJlIG1vdWx1J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ3RzcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUG91ZHJlIGRlIG11c2NhZGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ3BpbmNoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdTZWwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlY2lwZUluc3RydWN0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJQcsOpY2hhdWZmZXIgbGUgZm91ciDDoCAxODDCsEMuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiUsOicGVyIGxlcyBjYXJvdHRlcyBldCBsZXMgbcOpbGFuZ2VyIGF1IGp1cyBkZSBjaXRyb24uXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRm91ZXR0ZXIgbGVzIG9ldWYgZXQgbGEgY2Fzc29uYWRlLiBBam91dGVyIGxhIGZhcmluZSwgbGEgbGV2dXJlLCBsZXMgcG91ZHJlcyBkZSBub2lzZXR0ZXMgZXQgYW1hbmRlcywgbGUgc2VsLiBNw6lsYW5nZXIgZXQgcmFqb3V0ZXIgZW5zdWl0ZSBsZSB5b2dvdXJ0LCBsZXMgw6lwaWNlcyBldCBsZXMgY2Fyb3R0ZXMgcmFww6llcy5cIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJCZXVycmVyIHVuIG1vdWxlIMOgIGNha2UuXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRW5mb3VybmVyIHBvdXIgNDAgbWluIGVuIHbDqXJpZmlhbnQgbGEgY3Vpc3NvbiDDoCBsJ2FpZGUgZCd1biBwaWMgZW4gYm9pcy5cIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJMYWlzc2VyIHJlZnJvaWRpciBkYW5zIGxlIG1vdWxlIGV0IHJldG91cm5lciBzdXIgbGUgcGxhdCBkZSBwcsOpc2VudGF0aW9uLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIG5vdGVzOiBbXSxcbiAgICAgICAgICAgICAgICByYXRpbmc6IDQsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxVcmw6ICdodHRwOi8vZGVsaWNlc2RoZWxlbmUuY2FuYWxibG9nLmNvbS9hcmNoaXZlcy8yMDA4LzAxLzIxLzc2MzA2NjEuaHRtbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBLaXRjaGVuLnJlY2lwZXMgPSB7fTtcbiAgICAgICAgS2l0Y2hlbi5mYXZvcml0ZVJlY2lwZXMgPSB7fTtcbiAgICAgICAgS2l0Y2hlbi5jb29raW5nUmVjaXBlcyA9IHt9O1xuXG4gICAgICAgIEtpdGNoZW4udG9nZ2xlQ29va2luZyA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBpZiAoIUtpdGNoZW4uY29va2luZ1JlY2lwZXNbaWRdKSB7XG4gICAgICAgICAgICAgICAgJGh0dHAoeyBtZXRob2Q6ICdQQVRDSCcsIHVybDogJy9hcGkvcmVjaXBlcy8nICsgaWQgKyAnL3N0YXJ0Q29va2luZycgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChLSVRDSEVOX0VWRU5UUy5jb29raW5nUmVjaXBlc1VwZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ1BBVENIJywgdXJsOiAnL2FwaS9yZWNpcGVzLycgKyBpZCArICcvc3RvcENvb2tpbmcnIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoS0lUQ0hFTl9FVkVOVFMuY29va2luZ1JlY2lwZXNVcGRhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBLaXRjaGVuLnRvZ2dsZUZhdm9yaXRlID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHZhciByZWNpcGUgPSBLaXRjaGVuLnJlY2lwZXNbaWRdO1xuICAgICAgICAgICAgcmVjaXBlLmlzRmF2b3JpdGUgPSAhcmVjaXBlLmlzRmF2b3JpdGU7XG5cbiAgICAgICAgICAgIGlmIChyZWNpcGUuaXNGYXZvcml0ZSkge1xuICAgICAgICAgICAgICAgIEtpdGNoZW4uY29va2luZ1JlY2lwZXNbaWRdID0gcmVjaXBlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgS2l0Y2hlbi5yZWNpcGVzW2lkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBLaXRjaGVuLmlzQ29va2luZyA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gISFLaXRjaGVuLmNvb2tpbmdSZWNpcGVzW2lkXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZmV0Y2hDb29raW5nUmVjaXBlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0dHAoeyBtZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXBpL2Nvb2tpbmdSZWNpcGVzJyB9KVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuY29va2luZ1JlY2lwZXMgPSBLaXRjaGVuLmNvb2tpbmdSZWNpcGVzID0gZGF0YTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmZXRjaENvb2tpbmdSZWNpcGVzKCk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oS0lUQ0hFTl9FVkVOVFMuY29va2luZ1JlY2lwZXNVcGRhdGUsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGZldGNoQ29va2luZ1JlY2lwZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIEtpdGNoZW47XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2Jhc2lsQXBwLnNlcnZpY2VzJylcbiAgICAgICAgLmZhY3RvcnkoJ1JlY2lwZScsIFJlY2lwZSk7XG5cbiAgICBmdW5jdGlvbiBSZWNpcGUgKCRyZXNvdXJjZSl7XG4gICAgICAgIHZhciByZXNvdXJjZSA9ICAkcmVzb3VyY2UoJy9hcGkvcmVjaXBlcy86aWQnLCB7aWQ6J0BfaWQnfSwge1xuICAgICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24oZGF0YSwgaGVhZGVyc0dldHRlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiggaGVhZGVyc0dldHRlcignWC1Ub3RhbC1Db3VudCcpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2UudG90YWxDb3VudCA9IE51bWJlcihoZWFkZXJzR2V0dGVyKCdYLVRvdGFsLUNvdW50JykpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oZGF0YSk7XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc291cmNlLnRvdGFsQ291bnQgPSAwO1xuXG4gICAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9XG59KSgpOyJdfQ==
