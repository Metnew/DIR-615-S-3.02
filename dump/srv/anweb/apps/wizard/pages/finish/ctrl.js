'use strict';
angular.module('wizard').controller('wizardFinishCtrl', [
  '$scope',
  '$rootScope',
  '$stateParams',
  function($scope, $rootScope, $stateParams) {
    ($scope.netConfigured = 'skiped' !== $stateParams.net),
      $scope.netConfigured
        ? (($scope.titleKey = 'wizard_trouble_ok'),
          ($scope.hideRedirectBtn = !1))
        : (($scope.titleKey = 'wizard_finish_title'),
          ($scope.hideRedirectBtn = !0)),
      ($scope.exit = function() {
        $rootScope.showOverlay(!0),
          $scope.showAvailOverlay(!1),
          goAway($scope.getRedirectUrl());
      });
  },
]);
