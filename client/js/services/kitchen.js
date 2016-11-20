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