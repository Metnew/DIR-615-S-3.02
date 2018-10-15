'use strict';
function _typeof(obj) {
  return obj && 'undefined' != typeof Symbol && obj.constructor === Symbol
    ? 'symbol'
    : typeof obj;
}
angular.module('app').controllerProvider.register('SysTracerouteCtrl', [
  '$scope',
  'somovd',
  '$timeout',
  'translate',
  'eventHandler',
  'funcs',
  'ngDialog',
  function($scope, somovd, $timeout, translate, eventHandler, funcs, ngDialog) {
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
    var config = { timeout: 6e5 },
      somovdObj = somovd.getInstance(config),
      maxTtl = 30,
      nQueries = 2,
      waitTime = 3;
    !(function() {
      function initCallback(data) {
        ($scope.ipv6Avail = !isError(data)), $scope.$emit('pageload');
      }
      somovdObj.read(132, initCallback),
        ($scope.isRequestInProgress = !0),
        ($scope.loading = !1),
        eventHandler.setFlag('requestOverlaySuspend', !1),
        ($scope.traceroute = {
          host: '',
          count: 1,
          is_ipv6: !1,
          max_ttl: maxTtl,
          nqueries: nQueries,
          waittime: waitTime,
        }),
        ($scope.console = '');
    })(),
      ($scope.getTraceroute = function() {
        $scope.tracerouteSettings.$invalid ||
          (($scope.loading = !0),
          ($scope.isRequestInProgress = !1),
          eventHandler.setFlag('requestOverlaySuspend', !0),
          somovdObj
            .write(166, $scope.traceroute)
            .then(
              function(response) {
                var isIPv6 = $scope.traceroute.is_ipv6,
                  key = isIPv6 ? 'traceroute6' : 'traceroute';
                response.data
                  ? ($scope.console && ($scope.console += '\n\n'),
                    ($scope.console += response.data[key]))
                  : 65 == response.status &&
                    ($scope.console && ($scope.console += '\n\n'),
                    ($scope.console += translate('error_request_in_progress'))),
                  ($scope.loading = !1),
                  ($scope.isRequestInProgress = !0),
                  eventHandler.setFlag('requestOverlaySuspend', !1),
                  $timeout(scrollToBottom());
              },
              function(response) {
                $scope.console && ($scope.console += '\n\n'),
                  ($scope.console += translate('error_request_timeout')),
                  ($scope.loading = !1),
                  ($scope.isRequestInProgress = !0),
                  eventHandler.setFlag('requestOverlaySuspend', !1),
                  $timeout(scrollToBottom());
              }
            )
            ['catch'](function(error) {
              ($scope.loading = !1),
                ($scope.isRequestInProgress = !0),
                eventHandler.setFlag('requestOverlaySuspend', !1);
            }));
      }),
      ($scope.clearConsole = function() {
        $scope.console = '';
      }),
      ($scope.settingsDiffCount = function() {
        var count = 0;
        return (
          $scope.traceroute.max_ttl != maxTtl && count++,
          $scope.traceroute.nqueries != nQueries && count++,
          $scope.traceroute.waittime != waitTime && count++,
          count
        );
      }),
      ($scope.openTracerouteSettings = function() {
        ($scope.traceroute.tmp_max_ttl = $scope.traceroute.max_ttl),
          ($scope.traceroute.tmp_nqueries = $scope.traceroute.nqueries),
          ($scope.traceroute.tmp_waittime = $scope.traceroute.waittime),
          ngDialog.open({
            template: '/admin/dialogs/traceroute_settings/dialog.tpl.html',
            controller: 'TracerouteSettings',
            closeByEscape: !1,
            resolve: funcs.getLazyResolve(
              '/admin/dialogs/traceroute_settings/ctrl.lazy.js',
              'TracerouteSettings'
            ),
            scope: $scope,
          });
      });
  },
]);
