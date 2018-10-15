'use strict';
!(function() {
  function yandexDnsSettingsController($scope, device) {
    function activate(response) {
      ($scope.ydSettings = yandexSettingsProvider.getConfig()),
        $scope.$emit('pageload');
    }
    function init() {
      yandexSettingsProvider.pull().then(activate);
    }
    var yandexSettingsProvider = device.yandexDns.settings;
    ($scope.ydSettings = {}),
      ($scope.ydModesAvailable = yandexSettingsProvider.getAvailableModes()),
      ($scope.save = function() {
        yandexSettingsProvider.push();
      }),
      ($scope.saveEnabled = function() {
        return yandexSettingsProvider.wasModified();
      }),
      _.isFunction(device.safeDns.pullEnabled)
        ? device.safeDns.pullEnabled().then(function(enabled) {
            enabled
              ? (($scope.ydSafeDNSWarning = !0), $scope.$emit('pageload'))
              : init();
          })
        : init();
  }
  angular
    .module('app')
    .controllerProvider.register(
      'yandexDnsSettingsController',
      yandexDnsSettingsController
    ),
    (yandexDnsSettingsController.$inject = ['$scope', 'device']);
})();
