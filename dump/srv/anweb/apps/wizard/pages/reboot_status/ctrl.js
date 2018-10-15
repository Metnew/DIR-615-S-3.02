'use strict';
angular.module('wizard').controller('wizardRebootStatusCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$location',
  'devinfo',
  '$interval',
  'funcs',
  'profileInspector',
  'queryString',
  function(
    $scope,
    $rootScope,
    $state,
    $stateParams,
    $location,
    devinfo,
    $interval,
    funcs,
    profile,
    queryString
  ) {
    function devinfoHandler(data, error) {
      function goToNewIP(ip) {
        var url = $location.protocol() + '://' + ip;
        goAway(url);
      }
      function isNeedSetDefaultIP(ip) {
        return !isLocalhost() && !isDomain() && $location.host() != ip;
      }
      function isLocalhost() {
        var host = $location.host();
        return 'localhost' == host || '127.0.0.1' == host;
      }
      function isDomain() {
        var host = $location.host();
        return !funcs.is.ipv4(host);
      }
      if (!$scope.rootAuthDialogIsOpen) {
        if (
          (data ? availCount++ : (availCount = 0),
          'wait' == $scope.step &&
            ('update' == $scope.action &&
              data &&
              data.lastUpdateError &&
              $state.go('status', { step: 'updateFailed' }),
            $scope.checkCount >= $scope.checkCountMax &&
              'reset' == $stateParams.action &&
              isNeedSetDefaultIP(defaultIP)))
        )
          return void goToNewIP(defaultIP);
        if ('check' == $scope.step) {
          if (queryString.nocheck) return void $scope.next();
          $scope.checkCount >= $scope.checkCountMax &&
            (devinfo.unsubscribe('notice', devinfoHandler),
            $scope.switchStep('error')),
            data &&
              $rootScope.gDeviceAvail &&
              availCount >= availCountMax &&
              $scope.next();
        }
        data &&
          $rootScope.gDeviceAvail &&
          'wait' == $scope.step &&
          availCount >= availCountMax &&
          (devinfo.unsubscribe('notice', devinfoHandler), $scope.next());
      }
    }
    function goToNewWizardURL(ip) {
      var port = location.port,
        path = location.pathname,
        proto = location.protocol,
        query =
          '?afterReload=1' +
          _.reduce(
            queryString,
            function(m, v, k) {
              return m + '&' + k + '=' + encodeURIComponent(v);
            },
            ''
          ),
        url =
          proto + '//' + ip + String(port ? ':' + port : port) + path + query;
      (window.onbeforeunload = null), (location.href = url);
    }
    function updateCircles() {
      $scope.checkCount++;
    }
    profile.set($scope.nativeData),
      $scope.setNeedAuth(!1),
      ($scope.action = $stateParams.action),
      ($scope.pause = !0),
      ($scope.step = 'wait'),
      ($scope.checkCount = 0),
      ($scope.checkCountMax = 5),
      ($scope.rebootDuration = parseInt('90000')),
      ($scope.checkTimeout = 1e4);
    var circlesInterval = $interval(updateCircles, 2e3),
      availCount = 0,
      availCountMax = 5,
      defaultIP = '192.168.0.1';
    ($rootScope.gAutoAuth = !0),
      $stateParams.duration && ($scope.rebootDuration = $stateParams.duration),
      'reset' == $stateParams.action && ($scope.checkCountMax = 25),
      'update' == $stateParams.action &&
        (($rootScope.gNeedAuth = !1),
        ($scope.rebootDuration = 18e4),
        ($scope.checkTimeout = 16e4)),
      $scope.showAvailOverlay(!1),
      $scope.$watch('step', function(step) {
        switch (step) {
          case 'check':
            ($scope.checkCount = 0),
              devinfo.subscribe('notice', devinfoHandler);
        }
      }),
      $scope.$watch('rootAuthDialogIsOpen', function(opened) {
        $scope.pause = opened;
      }),
      $scope.$on('$destroy', function() {
        devinfo.unsubscribe('notice', devinfoHandler),
          $interval.cancel(circlesInterval),
          devinfo.init({ timeout: 1e4 });
      }),
      ($scope.switchStep = function(step) {
        $scope.step = step;
      }),
      ($scope.next = function() {
        var next = $stateParams.next
          ? decodeURIComponent($stateParams.next)
          : null;
        $scope.setNeedAuth(!0),
          next && /^(http|https):/.test(next)
            ? goAway(next)
            : next
              ? $state.go(next, {
                  prev: 'reboot_status',
                  prev_action: $scope.action,
                })
              : goAway('/');
      }),
      ($scope.callback = function(status) {
        if ('finished' == status && 'wait' == $scope.step) {
          if ($stateParams.nocheck) return void $scope.next();
          if (
            (devinfo.unsubscribe('notice', devinfoHandler),
            profile.containLAN())
          ) {
            var address =
              $scope.nativeData.Config.LAN[1].IPv4.StaticIP[1].Address;
            goToNewWizardURL(address);
          } else $scope.switchStep('info');
        }
      }),
      ($scope.isWiFiEnabled = function() {
        return (
          $scope.nativeData &&
          $scope.nativeData.Config.WiFi &&
          $scope.nativeData.Config.WiFi.Radio[1].Enable
        );
      }),
      ($scope.isWiFiEncrypted = function() {
        return (
          $scope.nativeData &&
          $scope.nativeData.Config.WiFi &&
          $scope.nativeData.Config.WiFi.Radio[1].AccessPoint[1].Security.ModeEnabled.indexOf(
            'Personal'
          ) >= 0
        );
      });
    var startInterval = $interval(function() {
      $scope.pause ||
        ($interval.cancel(startInterval),
        devinfo.subscribe('notice', devinfoHandler));
    }, $scope.checkTimeout);
    devinfo.init({ timeout: 5e3 });
  },
]);
