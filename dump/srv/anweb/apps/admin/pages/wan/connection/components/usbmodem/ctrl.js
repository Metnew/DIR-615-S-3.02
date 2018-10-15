'use strict';
!(function() {
  function WanUsbModemCtrl(
    $scope,
    $state,
    $stateParams,
    translate,
    device,
    helper
  ) {
    function isRequired(param) {
      var data = $scope.usbmodem.data;
      switch (param) {
        case 'Login':
        case 'Password':
          return !data.WithoutAuth;
      }
    }
    function isDisabled(param) {
      var data = $scope.usbmodem.data;
      switch (param) {
        case 'Login':
        case 'Password':
        case 'AuthenticationProtocol':
          return !!data.WithoutAuth;
      }
      return !1;
    }
    function isShow(param) {
      switch (param) {
        case 'WithoutAuth':
        case 'Login':
        case 'Password':
        case 'AuthenticationProtocol':
          if ('lte' != type) return !1;
      }
      return $scope.usbmodem.supported[param] ? !0 : !1;
    }
    var supported = device.wan.supported(),
      connection = $scope.wan.model.connection,
      type = $stateParams.type,
      actualType = helper.connection.identifyActualType(connection, type);
    ($scope.usbmodem = {
      type: type,
      data: connection,
      dongle: connection.Media.Dongle,
      supported: supported.connection[actualType](),
      isShow: isShow,
      isDisabled: isDisabled,
      isRequired: isRequired,
    }),
      ($scope.usbmodem.select = {
        Mode: {
          '3G': [
            { name: 'Auto', value: 'Auto' },
            { name: '3G', value: '3G' },
            { name: '2G', value: '2G' },
          ],
          LTE: [
            { name: 'Auto', value: 'Auto' },
            { name: '4G', value: '4G' },
            { name: '3G', value: '3G' },
            { name: '2G', value: '2G' },
          ],
        },
        AuthenticationProtocol: [
          { name: 'PAP', value: 'pap' },
          { name: 'CHAP', value: 'chap' },
        ],
      });
  }
  angular
    .module('app')
    .controller('WanUsbModemCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'translate',
      'device',
      'wanHelper',
      WanUsbModemCtrl,
    ]);
})();
