'use strict';
!(function() {
  var manualModes = {};
  (manualModes.Router = {
    IfaceType: ['ethernet', 'etherwan', 'adsl', 'vdsl'],
    DeviceMode: 'router',
    Note: 'mod_router',
    Disabled: {},
    Defaults: { Enable: !0, EnableBroadcast: !0 },
  }),
    (manualModes.WISPRepeater = {
      IfaceType: ['wifi_client'],
      DeviceMode: 'router',
      Note: 'mod_wisp_repeater',
      Disabled: { Wireless: !0, Backup: !0 },
      Defaults: { Enable: !0, EnableBroadcast: !0 },
    }),
    (manualModes.AP = {
      IfaceType: ['ethernet'],
      DeviceMode: 'ap',
      Note: 'mod_access_point',
      Disabled: { BroadcastWireless: !0 },
      Defaults: { Enable: !0, EnableBroadcast: !0 },
    }),
    (manualModes.Repeater = {
      IfaceType: ['wifi_client'],
      DeviceMode: 'ap',
      Note: 'mod_repeater',
      Disabled: { Wireless: !0, BroadcastWireless: !0, Backup: !0 },
      Defaults: { Enable: !0, EnableBroadcast: !0 },
    }),
    (manualModes.Client = {
      IfaceType: ['wifi_client'],
      DeviceMode: 'ap',
      Note: 'mod_client',
      Disabled: { Wireless: !0, BroadcastWireless: !0 },
      Defaults: { Enable: !0, EnableBroadcast: !1 },
    }),
    angular.module('wizard').constant('manualModes', manualModes);
})();
