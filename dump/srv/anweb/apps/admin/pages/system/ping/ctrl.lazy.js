'use strict';
function _typeof(obj) {
  return obj && 'undefined' != typeof Symbol && obj.constructor === Symbol
    ? 'symbol'
    : typeof obj;
}
angular.module('app').controllerProvider.register('SysPingCtrl', [
  '$scope',
  'somovd',
  '$timeout',
  'funcs',
  'ngDialog',
  function($scope, somovd, $timeout, funcs, ngDialog) {
    function scrollToBottom() {
      var console = document.getElementById('console');
      return function() {
        console.scrollTop = console.scrollHeight;
      };
    }
    function isError(data) {
      return (
        'object' !==
          ('undefined' == typeof data ? 'undefined' : _typeof(data)) ||
        !('status' in data) ||
        data.status >= 50
      );
    }
    var settingsPacketsize = 56,
      settingsTimeout = 3;
    !(function() {
      function initCallback(data) {
        ($scope.ipv6Avail = !isError(data)), $scope.$emit('pageload');
      }
      somovd.read(132, initCallback),
        ($scope.loading = !1),
        ($scope.isRequestInProgress = !0),
        ($scope.ping = {
          host: '',
          count: 3,
          is_ipv6: !1,
          packetsize: settingsPacketsize,
          timeout: settingsTimeout,
        }),
        ($scope.console = '');
    })(),
      ($scope.getPing = function() {
        function writeCb(isIPv6, response) {
          var key = isIPv6 ? 'ping6' : 'ping';
          response.data &&
            ($scope.console && ($scope.console += '\n\n'),
            ($scope.console += response.data[key]),
            $timeout(scrollToBottom())),
            ($scope.loading = !1),
            ($scope.isRequestInProgress = !0);
        }
        $scope.pingSettings.$invalid ||
          (($scope.isRequestInProgress = !1),
          ($scope.loading = !0),
          somovd.write(
            18,
            $scope.ping,
            writeCb.bind(null, $scope.ping.is_ipv6)
          ));
      }),
      ($scope.clearConsole = function() {
        $scope.console = '';
      }),
      ($scope.settingsDiffCount = function() {
        var count = 0;
        return (
          $scope.ping.packetsize != settingsPacketsize && count++,
          $scope.ping.timeout != settingsTimeout && count++,
          count
        );
      }),
      ($scope.openPingSettings = function() {
        ($scope.ping.tmp_packetsize = $scope.ping.packetsize),
          ($scope.ping.tmp_timeout = $scope.ping.timeout),
          ngDialog.open({
            template: '/admin/dialogs/ping_settings/dialog.tpl.html',
            controller: 'PingSettings',
            closeByEscape: !1,
            resolve: funcs.getLazyResolve(
              '/admin/dialogs/ping_settings/ctrl.lazy.js',
              'PingSettings'
            ),
            scope: $scope,
          });
      });
  },
]);
