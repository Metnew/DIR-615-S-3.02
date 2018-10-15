'use strict';
!(function() {
  function WanDynIPv6oeCtrl($scope, $state, $stateParams, helper) {
    function init() {
      var connections = ipv6oe.select({ MediaType: connection.MediaType });
      if (connections && connections.length) {
        var conn = connections[0];
        conn.DNSServer1 && (dynipv6.data.DNSServer1 = conn.DNSServer1),
          conn.DNSServer2 && (dynipv6.data.DNSServer2 = conn.DNSServer2);
      }
    }
    function validation(value, param) {
      var errors = ipv6oe.validation($scope.dynipv6.data);
      return errors[param] && errors[param].length ? errors[param][0] : null;
    }
    var device = $scope.device,
      supported = device.wan.supported(),
      ipv6oe = device.wan.ipv6oe,
      connection = $scope.wan.model.connection,
      action = $scope.wan.action,
      type = $stateParams.type,
      actualType = helper.connection.identifyActualType(connection, type);
    ($scope.dynipv6 = {
      type: type,
      data: connection,
      supported: supported.connection[actualType](),
      validation: validation,
      isDefined: device.wan.isDefined,
    }),
      ($scope.dynipv6.select = {
        Origin: [
          { name: 'wanIPv6AutoConfigured', value: 'AutoConfigured' },
          {
            name: 'wanIPv6AutoConfiguredByDHCPv6',
            value: 'AutoConfiguredByDHCPv6',
          },
          {
            name: 'wanIPv6AutoConfiguredBySlaac',
            value: 'AutoConfiguredBySlaac',
          },
          {
            name: 'wanIPv6AutoConfiguredByDHCPv6PD',
            value: 'AutoConfiguredByDHCPv6PD',
          },
        ],
      });
    var dynipv6 = $scope.dynipv6;
    action && 'add' == action && init();
  }
  angular
    .module('app')
    .controller('WanDynIPv6oeCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'wanHelper',
      WanDynIPv6oeCtrl,
    ]);
})();
