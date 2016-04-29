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
