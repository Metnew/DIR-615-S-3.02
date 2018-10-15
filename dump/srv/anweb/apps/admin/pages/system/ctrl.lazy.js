'use strict';
angular.module('app').controllerProvider.register('SystemCtrl', [
  '$scope',
  function($scope) {
    $scope.$emit('pageload');
  },
]);
