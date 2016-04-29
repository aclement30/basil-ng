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