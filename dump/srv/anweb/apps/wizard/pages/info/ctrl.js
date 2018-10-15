'use strict';
angular.module('wizard').controller('wizardInfoCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  'wizardConstants',
  function($scope, $rootScope, $state, constants) {
    ($rootScope.enableSmallWizard = !1),
      ($scope.customNextStep = function() {
        $state.go('lang');
      }),
      ($scope.getWizardInfo = function() {
        return constants.CUSTOM_GOODLINE_21218
          ? 'wizard_info_goodline'
          : 'wizard_info';
      }),
      ($scope.getWizardInfoStart = function() {
        return constants.CUSTOM_GOODLINE_21218
          ? 'wizard_info_start_goodline'
          : 'wizard_info_start';
      });
  },
]);
