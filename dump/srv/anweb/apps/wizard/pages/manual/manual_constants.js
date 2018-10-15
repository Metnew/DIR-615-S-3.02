'use strict';
!(function() {
  angular.module('wizard').constant('manualConstants', {
    WIFI_GUEST_ACCESS_WARHING: 'undefined' != typeof BR2_ralink && !1,
    SAME_VLAN_WAN_BRIDGE:
      'undefined' != typeof BR2_SUPPORT_SAME_VLAN_WAN_BRIDGE,
    DSL_SEPARATED_WAN_PORT:
      'undefined' != typeof BR2_SUPPORT_ETHERNET_SEPARATED_WAN_PORT,
    SUPPORT_ETHERWAN: 'undefined' != typeof BR2_PACKAGE_ANWEB_ETHERWAN,
    SUPPORT_WAN_AUTH_KABINET:
      'undefined' != typeof BR2_PACKAGE_ANWEB_WAN_AUTH_KABINET,
    vlanIDMin: 1,
    ifaceTypes: ['ethernet', 'wifi_client'],
  });
})();
