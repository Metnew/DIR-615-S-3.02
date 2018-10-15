'use strict';
!(function() {
  function WifiClientTableCtrl(
    $scope,
    $state,
    $q,
    translate,
    ngDialog,
    devinfo,
    $timeout
  ) {
    function getShortSecurity(item) {
      var mode = item.ModeEnabled;
      return '' != getCliConnStatus(item)
        ? ''
        : translate(
            'None' == mode ? 'wifiClientOpenNet' : 'wifiClientProtectedNet'
          ) + ', ';
    }
    function getCliConnStatus(item) {
      var status = '';
      return 'wizard' == module
        ? ''
        : $scope.ep.data
          ? _.isUndefined($scope.ep.data.BSSID)
            ? status
            : ($scope.ep.data.BSSID.toUpperCase() == item.BSSID.toUpperCase() &&
                $scope.ep.data.Band == item.Band &&
                ((status = translate(
                  $scope.ep.data.Connect
                    ? 'wifiClientConnected'
                    : 'wifiClientNotConnected'
                )),
                (status += ', ')),
              status)
          : status;
    }
    ($scope.getTableClass = function() {
      return 'app' == module
        ? 'card flat table'
        : 'wizard' == module
          ? 'content_block table'
          : void 0;
    }),
      ($scope.getImgSignal = function(item) {
        var signal = item.SignalStrength,
          security = item.ModeEnabled,
          value = parseInt(signal / 20);
        return (
          value || (value = '0'),
          5 == value && (value = 4),
          'None' != security
            ? value
              ? 'wifi_lock_' + value
              : ''
            : value
              ? 'wifi_' + value
              : ''
        );
      }),
      ($scope.getSecurity = function(elem) {
        var result = '',
          mode = elem.ModeEnabled,
          encr = elem.EncryptionType;
        switch (mode) {
          case 'None':
          case 'WEP':
            result += '[Open]';
            break;
          case 'WPA-Enterprise':
            result += '[WPA]';
            break;
          case 'WPA2-Enterprise':
            result += '[WPA2]';
            break;
          case 'WPA-WPA2-Enterprise':
            result += '[WPA/WPA2 mixed]';
            break;
          case 'WPA-Personal':
            result += '[WPA-PSK]';
            break;
          case 'WPA2-Personal':
            result += '[WPA2-PSK]';
            break;
          case 'WPA-WPA2-Personal':
            result += '[WPA-PSK/WPA2-PSK mixed]';
            break;
          default:
            result += '[UNKNOWN]';
        }
        return encr && (result += ' [' + encr + ']'), result;
      }),
      ($scope.showClientBand = function() {
        return !$scope.isSeparateClient;
      }),
      ($scope.getFreq = function(band) {
        return '2.4GHz' == band
          ? translate('24ghz')
          : '5GHz' == band
            ? translate('5ghz')
            : '';
      }),
      ($scope.getCaption = function(item) {
        return (
          '<span class="client-table-signal-level" svg-icon="{{getImgSignal(item)}}"></span>' +
          item.SSID
        );
      }),
      ($scope.getShort = function(item) {
        return (
          '<span class="client-table-short">' +
          getShortSecurity(item) +
          getCliConnStatus(item) +
          $scope.getFreq(item.Band) +
          '</span>'
        );
      }),
      ($scope.hideArrow = function() {
        return 'app' == module ? !1 : 'wizard' == module ? !0 : void 0;
      }),
      ($scope.isWizard = function() {
        return 'wizard' == module;
      }),
      ($scope.isLoadingList = function() {
        return $scope.wifiClient.scanLoading;
      });
  }
  var module = angular
    .element(document.querySelectorAll('[ng-app]'))
    .attr('ng-app');
  'app' == module &&
    angular
      .module('app')
      .controller('WifiClientTableCtrl', [
        '$scope',
        '$state',
        '$q',
        'translate',
        'ngDialog',
        'devinfo',
        '$timeout',
        WifiClientTableCtrl,
      ]),
    'wizard' == module &&
      angular
        .module('wizard')
        .controller('WifiClientTableCtrl', [
          '$scope',
          '$state',
          '$q',
          'translate',
          'ngDialog',
          'devinfo',
          '$timeout',
          WifiClientTableCtrl,
        ]);
})();
