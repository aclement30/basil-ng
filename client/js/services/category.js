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