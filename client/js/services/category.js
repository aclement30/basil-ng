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