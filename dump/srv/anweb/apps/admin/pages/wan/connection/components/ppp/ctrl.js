'use strict';
!(function() {
  function WanPPPCtrl($scope, $state, $stateParams, translate, device, helper) {
    function isShow(param) {
      return !!$scope.ppp.supported[param];
    }
    function isDisabled(param) {
      var data = $scope.ppp.data;
      switch (param) {
        case 'Password':
          return data.WithoutAuth;
        case 'LCPEcho':
        case 'LCPEchoRetry':
          return !data.KeepAlive;
        case 'IdleDisconnectTime':
          return !('OnDemand' == data.ConnectionTrigger);
        case 'GatewayIPv6Address':
          return data.GatewayIPv6AddressBySlaac;
        case 'DNSIPv6Server1':
        case 'DNSIPv6Server2':
          return data.DNSIPv6Automatical;
      }
      return !1;
    }
    function isRequired(param) {
      var data = $scope.ppp.data;
      switch (param) {
        case 'Username':
        case 'Password':
          return !data.WithoutAuth;
        case 'MaxMRUSize':
          return !0;
        case 'LCPEcho':
        case 'LCPEchoRetry':
          return data.KeepAlive;
        case 'IdleDisconnectTime':
          return 'OnDemand' == data.ConnectionTrigger;
        case 'GatewayIPv6Address':
          return !data.GatewayIPv6AddressBySlaac;
        case 'DNSIPv6Server1':
          return !data.DNSIPv6Automatical;
      }
      return !1;
    }
    function isPPPv6() {
      return 'pppoev6' == type || 'pppoeDual' == type;
    }
    function onChangeUsePassword() {
      $scope.ppp.data.WithoutAuth
        ? ($scope.ppp.lastPassword = _.clone($scope.ppp.data.Password))
        : ($scope.ppp.data.Password = $scope.ppp.lastPassword);
    }
    var supported = device.wan.supported(),
      connection = $scope.wan.model.connection,
      type = $stateParams.type,
      actualType = helper.connection.identifyActualType(connection, type);
    ($scope.ppp = {
      type: type,
      data: connection,
      supported: supported.connection[actualType](),
      onChangeUsePassword: onChangeUsePassword,
      isShow: isShow,
      isDisabled: isDisabled,
      isRequired: isRequired,
      isPPPv6: isPPPv6,
    }),
      ($scope.ppp.select = {
        authProtocol: [
          { name: 'AUTO', value: 'AUTO' },
          { name: 'PAP', value: 'PAP' },
          { name: 'CHAP', value: 'CHAP' },
          { name: 'MS-CHAP', value: 'MS-CHAP' },
          { name: 'MS-CHAPv2', value: 'MS-CHAP-V2' },
        ],
        encProtocol: [
          { name: 'wanNoEncrypt', value: 'None' },
          { name: 'MPPE 40 128 bit', value: 'MPPE' },
          { name: 'MPPE 40 bit', value: 'MPPE40' },
          { name: 'MPPE 128 bit', value: 'MPPE128' },
        ],
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
      }),
      ($scope.ppp.onDemand = {
        value: 'OnDemand' == $scope.ppp.data.ConnectionTrigger,
        change: function() {
          $scope.ppp.data.ConnectionTrigger = this.value
            ? 'OnDemand'
            : 'pptp' == type
              ? 'AlwaysOn'
              : 'Manual';
        },
        isShow: function() {
          return $scope.ppp.isShow('ConnectionTrigger');
        },
      });
  }
  angular
    .module('app')
    .controller('WanPPPCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'translate',
      'device',
      'wanHelper',
      WanPPPCtrl,
    ]);
})();
