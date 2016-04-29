'use strict';

angular.module('mean.kitchen')
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