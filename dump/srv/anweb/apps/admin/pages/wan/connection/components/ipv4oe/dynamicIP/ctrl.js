'use strict';
!(function() {
  function WanDynIPv4oeCtrl($scope, $state, $stateParams, device, helper) {
    function init() {
      var connections = ipv4oe.select({ MediaType: connection.MediaType });
      if (connections && connections.length) {
        var conn = connections[0];
        conn.DNSServer1 && ($scope.dynip.data.DNSServer1 = conn.DNSServer1),
          conn.DNSServer2 && ($scope.dynip.data.DNSServer2 = conn.DNSServer2);
      }
    }
    var device = $scope.device,
      supported = device.wan.supported(),
      ipv4oe = device.wan.ipv4oe,
      connection = $scope.wan.model.connection,
      action = $scope.wan.action,
      type = $stateParams.type,
      actualType = helper.connection.identifyActualType(connection, type);
    'ipoeDual' == $stateParams.type &&
      ((connection = $scope.wan.model.connection.AdditionalConnection),
      (type = 'ipv4oe'),
      (actualType = helper.connection.identifyActualType(connection, type))),
      ($scope.dynip = {
        type: type,
        data: connection,
        supported: supported.connection[actualType](),
        isDefined: device.wan.isDefined,
      }),
      action && 'add' == action && init(),
      ($scope.validateHostname = function(hostname) {
        function isHostname(hostname) {
          var re = /^([a-zA-Z0-9]{1})+([a-zA-Z0-9-])+([a-zA-Z0-9]{1})+$/;
          return re.test(hostname);
        }
        return hostname && !isHostname(hostname)
          ? 'invalid_dynip_hostname'
          : null;
      });
  }
  angular
    .module('app')
    .controller('WanDynIPv4oeCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'device',
      'wanHelper',
      WanDynIPv4oeCtrl,
    ]);
})();
