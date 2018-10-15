'use strict';
!(function() {
  function vserversAttributes() {
    return {
      Name: { default: '' },
      Type: { default: 'custom' },
      Proto: { default: 'TCP', enum: ['TCP', 'UDP', 'TCP/UDP'] },
      SNAT: { default: !1 },
      Source: {
        Iface: { default: '' },
        IP: { default: [''] },
        Ports: {
          '#template': { Start: { default: '' }, End: { default: '' } },
        },
      },
      Dest: {
        IP: { default: [''] },
        Ports: {
          '#template': { Start: { default: '' }, End: { default: '' } },
        },
      },
    };
  }
  angular.module('app').service('vserversAttributes', vserversAttributes);
})();
