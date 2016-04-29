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