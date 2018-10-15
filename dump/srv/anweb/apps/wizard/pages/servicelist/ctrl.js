'use strict';
angular.module('wizard').controller('wizardServiceListCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  'stepManager',
  function($scope, $rootScope, $state, stepManager) {
    ($scope.stepData = stepManager.getData()),
      $scope.servicelist || $state.go('search'),
      ($scope.selectService = function(service) {
        ($rootScope.selectedProfile = service), $state.go('master');
      }),
      ($scope.customPrevStep = function() {
        $state.go(_.size($scope.providers) > 1 ? 'provlist' : 'search');
      });
  },
]);
