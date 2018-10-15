'use strict';
angular.module('app').controllerProvider.register('VlanListCtrl', [
  '$scope',
  '$state',
  '$q',
  'translate',
  function($scope, $state, $q, translate) {
    function checkRemoving(items, keys) {
      try {
        items.forEach(checkItemRemoving);
      } catch (msg) {
        return alert(msg), !1;
      }
      return !0;
    }
    function checkItemRemoving(item) {
      checkLastLanU(item), checkConnections(item);
    }
    function checkLastLanU(item) {
      if ('lanu' === item.Type && vlan.getTypeCount('lanu') <= 1)
        throw translate('vlan_delete_last_lanu');
    }
    function checkConnections(item) {
      function checkConnections(util, iface, errorMsg) {
        var connections = util.getIfaceConnections(iface);
        if (connections.length)
          throw translate(errorMsg) + ': ' + connections.join(', ');
      }
      var iface = item.Iface;
      iface &&
        (checkConnections(device.wan, iface, 'vlan_need_remove_conns'),
        checkConnections(device.lan, iface, 'vlan_need_remove_lans'));
    }
    var device = $scope.device,
      vlan = device.vlan;
    !(function() {
      var vlanPull = $scope.pull(),
        wanPull = $scope.promisePull(device.wan.pull),
        lanPull = $scope.promisePull(device.lan.pull);
      $q.all([vlanPull, wanPull, lanPull])['finally'](
        $scope.$emit.bind($scope, 'pageload')
      );
    })();
    var currentState = $state.current.name.split('.');
    currentState.pop(),
      (currentState = currentState.join('.')),
      ($scope.add = function() {
        $state.go(currentState + '.add');
      }),
      ($scope.edit = function(item, key) {
        $state.go(currentState + '.edit', { inx: key });
      }),
      ($scope.remove = function(items, keys) {
        checkRemoving(items, keys) &&
          confirm(translate('vlan_delete_answer')) &&
          (keys.forEach(vlan.cut), $scope.update());
      }),
      ($scope.getTableShort = function(vlan) {
        return translate(vlan.Type);
      });
  },
]);
