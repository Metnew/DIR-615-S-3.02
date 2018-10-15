'use strict';
!(function() {
  function WifiCommonGeneral($scope, constants, translate, ngDialog) {
    function changeBand() {
      return device.wifi.getBandFreq();
    }
    function updateData(newBand, oldBand) {
      if (
        newBand &&
        (!$scope.wifi.general.data || !_.isEqual(newBand, oldBand))
      ) {
        var band = device.wifi.getBand(0);
        $scope.wifi.general.data = band.radio;
      }
    }
    function supportedParam(param) {
      return device.wifi.supportedParam(param);
    }
    function supportedStandards() {
      if (!$scope.wifi.general.data) return {};
      var result = helper.supportedStandards(
        $scope.wifi.general.data.SupportedStandards
      );
      return result;
    }
    function getPossibleCountries() {
      return device.wifi.countries();
    }
    function selectWifiChannel(band) {
      var dlg = ngDialog.open({
        template: 'dialogs/wifi_channel_select/dialog.tpl.html',
        className: 'wifi_wmm_edit_dialog',
        controller: 'WifiChannelSelectCtrl',
        data: { currentChannel: $scope.wifi.general.data.Channel, band: band },
      });
      dlg.closePromise.then(function(data) {
        data.value &&
          data.value.selected &&
          ($scope.wifi.general.data.Channel = data.value.channel);
      });
    }
    function getAutoChannelComment() {
      return (
        'auto (' +
        translate('wifiChannel').toLowerCase() +
        ' ' +
        $scope.wifi.general.data.Channel +
        ')'
      );
    }
    var device = $scope.device,
      helper = device.wifi.helper;
    ($scope.wifi.general = {
      data: null,
      constants: constants,
      supportedParam: supportedParam,
      supportedStandards: supportedStandards,
      getPossibleCountries: getPossibleCountries,
      selectWifiChannel: selectWifiChannel,
      getAutoChannelComment: getAutoChannelComment,
    }),
      $scope.$watch(changeBand, updateData);
  }
  angular
    .module('app')
    .controller('WifiCommonGeneral', [
      '$scope',
      'wifiCommonConstants',
      'translate',
      'ngDialog',
      WifiCommonGeneral,
    ]);
})();
