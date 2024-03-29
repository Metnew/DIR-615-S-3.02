'use strict';
angular.module('wizard').controller('wizardStartStateCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'stepManager',
  '$timeout',
  'somovd',
  function($scope, $state, $stateParams, stepManager, $timeout, somovd) {
    function log(text) {
      console.log('[startstate]', text);
    }
    ($scope.step = null),
      ($scope.cableCheckCount = 0),
      ($scope.cableCheckCountMax = 3),
      ($scope.lastError = ''),
      ($scope.ponData = { ploam: '' });
    var timeoutPromise = null,
      omciTimeout = 6e4,
      trTimeout = 6e4,
      waitSteps = [
        'support',
        'cable_disconnected',
        'edit_ploam',
        'configuring_failed',
      ];
    ($scope.getOMCIStatus = function() {
      return 'omci_configured' == $scope.rootStartState ||
        'tr_configured' == $scope.rootStartState ||
        'tr_configuring' == $scope.rootStartState
        ? 'Зарегистрировано'
        : 'Не зарегистрировано';
    }),
      ($scope.applyPLOAM = function() {
        $scope.showOverlay(!0),
          $scope.showAvailOverlay(!1),
          somovd
            .read(229)
            .then(function(res) {
              (res.data.ploam_password = $scope.ponData.ploam),
                somovd
                  .write(229, res.data)
                  .then(function() {
                    $scope.showOverlay(!1),
                      $scope.showAvailOverlay(!0),
                      $scope.switchStep('configuring'),
                      $scope.updateLogic();
                  })
                  ['catch'](function() {
                    log('write ploam failed'),
                      $scope.switchStep('configuring'),
                      $scope.updateLogic();
                  });
            })
            ['catch'](function() {
              log('read ploam failed');
            });
      }),
      ($scope.cableCheckFinished = function() {
        $scope.cableCheckCount++,
          $scope.switchStep(
            $scope.cableCheckCount >= $scope.cableCheckCountMax
              ? 'support'
              : 'cable_disconnected'
          ),
          $scope.updateLogic();
      }),
      ($scope.switchStep = function(step) {
        log('step is ' + step), ($scope.step = step);
      }),
      ($scope.updateLogic = function() {
        if ($scope.rootStartState) {
          if (
            (log('reset timeouts'),
            $timeout.cancel(timeoutPromise),
            _.contains(waitSteps, $scope.step))
          )
            return void log('wait user');
          switch (
            (($scope.lastError = ''),
            log('STATE ' + $scope.rootStartState),
            $scope.rootStartState)
          ) {
            case 'cable_disconnected':
              if (
                (($scope.lastError = 'WAN кабель не подключен'),
                'cable_check' == $scope.step)
              )
                break;
              ($scope.lastError = ''), $scope.switchStep('cable_disconnected');
              break;
            case 'omci_configuring':
              ($scope.lastError = 'Не получены настройки OMCI'),
                log('omci timeout start'),
                (timeoutPromise = $timeout(function() {
                  log('omci timeout finish'),
                    $scope.switchStep(
                      $scope.ponData.ploam ? 'support' : 'edit_ploam'
                    );
                }, omciTimeout)),
                $scope.switchStep('configuring');
              break;
            case 'tr_configuring':
              ($scope.lastError = 'Не получены настройки TR'),
                log('tr timeout start'),
                (timeoutPromise = $timeout(function() {
                  log('tr timeout finish'),
                    $scope.switchStep('configuring_failed');
                }, trTimeout)),
                $scope.switchStep('configuring');
              break;
            case 'tr_configured':
              log('configuration finished'), stepManager.action('configured');
          }
        }
      }),
      $scope.$watch('rootStartState', $scope.updateLogic);
  },
]);
