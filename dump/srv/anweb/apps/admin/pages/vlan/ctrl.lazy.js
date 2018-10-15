'use strict';
angular.module('app').controllerProvider.register('VlanCtrl', [
  '$scope',
  '$q',
  '$timeout',
  'snackbars',
  'overlay-simple',
  'vlanConfig',
  function($scope, $q, $timeout, snackbars, overlay, config) {
    function updateVlans() {
      return pushVlans().then(pullVlans, pullVlans);
    }
    function pullVlans() {
      return promisePull(vlan.pull).then(function() {
        $scope.vlans = vlan.list();
      });
    }
    function pushVlans() {
      function pushEnd(status) {
        clearTimeoutPush(),
          'success' == status &&
            (snackbars.add.bind(null, 'rpc_write_success'), deferred.resolve()),
          'error' == status &&
            (snackbars.add.bind(null, 'rpc_write_error'), deferred.reject());
      }
      function setTimeoutPush() {
        overlay.start({ event: 'vlan.timeout' }),
          (timeoutPush = $timeout(function() {
            pushEnd('error');
          }, 3e4));
      }
      function clearTimeoutPush() {
        overlay.stop({ event: 'vlan.timeout' }),
          timeoutPush && ($timeout.cancel(timeoutPush), (timeoutPush = null));
      }
      var deferred = $q.defer(),
        timeoutPush = null;
      return (
        setTimeoutPush(),
        vlan.push(function(error) {
          error || pushEnd('success');
        }),
        deferred.promise
      );
    }
    function promisePull(pull) {
      var deferred = $q.defer();
      return (
        pull(function(error) {
          return error
            ? ($state.go('error', {
                code: 'pullError',
                message: 'pullErrorDesc',
              }),
              void deferred.reject())
            : void deferred.resolve();
        }),
        deferred.promise
      );
    }
    function toArray(obj) {
      return obj
        ? Object.keys(obj).map(function(key) {
            return obj[key];
          })
        : [];
    }
    var device = $scope.device,
      vlan = device.vlan;
    ($scope.defined = config.defined),
      ($scope.pull = pullVlans),
      ($scope.push = pushVlans),
      ($scope.update = updateVlans),
      ($scope.promisePull = promisePull),
      ($scope.joinPorts = function(obj, sep, empty) {
        function getKey(port) {
          return port.Alias;
        }
        return (
          (sep = void 0 === sep ? ', ' : sep),
          $scope.replaceIfEmpty(
            toArray(obj)
              .map(getKey)
              .join(sep),
            empty
          )
        );
      }),
      ($scope.joinVidRange = function(item, empty) {
        return $scope.replaceIfEmpty(
          item.Vid && item.VidRangeEnd
            ? item.Vid + '-' + item.VidRangeEnd
            : item.Vid,
          empty
        );
      }),
      ($scope.replaceIfEmpty = function(str, empty) {
        return (
          (empty = void 0 === empty ? '-' : empty),
          str || 0 === str ? str + '' : empty
        );
      });
  },
]);
