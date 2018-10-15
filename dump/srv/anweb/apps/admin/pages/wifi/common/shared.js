'use strict';
!(function() {
  function wifiCommonShared(
    $rootScope,
    $q,
    $state,
    $timeout,
    translate,
    ngDialog,
    devinfo,
    device
  ) {
    function activate() {
      return __pullWifi().then(__pullClient);
    }
    function apply(action, freq) {
      function __successCb() {
        action && 'ap' == action
          ? $state.go('wifi.common', { freq: freq })
          : $state.go($state.current, {}, { reload: !0 });
      }
      function __errorCb() {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      var deviceLoss = device.wifi.checkDeviceLoss();
      deviceLoss.loss && __showDeviceLossMsg(deviceLoss).then(__successCb);
      var overlay = $rootScope.overlay.circular,
        overlayId = overlay.start();
      device.wifi.push(function(error) {
        overlay.stop(overlayId),
          deviceLoss.loss || (error ? __errorCb() : __successCb());
      });
    }
    function __pullWifi() {
      var deferred = $q.defer();
      return (
        device.wifi.pullCommon(function() {
          deferred.resolve();
        }),
        deferred.promise
      );
    }
    function __pullClient() {
      return devinfo.once('client').then(function(result) {
        return device.wifi.setClientInfo(result.client), result;
      });
    }
    function __showDeviceLossMsg(deviceLoss) {
      function startDialog(options) {
        return ngDialog.open({
          template: 'dialogs/wifi_device_loss/dialog.tpl.html',
          controller: 'WifiDeviceLossDialogCtrl',
          className: 'wifi_device_loss_dialog',
          data: options,
        });
      }
      return startDialog(deviceLoss).closePromise;
    }
    return { activate: activate, apply: apply };
  }
  angular
    .module('app')
    .service('wifiCommonShared', [
      '$rootScope',
      '$q',
      '$state',
      '$timeout',
      'translate',
      'ngDialog',
      'devinfo',
      'device',
      wifiCommonShared,
    ]);
})();
