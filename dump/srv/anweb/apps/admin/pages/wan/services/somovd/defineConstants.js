'use strict';
!(function() {
  angular.module('app').service('wanDefineConstants', [
    'device',
    function(device) {
      var constants = {
        BR2_PACKAGE_ANWEB_SUPPORT_RIP: !0,
        BRCM_CMS_BUILD: !('undefined' == typeof BRCM_CMS_BUILD),
        BR2_modems: !('undefined' == typeof BR2_modems),
        DVG_N5402SP1S: !('undefined' == typeof DVG_N5402SP1S),
        DVG_N5402SP2S1U: !('undefined' == typeof DVG_N5402SP2S1U),
        BR2_PACKAGE_ANWEB_WAN_IPOA: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_IPOA
        ),
        BR2_PACKAGE_ANWEB_IPV6: !0,
        BR2_PACKAGE_ANWEB_WAN_PPPOE: !0,
        BR2_PACKAGE_ANWEB_PPPOE_IGMP_TRUE: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_PPPOE_IGMP_TRUE
        ),
        BR2_PACKAGE_ANWEB_WAN_PPPOA: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_PPPOA
        ),
        BR2_PACKAGE_ANWEB_WAN_PPTP: !0,
        BR2_PACKAGE_ANWEB_WAN_L2TP: !0,
        BR2_PACKAGE_ANWEB_WAN_3G: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_3G
        ),
        BR2_PACKAGE_ANWEB_WAN_LTE: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_LTE
        ),
        BR2_PACKAGE_ANWEB_WAN_PPPOE_IPV6: !0,
        BR2_PACKAGE_ANWEB_WAN_PPPOE_DUAL: !0,
        BR2_PACKAGE_ANWEB_WAN_BRIDGE: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_BRIDGE
        ),
        BR2_PACKAGE_ANWEB_WAN_IPOEDUAL: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_IPOEDUAL
        ),
        BR2_PACKAGE_ANWEB_WAN_VLAN_SECTION: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_VLAN_SECTION
        ),
        BR2_PACKAGE_ANWEB_WAN_SIMPLE_MODE: !0,
        BR2_PACKAGE_ANWEB_WAN_AUTH_802_1X: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_AUTH_802_1X
        ),
        BR2_PACKAGE_ANWEB_MLD: !('undefined' == typeof BR2_PACKAGE_ANWEB_MLD),
        BR2_SUPPORT_HEALTH_CHECK_LTE: !(
          'undefined' == typeof BR2_SUPPORT_HEALTH_CHECK_LTE
        ),
        BR2_PACKAGE_ANWEB_WAN_PING_FOR_ALL: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_PING_FOR_ALL
        ),
        SUPPORT_DYNIP_DEFAULT_VENDER_ID: !0,
        CUSTOM_2KOM_21535: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_CUSTOM_2KOM_21535
        ),
        BR2_PACKAGE_ANWEB_WAN_AUTH_KABINET: !(
          'undefined' == typeof BR2_PACKAGE_ANWEB_WAN_AUTH_KABINET
        ),
      };
      return (
        (constants.DYNIP_DEFAULT_VENDER_ID = 'dslforum.org'),
        device.wan.defineConstants(constants),
        {}
      );
    },
  ]);
})();
