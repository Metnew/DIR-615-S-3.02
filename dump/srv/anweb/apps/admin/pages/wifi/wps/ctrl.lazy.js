'use strict';
!(function() {
  function wifiWPSCtrl(
    $scope,
    $state,
    $timeout,
    devinfo,
    translate,
    constants,
    ngDialog,
    funcs
  ) {
    function activate() {
      device.wifi.pullAdv(function(error) {
        if (error)
          return void $state.go('error', {
            code: 'pullError',
            message: 'pullErrorDesc',
          });
        ($scope.wifi.band.list.length = 0),
          device.wifi.hasBand('2.4GHz') && $scope.wifi.band.list.push('2.4GHz'),
          device.wifi.hasBand('5GHz') && $scope.wifi.band.list.push('5GHz');
        var freq = $state.params.freq
          ? $state.params.freq
          : _.first($scope.wifi.band.list);
        $scope.wifi.band.change(freq),
          ($scope.wifi.isActivate = !0),
          $scope.$emit('pageload');
      });
    }
    function changeBand(freq) {
      $scope.wifi.band.state = freq;
      var band = device.wifi.getBand(0, freq);
      ($scope.wifi.wps = band.wps),
        ($scope.wifi.connectMethod = $scope.wifi.wps.getConnectMethod()),
        ($scope.wifi.info = $scope.wifi.wps.getInfo()),
        $state.go('.', { freq: freq }, { notify: !1 }),
        resetStatusChecker();
    }
    function update() {
      apply(activate);
    }
    function refresh() {
      activate();
    }
    function reset() {
      $scope.wifi.wps.reset(update);
    }
    function connect() {
      var dlg = ngDialog.open({
        template: 'dialogs/wps_connection/dialog.tpl.html',
        controller: 'WpsConnectionDialogController',
        resolve: funcs.getLazyResolve(
          'dialogs/wps_connection/ctrl.lazy.js',
          'WpsConnectionDialogController'
        ),
      });
      dlg.closePromise.then(function(result) {
        result &&
          result.value &&
          !_.isString(result.value) &&
          (_.extend($scope.wifi.wps.data, {
            Method: result.value.method,
            PIN: result.value.pin,
          }),
          $scope.wifi.wps.connect(update));
      });
    }
    function enableRadio() {
      device.wifi.enableRadio($scope.wifi.band.state, update);
    }
    function enableRadioBroadcast() {
      device.wifi.enableRadioBroadcast($scope.wifi.band.state, update);
    }
    function resetStatusChecker() {
      constants.CHECK_CONNECTION_STATUS &&
        (checkStatus('stop'),
        $scope.wifi.wps.data.Enable && checkStatus('start'));
    }
    function checkStatus(action) {
      function updateStatus(result) {
        if (result[158]) {
          var status = result[158].WpsProcStatus;
          $scope.wifi.info.connStatus = status
            ? 'wifiWPSConnStatus' + status
            : 'wifiWPSConnStatus0';
        }
      }
      'start' == action
        ? devinfo.subscribe('158', updateStatus, $scope)
        : devinfo.unsubscribe('158', updateStatus);
    }
    function apply(cb) {
      device.wifi.push(function(error) {
        return error
          ? void $state.go('error', {
              code: 'pushError',
              message: 'pushErrorDesc',
            })
          : void (cb && cb());
      });
    }
    function hasWarning(name) {
      var warnings = $scope.wifi.wps.warnings();
      return name ? _.contains(warnings, name) : warnings.length;
    }
    function hasInfoParam(param) {
      return $scope.wifi.info ? _.has($scope.wifi.info, param) : !1;
    }
    function hasAction(name) {
      var param = name.toUpperCase() + '_ACTION';
      return constants[param];
    }
    var device = $scope.device;
    ($scope.wifi = {
      isActivate: !1,
      wps: null,
      connectMethod: null,
      connectStatus: null,
      info: {},
      hasWarning: hasWarning,
      hasInfoParam: hasInfoParam,
      hasAction: hasAction,
    }),
      ($scope.wifi.band = { list: [], state: null, change: changeBand }),
      ($scope.wifi.action = {
        update: update,
        connect: connect,
        refresh: refresh,
        reset: reset,
        enableRadio: enableRadio,
        enableRadioBroadcast: enableRadioBroadcast,
      }),
      activate();
  }
  angular
    .module('app')
    .controllerProvider.register('wifiWPSCtrl', [
      '$scope',
      '$state',
      'translate',
      'devinfo',
      'translate',
      'wifiWPSConstants',
      'ngDialog',
      'funcs',
      wifiWPSCtrl,
    ]);
})();
