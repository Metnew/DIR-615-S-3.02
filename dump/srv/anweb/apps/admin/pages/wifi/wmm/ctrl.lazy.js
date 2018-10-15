'use strict';
!(function() {
  function wifiWMMCtrl($scope, $state, ngDialog, wmmUtil) {
    function wifiPull() {
      device.wifi.pullWMM(function(error) {
        return error
          ? void $state.go('error', {
              code: 'pullError',
              message: 'pullErrorDesc',
            })
          : (($scope.band = device.wifi.getBand(0, '2.4GHz')),
            ($scope.data = $scope.band.wmm.data),
            ($scope.mode.value = $scope.data.settings.Enable
              ? $scope.data.settings.Mode
              : 'Disabled'),
            ($scope.mode.support = wmmUtil.hasSupportMode
              ? wmmUtil.hasSupportMode()
              : $scope.band.wmm.hasSupportMode()),
            $scope.$emit('pageload'),
            void ($scope.isActivate = !0));
      });
    }
    var device = $scope.device;
    wifiPull(),
      ($scope.mode = {
        support: !1,
        value: null,
        change: function() {
          switch (this.value) {
            case 'Auto':
              ($scope.data.settings.Enable = !0),
                ($scope.data.settings.Mode = 'Auto');
              break;
            case 'Manual':
              ($scope.data.settings.Enable = !0),
                ($scope.data.settings.Mode = 'Manual');
              break;
            case 'Disabled':
              $scope.data.settings.Enable = !1;
              break;
            default:
              return;
          }
          $scope.apply();
        },
      }),
      ($scope.getCWValue = function(key) {
        return (1 << key) - 1;
      }),
      ($scope.transcripts = {
        BK: 'Background',
        BE: 'Best Effort',
        VI: 'Video',
        VO: 'Voice',
      }),
      ($scope.apply = function() {
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start();
        device.wifi.push(function(error) {
          overlay.stop(overlayId),
            error
              ? $state.go('error', {
                  code: 'pushError',
                  message: 'pushErrorDesc',
                })
              : wifiPull();
        });
      }),
      ($scope.edit = function(item, key, type) {
        ngDialog
          .open({
            template: 'dialogs/wifi_wmm_edit/dialog.tpl.html',
            className: 'wifi_wmm_edit_dialog',
            controller: WifiWMMEditDialogCtrl,
            data: { key: key, type: type },
            scope: $scope,
          })
          .closePromise.then(function(data) {
            data.value && $scope.apply();
          });
      }),
      ($scope.getModeList = function() {
        return [
          { name: 'wifiWmmAuto', value: 'Auto' },
          { name: 'wifiWmmManual', value: 'Manual' },
          { name: 'wifiWmmDisabled', value: 'Disabled' },
        ];
      });
  }
  angular
    .module('app')
    .controllerProvider.register('wifiWMMCtrl', [
      '$scope',
      '$state',
      'ngDialog',
      'wifiWMMUtil',
      wifiWMMCtrl,
    ]);
})();
