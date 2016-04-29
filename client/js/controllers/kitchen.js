'use strict';

/* jshint -W098 */
angular.module('mean.kitchen').controller('KitchenController', ['$scope', 'Global', 'Kitchen',
  function($scope, Global, Kitchen) {
    $scope.global = Global;

    $scope.cookingRecipes = Kitchen.getCooking;
  }
]);
