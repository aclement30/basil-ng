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