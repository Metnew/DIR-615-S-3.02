'use strict';
!(function() {
  function WanStatIPv4oeCtrl($scope, $state, $stateParams, helper, funcs) {
    function init() {
      var connections = ipv4oe.select({ MediaType: connection.MediaType });
      if (connections && connections.length) {
        var conn = connections[0];
        conn.StaticIPAddress0 &&
          (statip.data.StaticIPAddress0 = conn.StaticIPAddress0),
          conn.StaticIPSubnetMask0 &&
            (statip.data.StaticIPSubnetMask0 = conn.StaticIPSubnetMask0),
          conn.GatewayIPAddress &&
            (statip.data.GatewayIPAddress = conn.GatewayIPAddress),
          conn.DNSServer1 && (statip.data.DNSServer1 = conn.DNSServer1),
          conn.DNSServer2 && (statip.data.DNSServer2 = conn.DNSServer2);
      }
    }
    var device = $scope.device,
      supported = device.wan.supported(),
      ipv4oe = ($scope.device.funcs, device.wan.ipv4oe),
      connection = $scope.wan.model.connection,
      action = $scope.wan.action,
      type = $stateParams.type,
      actualType = helper.connection.identifyActualType(connection, type);
    $scope.statip = {
      init: init,
      type: type,
      data: connection,
      supported: supported.connection[actualType](),
      isDefined: device.wan.isDefined,
    };
    var statip = $scope.statip;
    action && 'add' == action && init();
  }
  angular
    .module('app')
    .controller('WanStatIPv4oeCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'wanHelper',
      'funcs',
      WanStatIPv4oeCtrl,
    ]);
})();
