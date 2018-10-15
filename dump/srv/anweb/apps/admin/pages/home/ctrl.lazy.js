'use strict';
!(function() {
  angular.module('app').controllerProvider.register('HomeCtrl', [
    '$scope',
    'pageList',
    '$state',
    'homeConstants',
    function($scope, pageList, $state, homeConstants) {
      pageList.portsWizard &&
        ($scope.goPortsWizard = function() {
          $state.go('wizard.ports');
        }),
        pageList.storageDlna &&
          ($scope.goStorageDlna = function() {
            $state.go('storage.dlna');
          }),
        pageList.urlfilter &&
          ($scope.goUrlFilter = function() {
            $state.go('firewall.urlfilter');
          }),
        pageList.printserver &&
          ($scope.goPrintServer = function() {
            $state.go('printserver');
          }),
        pageList.storageTorrent &&
          ($scope.goStorageTorrent = function() {
            $state.go('storage.torrent');
          }),
        pageList.wifiMac &&
          ($scope.goWifiMac = function() {
            $state.go('wifi.mac');
          }),
        pageList.wifiCommon &&
          ($scope.goWifiCommon = function() {
            $state.go('wifi.common');
          }),
        pageList.yandexDnsRules &&
          ($scope.goYandexDnsRules = function() {
            $state.go('yandexdns.rules');
          }),
        pageList.summary &&
          ($scope.goSummary = function() {
            $state.go('summary');
          }),
        $scope.$emit('pageload');
    },
  ]);
})();
