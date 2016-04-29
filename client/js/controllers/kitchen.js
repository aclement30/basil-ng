(function () {
    'use strict';
    angular
        .module('basilApp.controllers')
        .controller('KitchenController', KitchenController);

    function KitchenController(Kitchen) {
        var self = this;

        //self.global = Global;

        self.cookingRecipes = Kitchen.getCooking;
    }
})();