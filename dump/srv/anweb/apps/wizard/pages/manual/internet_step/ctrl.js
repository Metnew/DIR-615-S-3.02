'use strict';
function InternetStepController(
  $scope,
  $rootScope,
  manualProfile,
  manualStepApiDispatcher,
  dongle,
  devinfo,
  constants,
  funcs
) {
  function wanTypeIs() {
    return !!_.find(arguments, function(conn) {
      return conn == profile.$InternetStep.WANType;
    });
  }
  function availableTypes() {
    var iface = $scope.interfaceInfo[profile.$InterfaceStep.IfaceType];
    if (!iface) return [];
    var interfaceWanTypes = _.result(iface, 'wanTypes'),
      res = _.filter(connTypes, function(type) {
        return (
          type || console.log(type), interfaceWanTypes.indexOf(type.type) >= 0
        );
      });
    return res;
  }
  function isUSBModem() {
    return 'usb_modem' == profile.$InterfaceStep.IfaceType;
  }
  function onWitoutAuthChange() {
    profile.$InternetStep.WitoutAuth;
  }
  function activate() {
    $scope.internetStep.cancelWatch = $scope.$watch(
      'gDongleData.status',
      function(status) {
        !status &&
          isUSBModem() &&
          (dongle.cleanInfo(), dongle.state('wait_dongle'), $scope.prevStep());
      }
    );
  }
  function deactivate() {
    $scope.internetStep.cancelWatch();
  }
  function isDSL() {
    return 'undefined' != typeof InterfaceDSLStepController;
  }
  function isATM() {
    return isDSL() && 'ATM' == $scope.internetStep.profile.$InternetStep.Iface;
  }
  function isPTM() {
    return isDSL() && 'PTM' == $scope.internetStep.profile.$InternetStep.Iface;
  }
  function isGoodline() {
    return constants.CUSTOM_GOODLINE_21218 ? !0 : !1;
  }
  function useVLANChange() {
    profile.$Support.withoutWanU &&
      manualProfile.setVIDEnable(profile.$InternetStep.UseVLAN);
  }
  function validDns_2KOM(value) {
    var validDns = funcs.customValidation.validDNS_2KOM_21748(value);
    return value && !validDns
      ? 'not_allowed_addr'
      : $scope.internetStep.profile.$InternetStep.DNSServer1 &&
        $scope.internetStep.profile.$InternetStep.DNSServer2 &&
        validDns &&
        !funcs.customValidation.validAllDNS_2KOM_21748(
          $scope.internetStep.profile.$InternetStep.DNSServer1,
          $scope.internetStep.profile.$InternetStep.DNSServer2
        )
        ? 'not_allowed_addr'
        : null;
  }
  $scope.constants = constants;
  var profile = manualProfile.profile(),
    connTypes = [
      { type: 'dynip', name: 'dynip' },
      { type: 'statip', name: 'statip' },
      { type: 'dynipv6', name: 'dynipv6', v6: !0 },
      { type: 'statipv6', name: 'statipv6', v6: !0 },
      { type: 'pppoe', name: 'pppoe' },
      { type: 'pppoev6', name: 'pppoev6_2', v6: !0 },
      { type: 'pppoedual', name: 'pppoedual', v6: !0 },
      { type: 'dynpppoe', name: 'dynpppoe_dual' },
      { type: 'statpppoe', name: 'statpppoe_dual' },
      { type: 'dynl2tp', name: 'dynl2tp' },
      { type: 'statl2tp', name: 'statl2tp' },
      { type: 'dynpptp', name: 'dynpptp' },
      { type: 'statpptp', name: 'statpptp' },
    ],
    connTypeDesc = {
      pppoe: 'wizard_pppoe_desc',
      statip: 'wizard_statip_desc',
      dynip: 'wizard_dynip_desc',
      statipv6: 'wizard_statip_desc',
      dynipv6: 'wizard_dynip_desc',
      pppoev6: 'wizard_pppoe_desc',
      '3g': 'wizard_3g_desc',
      dynpppoe: 'wizard_pppoe_desc',
      pppoedual: 'wizard_pppoe_desc',
      statpppoe: 'wizard_statpppoe_desc',
      dynpptp: 'wizard_l2tp_pptp_desc',
      statpptp: 'wizard_l2tp_pptp_desc',
      dynl2tp: 'wizard_l2tp_pptp_desc',
      statl2tp: 'wizard_l2tp_pptp_desc',
      ipoa: 'wizard_ipoa_desc',
      pppoa: 'wizard_pppoa_desc',
    },
    originList = [
      { name: 'wanIPv6AutoConfigured', type: 'AutoConfigured' },
      { name: 'wanIPv6AutoConfiguredByDHCPv6', type: 'AutoConfiguredByDHCPv6' },
      { name: 'wanIPv6AutoConfiguredBySlaac', type: 'AutoConfiguredBySlaac' },
      {
        name: 'wanIPv6AutoConfiguredByDHCPv6PD',
        type: 'AutoConfiguredByDHCPv6PD',
      },
    ];
  manualStepApiDispatcher.get().registerStepApi({
    name: 'InternetStep',
    onActivate: activate,
    onLeave: deactivate,
  }),
    ($scope.internetStep = {
      availableTypes: availableTypes,
      connTypeDesc: connTypeDesc,
      originList: originList,
      wanTypeIs: wanTypeIs,
      isUSBModem: isUSBModem,
      onWitoutAuthChange: onWitoutAuthChange,
      profile: profile,
      dongle: dongle,
      modemFields: !0,
      isDSL: isDSL,
      isATM: isATM,
      isPTM: isPTM,
      isGoodline: isGoodline,
      useVLANChange: useVLANChange,
      validDns_2KOM: validDns_2KOM,
    });
}
angular
  .module('wizard')
  .controller('InternetStepController', InternetStepController),
  (InternetStepController.$inject = [
    '$scope',
    '$rootScope',
    'manualProfile',
    'manualStepApiDispatcher',
    'dongle',
    'devinfo',
    'wizardConstants',
    'funcs',
  ]);
