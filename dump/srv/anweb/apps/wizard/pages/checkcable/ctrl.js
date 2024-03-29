'use strict';
angular.module('wizard').controller('wizardCheckCableCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'stepManager',
  function($scope, $state, $stateParams, stepManager) {
    ($scope.stepData = stepManager.getData() || {}),
      ($scope.go = function(state) {
        $state.go(state);
      }),
      ($scope.next = function() {
        ($scope.stepData.btn_next_noblock ||
          ($scope.gDeviceAvail && $scope.gWANStatus)) &&
          stepManager.action('next');
      }),
      ($scope.prev = function() {
        stepManager.action('prev');
      });
  },
]);
