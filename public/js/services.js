'use strict';

angular.module('mean.kitchen').factory('Category', [
        function() {

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

            //-- Methods --//
            return {
                set: function(data){
                    _categories = data;
                },

                get: function(id){
                    if (!id) {
                        return _categories;
                    } else {
                        var categoryKey = null;

                        angular.forEach(_categories, function(category, key) {
                            if (category.id == id) {
                                categoryKey = key;
                                return;
                            }
                        });

                        if (categoryKey !== null) {
                            return _categories[categoryKey];
                        } else {
                            return null;
                        }
                    }
                }
            };
        }
    ]);
'use strict';

angular.module('mean.kitchen').factory('Ingredient', ['$filter',
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
'use strict';

angular.module('mean.kitchen').service('Kitchen', [
    function() {

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

        var _cookingRecipes = [];

        var Recipe = {
            set: function(data){
                _recipes = data;
            },

            get: function(id){
                if (!id) {
                    return _recipes;
                } else {
                    var recipeKey = null;

                    angular.forEach(_recipes, function(recipe, key) {
                        if (recipe.id == id) {
                            recipeKey = key;
                            return;
                        }
                    });

                    if (recipeKey !== null) {
                        return _recipes[recipeKey];
                    } else {
                        return null;
                    }
                }
            },

            add: function(recipe) {
                recipe.totalTime = parseInt(recipe.cookTime) + parseInt(recipe.prepTime);
                recipe.id = _recipes[_recipes.length - 1].id + 1;

                _recipes.push(recipe);

                return Recipe.get(recipe.id);
            },

            getFavorites: function() {
                var favorites = [];

                angular.forEach(_recipes, function(recipe, key) {
                    if (recipe.isFavorite) {
                        favorites.push(recipe);
                    }
                });

                return favorites;
            },

            // Start cooking a recipe
            startCooking: function(id) {
                if (_cookingRecipes.indexOf(id) == -1) {
                    _cookingRecipes.push(id);
                }
            },

            stopCooking: function(id) {
                var index = _cookingRecipes.indexOf(id);

                if (index != -1) {
                    _cookingRecipes.splice(index, 1);
                }
            },

            toggleFavorite: function(id) {
                var recipe = Recipe.get(id);
                recipe.isFavorite = !recipe.isFavorite;
            },

            getCooking: function() {
                var recipes = [];

                angular.forEach(_cookingRecipes, function(id, key) {
                    recipes.push(Recipe.get(id));
                });

                return recipes;
            },

            isCooking: function(id) {
                return _cookingRecipes.indexOf(id) > -1;
            },

            getCookingIds: function() {
                return _cookingRecipes;
            }
        };

        //-- Methods --//
        return Recipe;
    }
]);
'use strict';

// Recipes service used for recipes REST endpoint
angular.module('mean.kitchen').factory('Recipes', ['$resource',
    function ($resource) {
        return $resource('api/recipes/:recipeId', {
            recipeId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
