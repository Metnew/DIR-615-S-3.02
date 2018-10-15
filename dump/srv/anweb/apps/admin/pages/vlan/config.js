'use strict';
angular.module('app').constant('vlanConfig', {
  defined: {
    multilan: 'undefined' != typeof BR2_SUPPORT_MULTI_LAN,
    multiwan: 'undefined' != typeof BR2_SUPPORT_MULTI_WAN,
    sameVlanWanBridge: 'undefined' != typeof BR2_SUPPORT_SAME_VLAN_WAN_BRIDGE,
    supportVlanTrunking: 'undefined' != typeof BR2_SUPPORT_VLAN_TRUNKING,
    bridgeAllPorts:
      'undefined' != typeof BR2_ralink ||
      'undefined' != typeof BR2_SUPPORT_TAGGED_LAN_PORTS_BRIDGE,
    qosSupport: !1 || 'undefined' != typeof BR2_SUPPORT_RLX_819X_VLAN_REMARKING,
    bcm47xx: 'undefined' != typeof BR2_bcm47xx,
    vlanIDMin: 1,
  },
});
