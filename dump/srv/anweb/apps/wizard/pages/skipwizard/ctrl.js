'use strict';
angular.module('wizard').controller('wizardSkipWizard', [
  '$scope',
  '$state',
  '$stateParams',
  'stepManager',
  function($scope, $state, $stateParams, stepManager) {
    ($scope.stepData = stepManager.getData()),
      ($scope.customNext = function() {
        stepManager.action('next');
      }),
      ($scope.customExit = function() {
        stepManager.action('exit');
      });
  },
]);
