'use strict';
angular.module('app').controllerProvider.register('DdnsCtrl', [
  '$scope',
  '$state',
  'funcs',
  'snackbars',
  'ddnsUtil',
  function($scope, $state, funcs, snackbars, util) {
    function init() {
      function initCallback(data) {
        (helper = util.makeHelper()),
          ($scope.ddns = helper.getDdns()),
          ($scope.config = helper.getConfiguration()),
          $scope.config.NeedChooseIface &&
            ($scope.ifaceData = helper.getIfaces()),
          $scope.$emit('pageload'),
          ($scope.isActivate = !0);
      }
      ($scope.isActivate = !1), util.pull().then(initCallback);
    }
    var helper,
      currentState = $state.current.name.split('.');
    currentState.pop(),
      (currentState = currentState.join('.')),
      init(),
      ($scope.add = function() {
        $state.go(currentState + '.add');
      }),
      ($scope.edit = function(item, key) {
        $state.go(currentState + '.edit', { inx: key });
      }),
      ($scope.remove = function(items, keys) {
        function success() {
          init(), snackbars.add('rpc_remove_success');
        }
        function error(response) {
          init(), snackbars.add('rpc_remove_error');
        }
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start();
        util
          .remove(items, keys)
          .then(success)
          ['catch'](error)
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }),
      ($scope.isAddDisabled = function() {
        return $scope.ddns
          ? $scope.config.MultiDdns
            ? !1
            : $scope.config.NeedChooseIface
              ? !$scope.getAvailIfaces().length
              : !!$scope.ddns.length
          : !0;
      }),
      ($scope.getAvailIfaces = function(currentIface) {
        return helper.getAvailIfaces(currentIface);
      }),
      ($scope.isEmptyRules = function() {
        return $scope.ddns && void 0 == $scope.ddns.length;
      }),
      ($scope.getHostname = function(item) {
        if (_.isEmpty(item.Hostname)) return '-';
        if (!_.isArray(item.Hostname)) return item.Hostname;
        var result = [];
        return (
          _.each(item.Hostname, function(host) {
            result.push(host.Name);
          }),
          result.join('<br>')
        );
      });
  },
]);
