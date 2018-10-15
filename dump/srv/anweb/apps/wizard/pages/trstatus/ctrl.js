'use strict';
angular.module('wizard').controller('wizardTRStatusCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'devinfo',
  '$interval',
  'stepManager',
  function(
    $scope,
    $rootScope,
    $state,
    $stateParams,
    devinfo,
    $interval,
    stepManager
  ) {
    ($scope.checkCount = -1),
      ($scope.phase = 'phase1'),
      ($scope.translatePhase = function(phase) {
        return 'wizard_state_' + phase;
      }),
      ($scope.showCircles = function() {
        return (
          'phase1' == $scope.phase ||
          'tr_connecting' == $scope.phase ||
          'tr_configuring' == $scope.phase
        );
      }),
      ($scope.showWarn = function() {
        return (
          'phase1' == $scope.phase ||
          'tr_connecting' == $scope.phase ||
          'tr_configuring' == $scope.phase
        );
      }),
      ($scope.showManualy = function() {
        return 'tr_failed' == $scope.phase;
      }),
      ($scope.showOK = function() {
        return 'tr_finished' == $scope.phase;
      }),
      $scope.$watch('rootStartState', function(state) {
        if (state)
          switch (state) {
            case 'tr_finished':
              $scope.startSmallWizard();
              break;
            case 'tr_failed':
              $scope.startBigWizard();
              break;
            default:
              $scope.phase = state;
          }
      }),
      ($scope.startSmallWizard = function() {
        stepManager.action('tr_finished');
      }),
      ($scope.startBigWizard = function() {
        stepManager.action('tr_failed');
      });
    var intervalPromise = $interval(function() {
      $scope.checkCount++;
    }, 2e3);
    $scope.$on('$destroy', function() {
      $interval.cancel(intervalPromise);
    });
  },
]);
