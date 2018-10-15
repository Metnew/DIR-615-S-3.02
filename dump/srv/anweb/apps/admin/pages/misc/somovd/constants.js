'use strict';
!(function() {
  angular.module('app').constant('miscConstants', {
    IGMP: !0,
    NET_FILTER: !0,
    PPPOE_PASS_THROUGH: !0,
    PPPOE_PASS_THROUGH_OVER_IFACE:
      'undefined' != typeof BR2_PPPOE_PASSTHROUGHT_OVER_IFACE,
    SUPPORT_RLX_QOS: !0,
    SUPPORT_RLX_IPTV_QOS: !0,
    SUPPORT_RLX_HTTP_TELNET_QOS: !0,
    SUPPORT_RLX_DHCP_LCP_ECHO_QOS: !0,
    CONFIG_ID_IGMP: 68,
    CONFIG_ID_NETFILTER: 183,
    CONFIG_ID_PPPOE_PASS_THROUGH: 188,
    CONFIG_ID_WAN_IFACES_LIST: 120,
    CONFIG_ID_RLX_IPTV_QOS: 240,
    CONFIG_ID_MLD: 257,
    MLD: 'undefined' != typeof BR2_PACKAGE_ANWEB_MLD,
  });
})();
