'use strict';
!(function() {
  angular.module('app').constant('summaryConstants', {
    PHONE: 'undefined' != typeof BR2_PACKAGE_ANWEB_SUMMARY_PHONE,
    CUSTOM_AIRTEL_20896:
      'undefined' != typeof BR2_PACKAGE_ANWEB_CUSTOM_AIRTEL_20896,
    CUSTOM_GOODLINE_21218:
      'undefined' != typeof BR2_PACKAGE_ANWEB_CUSTOM_GOODLINE_21218,
    CUSTOM_PLANETA_21337:
      'undefined' != typeof BR2_PACKAGE_ANWEB_CUSTOM_PLANETA_21337,
    LAYZER: 'undefined' != typeof BR2_PACKAGE_ANWEB_LAYZER_APP,
    YANDEX_DNS_SUPPORT: !0,
    DONGLE_SUPPORT: 'undefined' != typeof BR2_PACKAGE_ANWEB_USB_MODEM,
    STORAGE_SUPPORT: 'undefined' != typeof BR2_PACKAGE_ANWEB_STORAGE,
    PRINTSERVER_SUPPORT: 'undefined' != typeof BR2_PACKAGE_ANWEB_PRINTSERVER,
    VOIP_SUPPORT: 'undefined' != typeof BR2_PACKAGE_ANWEB_SUPPORT_VOIP,
    DAP_MODE_SUPPORT: !0,
    ROUTE_MODE_SUPPORT: !0,
    GPON_SUPPORT: 'undefined' != typeof BR2_GPON,
    PRINTSERVER_SUPPORT: 'undefined' != typeof BR2_PACKAGE_ANWEB_PRINTSERVER,
    LEDS_DISABLE_SUPPORT: 'undefined' != typeof BR2_SUPPORT_LEDS_DISABLE,
    RENAME_USB_TO_LTE:
      'undefined' != typeof BR2_PACKAGE_ANWEB_RENAME_USB_TO_LTE,
    GPON_STATUS_RPC: 227,
    DSL_STATUS: 'undefined' != typeof BR2_modems,
    DSL_RPC: 24,
    CPU_AND_RAM: 233,
    DONGLE_RPC: 134,
    STORAGE_RPC: 82,
    PRINTSERVER_RPC: 101,
    PORTS_RPC: 175,
    DEVICE_MODE_RPC: 112,
  });
})();
