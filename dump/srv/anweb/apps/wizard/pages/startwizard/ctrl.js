'use strict';
angular.module('wizard').controller('wizardStartWizardCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'translate',
  '$interval',
  'devinfo',
  '$rootScope',
  'stepManager',
  function(
    $scope,
    $state,
    $stateParams,
    translate,
    $interval,
    devinfo,
    $rootScope,
    stepManager
  ) {
    function checkPort() {
      return (
        $scope.circleProgress++,
        $scope.stepData.force_next && $scope.gWANStatus
          ? ($interval.cancel($scope.intervalID), void $scope.customNextStep())
          : void (
              ($scope.circleProgress >= 9 || $scope.gWANStatus) &&
              ($interval.cancel($scope.intervalID),
              $scope.recheckCount++,
              $scope.gWANStatus
                ? (($scope.stepWANStatus = $scope.gWANStatus),
                  $scope.switchStep('first'))
                : $scope.switchStep(
                    $scope.recheckCount >= 2 ? 'error' : 'error_cable'
                  ))
            )
      );
    }
    ($scope.stepData = stepManager.getData() || {}),
      ($scope.next = $stateParams.next),
      ($scope.prev = $stateParams.prev),
      ($scope.step = $scope.stepData.subStep
        ? $scope.stepData.subStep
        : 'first'),
      ($scope.recheckCount = 0),
      ($scope.circleProgress = 0),
      ($scope.stepWANStatus = $scope.gWANStatus),
      $scope.intervalID,
      $scope.$on('$create', function() {
        $scope.stepWANStatus = $scope.gWANStatus;
      }),
      $rootScope.$on('FirstDevinfoPulled', function() {
        $scope.stepWANStatus = $scope.gWANStatus;
      }),
      $scope.$watch('step', function(step) {
        switch (step) {
          case 'first':
            $scope.stepWANStatus = $scope.gWANStatus;
            break;
          case 'check':
            ($scope.circleProgress = 0),
              ($scope.intervalID = $interval(checkPort, 2e3));
        }
      }),
      ($scope.switchStep = function(step) {
        $scope.step = step;
      }),
      ($scope.customExit = function() {
        $scope.exitFromWizard(!0);
      }),
      ($scope.customNextStep = function() {
        $scope.gWANStatus
          ? stepManager.action('next')
          : $scope.switchStep('error_cable');
      });
  },
]);
