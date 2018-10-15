'use strict';
!(function() {
  function wifiClientShapingCtrl($scope, $state, funcs, ngDialog, translate) {
    function rateInfo(rate) {
      return rate
        ? rate / constants.KbInMB
        : translate('wifiClientShapingUnlimited');
    }
    function getMiniCaption(key, value) {
      return key;
    }
    function getMiniShort(key, value) {
      var list = [];
      return (
        list.push(
          value.UploadRate
            ? value.UploadRate / constants.KbInMB + ' ' + translate('mbps')
            : translate('wifiClientShapingUnlimited')
        ),
        list.push(
          value.DownloadRate
            ? value.DownloadRate / constants.KbInMB + ' ' + translate('mbps')
            : translate('wifiClientShapingUnlimited')
        ),
        list.join(' - ')
      );
    }
    function init() {
      util.pull(function(error) {
        return error
          ? void $state.go('error', {
              code: 'pullError',
              message: 'pullErrorDesc',
            })
          : ((wifiShaping.data = util.getData()),
            _.each(wifiShaping.data, function(e, k) {
              return (e.__Key = k);
            }),
            $scope.$emit('pageload'),
            ($scope.isActivate = !0),
            void ($scope.isEmpty = !_.size(wifiShaping.data)));
      });
    }
    function save() {
      _.each(wifiShaping.data, function(e, k) {
        return delete e.__Key;
      }),
        util.push(function(error) {
          error
            ? $state.go('error', {
                code: 'pushError',
                message: 'pushErrorDesc',
              })
            : $state.go($state.current, {}, { reload: !0 });
        });
    }
    function add() {
      openDialog('add', {
        Enabled: !0,
        Mac: '',
        DownloadRate: '',
        UploadRate: '',
      });
    }
    function edit(item, key) {
      openDialog('edit', {
        Enabled: item.Enabled,
        Mac: key,
        DownloadRate: item.DownloadRate,
        UploadRate: item.UploadRate,
      });
    }
    function remove(items, keys) {
      _.each(keys, function(mac) {
        delete wifiShaping.data[mac];
      }),
        save();
    }
    function openDialog(action, rule) {
      function handler(result) {
        if (result.value && '$escape' != result.value) {
          var value = result.value;
          (wifiShaping.data[value.Mac.toLowerCase()] = {
            Enabled: value.Enabled,
            DownloadRate: value.DownloadUnlim
              ? 0
              : value.DownloadRate * constants.KbInMB,
            UploadRate: value.UploadUnlim
              ? 0
              : value.UploadRate * constants.KbInMB,
          }),
            save();
        }
      }
      ngDialog
        .open({
          template: 'dialogs/wifi_shaping/dialog.tpl.html',
          className: 'wifi_shaping_dialog',
          controller: 'WifiShapingDialogCtrl',
          scope: $scope,
          data: { action: action, rule: _.clone(rule) },
        })
        .closePromise.then(handler);
    }
    var device = $scope.device,
      util = device.wifiShaping,
      wifiShaping = {
        data: null,
        add: add,
        remove: remove,
        edit: edit,
        save: save,
        wasModified: util.wasModified,
        rateInfo: rateInfo,
        getMiniCaption: getMiniCaption,
        getMiniShort: getMiniShort,
      },
      constants = {
        KbInMB: 1e3,
        minUploadRate: 1,
        maxUploadRate: 2e3,
        minDownloadRate: 1,
        maxDownloadRate: 2e3,
      };
    ($scope.wifiShaping = wifiShaping), ($scope.constants = constants), init();
  }
  angular
    .module('app')
    .controllerProvider.register('wifiClientShapingCtrl', [
      '$scope',
      '$state',
      'funcs',
      'ngDialog',
      'translate',
      wifiClientShapingCtrl,
    ]);
})();
