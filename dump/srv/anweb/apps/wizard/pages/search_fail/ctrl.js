'use strict';
angular.module('wizard').controller('wizardSearchFailCtrl', [
  '$scope',
  'stepManager',
  function($scope, stepManager) {
    $scope.stepManger = stepManager;
  },
]);
