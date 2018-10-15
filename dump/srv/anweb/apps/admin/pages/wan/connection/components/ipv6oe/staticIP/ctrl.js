'use strict';
!(function() {
  function WanStatIPv6oeCtrl($scope, $state, $stateParams, helper) {
    function init() {
      var connections = ipv6oe.select({ MediaType: connection.MediaType });
      if (connections && connections.length) {
        var conn = connections[0];
        conn.DNSServer1 && (statipv6.data.DNSServer1 = conn.DNSServer1),
          conn.DNSServer2 && (statipv6.data.DNSServer2 = conn.DNSServer2);
      }
    }
    function validation(value, param) {
      var errors = ipv6oe.validation($scope.statipv6.data);
      return errors[param] && errors[param].length ? errors[param][0] : null;
    }
    var device = $scope.device,
      supported = device.wan.supported(),
      ipv6oe = ($scope.device.funcs, device.wan.ipv6oe),
      connection = $scope.wan.model.connection,
      action = $scope.wan.action,
      type = $stateParams.type,
      actualType = helper.connection.identifyActualType(connection, type);
    $scope.statipv6 = {
      type: type,
      data: connection,
      supported: supported.connection[actualType](),
      validation: validation,
      isDefined: device.wan.isDefined,
    };
    var statipv6 = $scope.statipv6;
    action && 'add' == action && init();
  }
  angular
    .module('app')
    .controller('WanStatIPv6oeCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'wanHelper',
      WanStatIPv6oeCtrl,
    ]);
})();
