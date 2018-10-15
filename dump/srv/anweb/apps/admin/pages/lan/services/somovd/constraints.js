'use strict';
!(function() {
  function lanConstraints() {
    function isDefined(param) {
      return define[param];
    }
    var define = {
        RLX: !('undefined' == typeof RLX),
        RLX_MODEM: !('undefined' == typeof RLX_MODEM),
      },
      rules = {
        constants: { REBOOT_TIME: '90000' },
        ipv4: function() {
          return {
            MinHosts: 4,
            MinHostsDhcpOff: 2,
            MaxHosts:
              isDefined('RLX') || isDefined('RLX_MODEM') ? 254 : 16777214,
            addressingModes: [
              { name: 'lanIPv6AddressingModeStatic', value: 'Static' },
              { name: 'lanIPv6AddressingModeDynamic', value: 'Dynamic' },
            ],
            dhcp: {
              modes: [
                { name: 'lanDHCPModeDisable', value: 'Disable' },
                { name: 'lanDHCPCaption', value: 'Server' },
                { name: 'lanDHCPRelay', value: 'Relay' },
              ],
            },
          };
        },
        ipv6: function() {
          return {
            MinPrefix: 64,
            MaxPrefix: 128,
            addressingModes: [
              { name: 'lanIPv6AddressingModeStatic', value: 'Static' },
              { name: 'lanIPv6AddressingModeDynamic', value: 'Dynamic' },
              { name: 'lanIPv6AddressingModePD', value: 'PD' },
            ],
            dhcp: {
              modes: [
                { name: 'lanDHCPModeDisable', value: 'Disable' },
                { name: 'lanDHCPModeServer', value: 'Server' },
              ],
              autoconfigurationModes: [
                { name: 'lanDHCPModeDisable', value: 'Disable' },
                {
                  name: 'lanDHCPv6AutoconfigurationModeStatefull',
                  value: 'Statefull',
                },
                {
                  name: 'lanDHCPv6AutoconfigurationModeStateless',
                  value: 'Stateless',
                },
              ],
            },
          };
        },
      };
    return rules;
  }
  angular.module('app').factory('lanConstraints', [lanConstraints]);
})();
