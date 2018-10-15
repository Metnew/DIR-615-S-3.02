'use strict';
angular.module('wizard').controller('wizardStatusCtrl', [
  '$q',
  '$scope',
  '$rootScope',
  '$state',
  '$interval',
  '$timeout',
  'devinfo',
  '$http',
  'profiles',
  '$stateParams',
  'autoupdate',
  'translate',
  'voipHelper',
  'profileInspector',
  'queryString',
  function(
    $q,
    $scope,
    $rootScope,
    $state,
    $interval,
    $timeout,
    devinfo,
    $http,
    profiles,
    $stateParams,
    autoupdate,
    translate,
    voip,
    profile,
    queryString
  ) {
    function isConnectionCreated() {
      var wans = profile.byPath('Config.WAN');
      return !!_.size(wans);
    }
    function getDeviceAddress() {
      var hostname = profile.byPath('Config.LAN.1.IPv4.StaticIP.1.Address');
      hostname || (hostname = location.hostname);
      var port = location.port ? ':' + location.port : '';
      return location.protocol + '//' + hostname + port;
    }
    function isDeviceAddressChanged() {
      var ip = profile.byPath('Config.LAN.1.IPv4.StaticIP.1.Address');
      return ip && $rootScope.rootDeviceIP != ip;
    }
    function reloadAndFinish() {
      goAway(getDeviceAddress() + '/wizard/index-wizard.html?finish=y');
    }
    function reloadAndCheck() {
      goAway(getDeviceAddress() + '/wizard/index-wizard.html?reload=y');
    }
    function rebootDevice() {
      var next = 'status';
      isDeviceAddressChanged() &&
        (next = encodeURIComponent(
          getDeviceAddress() + '/wizard/index-wizard.html?finish=y'
        )),
        $state
          .go('reboot_status', {
            next: next,
            action: 'reboot',
            nocheck: isDeviceAddressChanged() ? 'y' : '',
          })
          ['finally'](function() {
            device.system.reboot(!0);
          });
    }
    function checkNetAndUpdate() {
      var authUpdate = $scope.isAutoupdateEnabled($scope.nativeData),
        redirect = encodeURIComponent(
          queryString.redirecturl ? queryString.redirecturl : ''
        ),
        authUpdateURL = encodeURIComponent(
          '/wizard/index-wizard.html?checkUpdate=1&redirecturl=' + redirect
        ),
        resultURL =
          getDeviceAddress() +
          '/trouble/index.html?redirecturl=' +
          redirect +
          '&finishURL=' +
          String(authUpdate ? authUpdateURL : 'connected');
      goAway(resultURL);
    }
    function checkDeviceAdressChange() {
      return isDeviceAddressChanged()
        ? (isConnectionCreated()
            ? $scope.isAutoupdateEnabled($scope.nativeData)
              ? checkNetAndUpdate()
              : goAway(getDeviceAddress() + '/trouble/index.html')
            : reloadAndFinish(),
          !0)
        : !1;
    }
    function checkUpdate() {
      function onData(data) {
        data &&
          (devinfo.unsubscribe('notice', onData),
          __unwatch(),
          data.updateVersion
            ? (($rootScope.rootUpdateVersion = data.updateVersion),
              $scope.changeStatusStep('updateAvail'))
            : $state.go('finish'));
      }
      ($rootScope.rootUpdateChecked = !0), autoupdate.check();
      var __unwatch = $scope.$watch('circleCount', function(count) {
        count >= 5 &&
          (devinfo.unsubscribe('notice', onData), $state.go('finish'));
      });
      devinfo.subscribe('notice', onData);
    }
    function checkDevice() {
      function devinfoHandler(data, error) {
        if (data && $rootScope.gDeviceAvail)
          if (
            (devinfo.unsubscribe('notice', devinfoHandler),
            $interval.cancel(intervalID),
            window.dbgNeedReboot || 'NeedSaveAndReboot' == data.systemNotice)
          )
            rebootDevice();
          else {
            if (checkDeviceAdressChange()) return;
            isConnectionCreated()
              ? $scope.changeStatusStep('netCheck')
              : $state.go('finish', { net: 'skiped' });
          }
      }
      function updateCircles() {
        $scope.devCheckCount++,
          4 == $scope.devCheckCount &&
            (devinfo.unsubscribe('notice', devinfoHandler),
            $interval.cancel(intervalID),
            $scope.changeStatusStep('devError'));
      }
      $scope.devCheckCount = 0;
      var intervalID = $interval(updateCircles, 2e3);
      devinfo.subscribe('notice', devinfoHandler);
    }
    function checkNetwork() {
      function devinfoHandler(data) {
        if (data) {
          devinfo.unsubscribe('net', devinfoHandler);
          var connected =
              (data.ipv4gw && 'Connected' == data.ipv4gw.connection_status) ||
              (data.ipv6gw && 'Connected' == data.ipv6gw.connection_status),
            authUpdate = $scope.isAutoupdateEnabled($scope.nativeData);
          connected
            ? ($rootScope.showOverlay(!1),
              $rootScope.showView(!0),
              authUpdate
                ? $scope.changeStatusStep('updateCheck')
                : $state.go('finish'))
            : checkNetAndUpdate();
        }
      }
      $rootScope.showOverlay(!0),
        $rootScope.showView(!1),
        devinfo.once('net').then(devinfoHandler),
        devinfo.subscribe('net', devinfoHandler),
        ($scope.devCheckCount = 0),
        ($scope.netStatus = 'wizard_status_checkconn');
    }
    function applyConfig(applyDuration) {
      function applyed(isError, isTimeout, info) {
        if ('apply' == $scope.step) {
          if (
            (($scope.applyMax = 0),
            devinfo.unsubscribe('notice', checkApply),
            $rootScope.rootNoRebootLAN && isDeviceAddressChanged())
          )
            return reloadAndCheck();
          if (isError) $scope.changeStatusStep('applyErr');
          else if (isTimeout) $scope.changeStatusStep('info');
          else if (
            (info && 'NeedSaveAndReboot' == info.systemNotice) ||
            window.dbgNeedReboot
          )
            rebootDevice();
          else {
            if (checkDeviceAdressChange()) return;
            isConnectionCreated()
              ? $scope.changeStatusStep('netCheck')
              : $state.go('finish', { net: 'skiped' });
          }
          isError ||
            isTimeout ||
            !(
              ('' == info.systemNotice && info.factorySettings) ||
              window.dbgNeedSave
            ) ||
            device.system.save();
        }
      }
      function checkApply(info) {
        ($scope.applyStatus = null),
          info &&
            (($scope.applyStatus = info.dccStatus),
            'dcc_failed' == info.dccStatus
              ? applyed(!0, !1, info)
              : 'dcc_finished' == info.dccStatus && applyed(!1, !1, info));
      }
      ($scope.applyMax = applyDuration),
        $scope.nativeData &&
          $scope.nativeData.Config.SystemPassword &&
          $scope.setAutoAuth(
            $scope.nativeData.Config.SystemPassword.Login,
            $scope.nativeData.Config.SystemPassword.Password
          ),
        $rootScope.$on('cricle_bar_finished', function() {
          'dcc_applying' == $scope.applyStatus ? applyed(!0) : applyed(!1, !0);
        }),
        devinfo.subscribe('notice', checkApply);
    }
    devinfo.init({ timeout: 5e3 });
    var device = $scope.device;
    if (
      ($scope.setNeedAuth(!1),
      ($scope.awayURL = URL_HASH),
      ($scope.step = queryString.reload ? 'devСheck' : 'apply'),
      ($scope.recheckCount = 0),
      ($scope.devCheckCount = 0),
      ($scope.devErrorIsWIFI = !0),
      ($scope.devErrorWiFi = {}),
      ($scope.applyMax = 0),
      ($scope.applyStatus = null),
      $scope.showAvailOverlay(!1),
      queryString.checkUpdate && ($scope.step = 'updateCheck'),
      ($scope.changeStatusStep = function(step) {
        $scope.step = step;
      }),
      ($scope.toSite = function() {
        goAway($rootScope.getRedirectUrl());
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
      }),
      $scope.$watch('step', function(step) {
        switch (
          (console.log('step is', step), ($scope.circleCount = 0), step)
        ) {
          case 'apply':
            applyConfig(
              $rootScope.gApplyDuration ? $rootScope.gApplyDuration : 65e3
            );
            break;
          case 'devСheck':
            checkDevice();
            break;
          case 'netCheck':
            checkNetwork();
            break;
          case 'updateCheck':
            checkUpdate();
        }
      }),
      ($scope.getFirmwareMessage = function() {
        return translate('wizard_firmware_avail').replace(
          /<VERSION>/,
          $rootScope.rootUpdateVersion
        );
      }),
      ($scope.cancelUpdate = function() {
        $state.go('finish');
      }),
      ($scope.runUpdate = function() {
        $rootScope.showOverlay(!0),
          autoupdate
            .start()
            .then(function(data) {
              data && data.duration
                ? $state
                    .go('reboot_status', {
                      action: 'update',
                      next: 'status',
                      duration: data.duration,
                    })
                    ['finally'](function() {
                      $rootScope.showOverlay(!1);
                    })
                : $scope.changeStatusStep('updateFailed');
            })
            ['catch'](function() {
              $state.go('finish'), $rootScope.showOverlay(!1);
            });
      }),
      $stateParams.step)
    )
      $scope.changeStatusStep($stateParams.step);
    else
      switch ($stateParams.prev) {
        case 'trouble':
          $scope.isAutoupdateEnabled($rootScope.nativeData)
            ? $scope.changeStatusStep('updateCheck')
            : $state.go('finish');
          break;
        case 'reboot_status':
          switch ($stateParams.prev_action) {
            case 'update':
              devinfo.once('version').then(function(data) {
                console.log('device version:', data.version),
                  console.log(
                    'firmware version:',
                    $rootScope.rootUpdateVersion
                  ),
                  $scope.changeStatusStep(
                    data.version == $rootScope.rootUpdateVersion
                      ? 'updateCompleted'
                      : 'updateFailed'
                  );
              });
              break;
            default:
              isConnectionCreated()
                ? $scope.changeStatusStep('netCheck')
                : checkDeviceAdressChange() ||
                  $state.go('finish', { net: 'skiped' });
          }
      }
    if ($stateParams.error) $scope.changeStatusStep('applyErr');
    else {
      var _promise = $interval(function() {
        $scope.circleCount++;
      }, 2e3);
      $scope.$on('$destroy', function() {
        $interval.cancel(_promise);
      });
    }
  },
]);
