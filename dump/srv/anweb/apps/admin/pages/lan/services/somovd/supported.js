'use strict';
!(function() {
  function lanSupported(cookie) {
    function isDefined(param) {
      return define[param];
    }
    var isAPMode = 'ap' === cookie.get('device_mode'),
      define = {
        BR2_PACKAGE_ANWEB_LAN_IPV6: !0,
        BRCM_CMS_BUILD: !('undefined' == typeof BRCM_CMS_BUILD),
        BR2_modems: !('undefined' == typeof BR2_modems),
        BR2_SUPPORT_MULTI_LAN: !('undefined' == typeof BR2_SUPPORT_MULTI_LAN),
      },
      lan = function() {
        return {
          isModem: isDefined('BR2_modems'),
          SUPPORT_MULTI_LAN: isDefined('BR2_SUPPORT_MULTI_LAN'),
          IPv4: !0,
          IPv6: isDefined('BR2_PACKAGE_ANWEB_LAN_IPV6'),
          isAPMode: isAPMode,
        };
      },
      ipv4 = function() {
        return {
          AddressingMode: isAPMode,
          AddressingModeAvailable: isAPMode
            ? ['Static', 'Dynamic']
            : ['Static'],
          StaticIP: {
            Address: !0,
            SubnetMask: !0,
            GatewayAddress: isAPMode,
            AddnHostname: !0,
          },
          DHCP: {
            Mode: !0,
            Server: {
              MinAddress: !0,
              MaxAddress: !0,
              LeaseTime: !0,
              DNSRelay: !0,
              StaticAddress: { IPAddress: !0, MACAddress: !0, Hostname: !0 },
            },
            Relay: { DHCPServerIPAddress: !0 },
          },
        };
      },
      ipv6 = function() {
        return {
          AddressingMode: !0,
          AddressingModeAvailable: isAPMode
            ? ['Static', 'Dynamic']
            : ['Static', 'PD'],
          StaticIP: { Address: !0, Prefix: !0, GatewayAddress: isAPMode },
          DHCP: {
            __base: !isAPMode,
            Mode: !0,
            Server: {
              AutoconfigurationMode: !0,
              MinAddress: !0,
              MaxAddress: !0,
              LeaseTime: !0,
              DNSRelay: !1,
              RADVD: isDefined('BRCM_CMS_BUILD'),
              StaticAddress: { IPAddress: !0, MACAddress: !0, Hostname: !0 },
            },
          },
        };
      };
    return { lan: lan, ipv4: ipv4, ipv6: ipv6 };
  }
  angular.module('app').factory('lanSupported', ['cookie', lanSupported]);
})();
