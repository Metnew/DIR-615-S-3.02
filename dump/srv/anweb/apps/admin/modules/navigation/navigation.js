'use strict';
angular.module(regdep('navigation'), []).constant('navigation', {
  summary: {
    menu: {
      name: 'navSummary',
      desc: 'navSummaryDesc',
      sref: 'summary',
      icon: 'summary',
      openPage: !0,
    },
    page: 'summary',
    url: '/summary',
    title: 'navSummary',
  },
  wizard: {
    menu: {
      name: 'navWizard',
      desc: 'navWizardDesc',
      sref: 'wizard.all',
      icon: 'dcc',
      openPage: !0,
    },
    url: '/wizards',
    title: 'navWizard',
  },
  'wizard.all': {
    hidden: !0,
    page: 'wizard',
    url: '/all',
    title: 'navWizard',
  },
  'wizard.ports': {
    hidden: !0,
    page: 'portsWizard',
    url: '/ports',
    title: 'navPortsWizard',
  },
  notice: { page: 'notice', url: '/notice', title: 'navNotifications' },
  error: { page: 'error', params: { code: null, message: null } },
  unexisting: { page: 'unexisting', url: '/unexisting/:name' },
  emul: { page: 'emul', url: '/emul', title: 'Emulator config' },
  network: {
    menu: {
      name: 'navNetwork',
      desc: 'navNetworkDesc',
      sref: 'network.wan.info',
      icon: 'connections2',
    },
    url: '/network',
    title: 'navNetwork',
  },
  'network.wan': {
    menu: { name: 'navWAN', desc: 'navWANDesc', sref: 'network.wan.info' },
    hideInAPMode: !0,
    title: 'navWAN',
    url: '/wan',
    page: 'wanCore',
  },
  'network.wan.info': {
    url: '/info',
    title: 'navWAN',
    page: {
      '': 'wanInfo',
      'connections@info': 'wanInfoConnections',
      'connections_simple@info': 'wanSimpleConnections',
      'gwif@info': 'wanInfoGwif',
      'igmp@info': 'wanInfoIgmp',
    },
  },
  'network.wan.connection': {
    url: '/connection',
    title: 'wanConnection',
    page: 'wanConnection',
  },
  'network.wan.connection.add': {
    page: {
      '': 'wanAdd',
      'header@add': 'wanHeader',
      'content@add': 'wanContent',
    },
    url: '/add',
    title: 'wanCreating',
  },
  'network.wan.connection.add.ipoeDual': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      addition: 'wanDynIPv4oE',
      connection: 'wanDynIPv6oE',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.dynip': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanDynIPv4oE',
      auth8012x: 'wanAuth8012x',
      kabinet: 'wanAuthKabinet',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.statip': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanStatIPv4oE',
      auth8012x: 'wanAuth8012x',
      kabinet: 'wanAuthKabinet',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.ipv4oa': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanStatIPv4oE',
      flags: 'wanFlags',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.dynipv6': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanDynIPv6oE',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.statipv6': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanStatIPv6oE',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.ppp': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanPPP',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.lte': {
    page: {
      general: 'wanGeneral',
      media: 'wanUsbModem',
      connection: 'wanDynIPv4oE',
      health_check: 'wanHealthCheck',
      flags: 'wanFlags',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.3g': {
    page: {
      general: 'wanGeneral',
      media: 'wanUsbModem',
      connection: 'wanPPP',
      flags: 'wanFlags',
    },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.add.bridge': {
    page: { general: 'wanGeneral', media: 'wanMedia', vlan: 'wanVlan' },
    params: { type: null, actualType: null },
  },
  'network.wan.connection.edit': {
    page: {
      '': 'wanEdit',
      'header@edit': 'wanHeader',
      'content@edit': 'wanContent',
    },
    url: '/edit?type&inx',
    title: 'wanEditing',
  },
  'network.wan.connection.edit.dynip': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanDynIPv4oE',
      auth8012x: 'wanAuth8012x',
      kabinet: 'wanAuthKabinet',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
  },
  'network.wan.connection.edit.statip': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanStatIPv4oE',
      auth8012x: 'wanAuth8012x',
      kabinet: 'wanAuthKabinet',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
  },
  'network.wan.connection.edit.ipv4oa': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanStatIPv4oE',
      flags: 'wanFlags',
    },
  },
  'network.wan.connection.edit.dynipv6': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanDynIPv6oE',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
  },
  'network.wan.connection.edit.statipv6': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanStatIPv6oE',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
  },
  'network.wan.connection.edit.ppp': {
    page: {
      general: 'wanGeneral',
      media: 'wanMedia',
      connection: 'wanPPP',
      flags: 'wanFlags',
      vlan: 'wanVlan',
    },
  },
  'network.wan.connection.edit.lte': {
    page: {
      general: 'wanGeneral',
      media: 'wanUsbModem',
      connection: 'wanDynIPv4oE',
      health_check: 'wanHealthCheck',
      flags: 'wanFlags',
    },
  },
  'network.wan.connection.edit.3g': {
    page: {
      general: 'wanGeneral',
      media: 'wanUsbModem',
      connection: 'wanPPP',
      flags: 'wanFlags',
    },
  },
  'network.wan.connection.edit.bridge': {
    page: { general: 'wanGeneral', media: 'wanMedia', vlan: 'wanVlan' },
  },
  'network.lan': {
    menu: { name: 'navLAN', desc: 'navLANDesc', sref: 'network.lan' },
    title: 'navLAN',
    url: '/lan?ipversion',
    page: 'lan',
  },
  'network.lanInterface': { hidden: !0, url: '/lanInterface' },
  'network.lanInterface.add': {
    page: 'lanInterface',
    url: '/add?inx&ipversion',
    title: 'navLANAdd',
  },
  'network.lanInterface.edit': {
    page: 'lanInterface',
    url: '/edit?inx&ipversion',
    title: 'navLANEdit',
  },
  'network.wanreserv': {
    menu: {
      name: 'navNetworkWANReserv',
      desc: 'navNetworkWANReserv',
      sref: 'network.wanreserv',
    },
    hideInAPMode: !0,
    page: 'wanReserv',
    url: '/wanreserv',
    title: 'navNetworkWANReserv',
  },
  'network.qos_sw': {
    menu: {
      name: 'navNetworkQosSw',
      desc: 'navNetworkQosSwDesc',
      sref: 'network.qos_sw.info',
    },
    hideInAPMode: !0,
    title: 'navNetworkQosSw',
    url: '/qos_sw',
  },
  'network.qos_sw.info': {
    url: '/info',
    title: 'navNetworkQosSw',
    page: 'qosSwInfo',
  },
  'network.qos_sw.add': {
    url: '/add',
    title: 'navNetworkQosSwAdd',
    page: 'qosSwRule',
  },
  'network.qos_sw.edit': {
    url: '/edit?type&id',
    title: 'navNetworkQosSwEdit',
    page: 'qosSwRule',
  },
  'network.qos_hw': {
    menu: {
      name: 'navNetworkQosHw',
      desc: 'navNetworkQosHwDesc',
      sref: 'network.qos_hw.config',
    },
    hideInAPMode: !0,
    title: 'navNetworkQosHw',
    url: '/qos_hw?tab',
  },
  'network.qos_hw.config': {
    url: '/common',
    title: 'navNetworkQosHw',
    page: 'qosHwConfig',
  },
  'network.qos_hw.add_classifications': {
    url: '/add',
    title: 'navNetworkQosHwAdd',
    page: 'qosHwClassifications',
  },
  'network.qos_hw.edit_classifications': {
    url: '/edit?id',
    title: 'navNetworkQosHwEdit',
    page: 'qosHwClassifications',
  },
  wifi: {
    menu: {
      name: 'navWiFi',
      desc: 'navWiFiDesc',
      sref: 'wifi.common',
      icon: 'wifi',
    },
    title: 'navWiFi',
    url: '/wifi',
  },
  'wifi.common': {
    menu: {
      name: 'navWIFICommon',
      desc: 'navWIFICommonDesc',
      sref: 'wifi.common',
      info: 'nw-menu-wifi',
    },
    page: 'wifiCommon',
    title: 'navWIFICommon',
    url: '/common?freq',
  },
  'wifi.ap': { hidden: !0, url: '/ap' },
  'wifi.ap.add': { page: 'wifiAP', url: '/add?freq', title: 'navWIFIAddAP' },
  'wifi.ap.edit': {
    page: 'wifiAP',
    url: '/edit?freq&inx',
    title: 'navWIFIEditAP',
  },
  'wifi.clientmgm': {
    menu: {
      name: 'navWIFIClientmgm',
      desc: 'navWIFIClientmgmDesc',
      sref: 'wifi.clientmgm',
    },
    page: 'wifiClientMgm',
    title: 'navWIFIClientmgm',
    url: '/clientmgm',
  },
  'wifi.wps': {
    menu: { name: 'navWIFIWPS', desc: 'navWIFIWPSDesc', sref: 'wifi.wps' },
    title: 'navWIFIWPS',
    page: 'wifiWps',
    url: '/wps?freq',
  },
  'wifi.wds': {
    menu: { name: 'navWIFIWDS', desc: 'navWIFIWDSDesc', sref: 'wifi.wds' },
    hideInRouterMode: !0,
    title: 'navWIFIWDS',
    page: 'wifiWds',
    url: '/wds',
  },
  'wifi.wmm': {
    menu: { name: 'navWIFIWMM', desc: 'navWIFIWMMDesc', sref: 'wifi.wmm' },
    title: 'navWIFIWMM',
    page: 'wifiWMM',
    url: '/wmm',
  },
  'wifi.client': {
    menu: {
      name: 'navWIFIClient',
      desc: 'navWIFIClientDesc',
      sref: 'wifi.client',
    },
    title: 'navWIFIClient',
    page: { '': 'wifiClient', 'table@client': 'wifiClientTable' },
    url: '/client?freq',
  },
  'wifi.clientshaping': {
    menu: {
      name: 'navWIFIClientShaping',
      desc: 'navWIFIClientShapingDesc',
      sref: 'wifi.clientshaping',
    },
    page: 'wifiClientShaping',
    title: 'navWIFIClientShaping',
    url: '/clientshaping',
  },
  'wifi.adv': {
    menu: { name: 'navWIFIAdv', desc: 'navWIFIAdvDesc', sref: 'wifi.adv' },
    page: 'wifiAdv',
    title: 'navWIFIAdv',
    url: '/adv?freq',
  },
  'wifi.mac': {
    menu: { name: 'navWIFIMac', desc: 'navWIFIMacDesc', sref: 'wifi.mac' },
    page: 'wifiMac',
    title: 'navWIFIMac',
    url: '/mac',
  },
  printserver: {
    menu: {
      name: 'navPrintserver',
      desc: 'navPrintserverDesc',
      sref: 'printserver',
      openPage: !0,
      icon: 'print',
    },
    hideInAPMode: !0,
    page: 'printserver',
    title: 'navPrintserver',
    url: '/printserver',
  },
  'wifi.roaming': {
    menu: {
      name: 'navWIFIRoaming',
      desc: 'navWIFIRoamingDesc',
      sref: 'wifi.roaming',
    },
    page: 'wifiRoaming',
    title: 'navWIFIRoaming',
    url: '/roaming',
  },
  storage: {
    menu: {
      name: 'navStorage',
      desc: 'navStorageDesc',
      sref: 'storage.info',
      icon: 'usb',
    },
    hideInAPMode: !0,
    title: 'navStorage',
    url: '/storage',
  },
  'storage.info': {
    menu: {
      name: 'navStorageInfo',
      desc: 'navStorageInfoDesc',
      sref: 'storage.info',
    },
    page: 'storageInfo',
    title: 'navStorageInfo',
    url: '/info',
  },
  'storage.users': {
    menu: {
      name: 'navStorageUsers',
      desc: 'navStorageUsersDesc',
      sref: 'storage.users',
    },
    page: 'storageUsers',
    title: 'navStorageUsers',
    url: '/users',
  },
  'storage.samba': {
    menu: {
      name: 'navStorageSamba',
      desc: 'navStorageSambaDesc',
      sref: 'storage.samba',
    },
    page: 'storageSamba',
    title: 'navStorageSamba',
    url: '/samba',
  },
  'storage.ftp': {
    menu: {
      name: 'navStorageFtp',
      desc: 'navStorageFtpDesc',
      sref: 'storage.ftp',
    },
    page: 'storageFtp',
    title: 'navStorageFtp',
    url: '/ftp',
  },
  'storage.filebrowser': {
    menu: {
      name: 'navStorageFilebrowser',
      desc: 'navStorageFilebrowserDesc',
      sref: 'storage.filebrowser',
    },
    page: 'storageFilebrowser',
    title: 'navStorageFilebrowser',
    url: '/filebrowser',
  },
  'storage.dlna': {
    menu: {
      name: 'navStorageDlna',
      desc: 'navStorageDlnaDesc',
      sref: 'storage.dlna',
    },
    page: 'storageDlna',
    title: 'navStorageDlna',
    url: '/dlna',
  },
  'storage.torrent': {
    menu: {
      name: 'navStorageTorrent',
      desc: 'navStorageTorrentDesc',
      sref: 'storage.torrent',
    },
    page: 'storageTorrent',
    title: 'navStorageTorrent',
    url: '/torrent',
  },
  'storage.xupnpd': {
    menu: {
      name: 'navXupnpd',
      desc: 'navXupnpdDesc',
      sref: 'storage.xupnpd',
    },
    page: 'xupnpd',
    title: 'navXupnpd',
    url: '/xupnpd',
  },
  voip: {
    menu: {
      name: 'navVoip',
      desc: 'navVoipDesc',
      sref: 'voip.basic',
      icon: 'voip',
    },
    title: 'navVoip',
    url: '/voip',
  },
  'voip.basic': {
    menu: {
      name: 'navVoipBasic',
      desc: 'navVoipBasicDesc',
      sref: 'voip.basic',
    },
    page: 'voipBasic',
    title: 'navVoipBasicTitle',
    url: '/basic',
  },
  'voip.advanced': {
    menu: {
      name: 'navVoipAdvanced',
      desc: 'navVoipAdvancedDesc',
      sref: 'voip.advanced',
    },
    page: 'voipAdvanced',
    title: 'navVoipAdvancedTitle',
    url: '/advanced',
  },
  'voip.lines': {
    menu: {
      name: 'navVoipLines',
      desc: 'navVoipLinesDesc',
      sref: 'voip.lines',
    },
    page: 'voipLines',
    title: 'navVoipLines',
    url: '/lines?line',
  },
  'voip.fax': {
    menu: { name: 'navVoipFax', desc: 'navVoipFaxDesc', sref: 'voip.fax' },
    page: 'voipFax',
    title: 'navVoipFax',
    url: '/fax',
  },
  'voip.audio': {
    menu: {
      name: 'navVoipAudio',
      desc: 'navVoipAudioDesc',
      sref: 'voip.audio',
    },
    page: 'voipAudio',
    title: 'navVoipAudio',
    url: '/audio?line',
  },
  'voip.phonebook': {
    menu: {
      name: 'navVoipPhonebook',
      desc: 'navVoipPhonebookDesc',
      sref: 'voip.phonebook',
    },
    page: 'voipPhonebook',
    title: 'navVoipPhonebook',
    url: '/phonebook?line',
  },
  'voip.button_map': {
    menu: {
      name: 'navVoipButtonMap',
      desc: 'navVoipButtonMapDesc',
      sref: 'voip.button_map',
    },
    page: 'voipButtonMap',
    title: 'navVoipButtonMap',
    url: '/button_map',
  },
  'voip.voice_record': {
    menu: {
      name: 'navVoiceRecord',
      desc: 'navVoiceRecordDesc',
      sref: 'voip.voice_record',
    },
    page: 'voipVoiceRecord',
    title: 'navVoiceRecord',
    url: '/voice_record',
  },
  'voip.text_mess': {
    menu: {
      name: 'navVoipTextMess',
      desc: 'navVoipTextMessDesc',
      sref: 'voip.text_mess',
    },
    page: 'voipTextMess',
    title: 'navVoipTextMess',
    url: '/text_mess',
  },
  'voip.security': {
    menu: {
      name: 'navVoipSecurity',
      desc: 'navVoipSecurityDesc',
      sref: 'voip.security',
    },
    page: 'voipSecurity',
    title: 'navVoipSecurityTitle',
    url: '/security',
  },
  'voip.alarm': {
    menu: {
      name: 'navVoipAlarm',
      desc: 'navVoipAlarmDesc',
      sref: 'voip.alarm',
    },
    page: 'voipAlarm',
    title: 'navVoipAlarm',
    url: '/alarm',
  },
  advanced: {
    menu: {
      name: 'navAdvanced',
      desc: 'navAdvancedDesc',
      sref: 'advanced.vlan.list',
      icon: 'connections',
    },
    title: 'navAdvanced',
    url: '/advanced',
  },
  'advanced.vlan': {
    menu: {
      name: 'navAdvancedVLAN',
      desc: 'navAdvancedVLANDesc',
      sref: 'advanced.vlan.list',
    },
    hideInAPMode: !0,
    title: 'navVLAN',
    url: '/vlan',
    page: 'vlan',
  },
  'advanced.vlan.list': {
    page: 'vlanList',
    url: '/list',
    title: 'navAdvancedVLAN',
  },
  'advanced.vlan.add': {
    page: 'vlanForm',
    url: '/add',
    title: 'navAdvancedAddVLAN',
  },
  'advanced.vlan.edit': {
    page: 'vlanForm',
    url: '/edit?inx',
    title: 'navAdvancedEditVLAN',
  },
  'advanced.ifgroups': {
    menu: {
      name: 'navIfGrouping',
      desc: 'navIfGroupingDesc',
      sref: 'advanced.ifgroups.list',
    },
    hideInAPMode: !0,
    title: 'navIfGrouping',
    url: '/ifgroups',
  },
  'advanced.ifgroups.list': {
    page: 'ifgroupsList',
    url: '/list',
    title: 'navIfGrouping',
  },
  'advanced.ifgroups.add': {
    page: 'ifgroupsEdit',
    url: '/add',
    title: 'navIfGroupingAdd',
  },
  'advanced.ifgroups.edit': {
    page: 'ifgroupsEdit',
    url: '/edit?key',
    title: 'navIfGroupingEdit',
  },
  'advanced.mvr': {
    menu: {
      name: 'navAdvancedMVR',
      desc: 'navAdvancedMVRDesc',
      sref: 'advanced.mvr',
    },
    page: 'mvr',
    title: 'navAdvancedMVR',
    url: '/mvr',
  },
  'advanced.pon': {
    menu: {
      name: 'navAdvancedPON',
      desc: 'navAdvancedPONDesc',
      sref: 'advanced.pon',
    },
    page: 'pon',
    title: 'navAdvancedPON',
    url: '/pon',
  },
  'advanced.etherwan': {
    menu: {
      name: 'navRemappingWan',
      desc: 'navAdvancedEtherwanDesc',
      sref: 'advanced.etherwan',
    },
    hideInAPMode: !0,
    page: 'etherwan',
    title: 'navRemappingWan',
    url: '/wanRemapping',
  },
  'advanced.snmp': {
    menu: { name: 'navSnmp', desc: 'navSnmpDesc', sref: 'advanced.snmp' },
    page: 'snmp',
    title: 'navSnmp',
    url: '/snmp',
  },
  'advanced.dns': {
    menu: {
      name: 'navAdvancedDNS',
      desc: 'navAdvancedDNSDesc',
      sref: 'advanced.dns',
    },
    page: 'dns',
    title: 'navAdvancedDNS',
    url: '/dns',
  },
  'advanced.ddns': {
    menu: {
      name: 'navAdvancedDDNS',
      desc: 'navAdvancedDDNSDesc',
      sref: 'advanced.ddns.info',
    },
    hideInAPMode: !0,
    title: 'navAdvancedDDNS',
    url: '/ddns',
  },
  'advanced.ddns.info': {
    url: '/info',
    title: 'navAdvancedDDNS',
    page: 'ddnsInfo',
  },
  'advanced.ddns.add': { url: '/add', title: 'ddns_add', page: 'ddnsRule' },
  'advanced.ddns.edit': {
    url: '/edit?inx',
    title: 'ddns_edit',
    page: 'ddnsRule',
  },
  'advanced.nsg': {
    menu: { name: 'navNSG', desc: 'navNSGDesc', sref: 'advanced.nsg' },
    page: 'nsg',
    title: 'navNSG',
    url: '/nsg',
  },
  'advanced.ports': {
    menu: {
      name: 'navAdvancedPorts',
      desc: 'navAdvancedPortsDesc',
      sref: 'advanced.ports',
    },
    page: 'ports',
    title: 'navAdvancedPorts',
    url: '/ports',
  },
  'advanced.bandwidth': {
    menu: {
      name: 'navBandwidthControl',
      desc: 'navBandwidthControlDesc',
      sref: 'advanced.bandwidth',
    },
    page: 'bandwidth_control',
    title: 'navBandwidthControl',
    url: '/bandwidth_control',
  },
  'advanced.port_segmentation': {
    menu: {
      name: 'navPortSegmentation',
      desc: 'navPortSegmentationDesc',
      sref: 'advanced.port_segmentation',
    },
    page: 'port_segmentation',
    title: 'navPortSegmentation',
    url: '/port_segmentation',
  },
  'advanced.redirect': {
    menu: {
      name: 'navAdvancedRedirect',
      desc: 'navAdvancedRedirectDesc',
      sref: 'advanced.redirect',
    },
    hideInAPMode: !0,
    page: 'redirect',
    title: 'navAdvancedRedirect',
    url: '/redirect',
  },
  'advanced.routing': {
    menu: {
      name: 'navAdvancedRouting',
      desc: 'navAdvancedRoutingDesc',
      sref: 'advanced.routing',
    },
    hideInAPMode: !0,
    page: 'routing',
    title: 'navAdvancedRouting',
    url: '/routing',
  },
  'advanced.tr69': {
    menu: {
      name: 'navAdvancedTR69',
      desc: 'navAdvancedTR69Desc',
      sref: 'advanced.tr69',
    },
    hideInAPMode: !0,
    page: 'tr69',
    title: 'navAdvancedTR69',
    url: '/tr69',
  },
  'advanced.raccess': {
    menu: {
      name: 'navAdvancedRaccess',
      desc: 'navAdvancedRaccessDesc',
      sref: 'advanced.raccess',
    },
    hideInAPMode: !0,
    page: 'raccess',
    url: '/raccess',
    title: 'navAdvancedRaccess',
  },
  'advanced.upnp': {
    menu: {
      name: 'navAdvancedUpnp',
      desc: 'navAdvancedUpnpDesc',
      sref: 'advanced.upnp',
    },
    hideInAPMode: !0,
    page: 'upnp',
    url: '/upnp',
    title: 'navAdvancedUpnp',
  },
  'advanced.udpxy': {
    menu: {
      name: 'navAdvancedUDPXY',
      desc: 'navAdvancedUDPXYDesc',
      sref: 'advanced.udpxy',
    },
    hideInAPMode: !0,
    page: 'udpxy',
    url: '/udpxy',
    title: 'navAdvancedUDPXY',
  },
  'advanced.xdsl': {
    menu: {
      name: 'navAdvancedXdsl',
      desc: 'navAdvancedXdslDesc',
      sref: 'advanced.xdsl',
    },
    hideInAPMode: !0,
    page: 'xdsl',
    title: 'navAdvancedXdsl',
    url: '/xdsl',
  },
  'advanced.misc': {
    menu: {
      name: 'navAdvancedMisc',
      desc: 'navAdvancedMiscDesc',
      sref: 'advanced.misc',
    },
    hideInAPMode: !0,
    page: 'misc',
    title: 'navAdvancedMisc',
    url: '/misc',
  },
  'advanced.ipsec': {
    menu: {
      name: 'navAdvancedIPsec',
      desc: 'navAdvancedIPsecDesc',
      sref: 'advanced.ipsec.info',
    },
    hideInAPMode: !0,
    title: 'navAdvancedIPsec',
    url: '/ipsec',
  },
  'advanced.ipsec.info': {
    url: '/info',
    title: 'navAdvancedIPsec',
    page: 'ipsecInfo',
  },
  'advanced.ipsec.add': {
    url: '/add',
    title: 'navAdvancedIPsecAdd',
    page: 'ipsecRule',
  },
  'advanced.ipsec.edit': {
    url: '/edit?inx',
    title: 'navAdvancedIPsecEdit',
    page: 'ipsecRule',
  },
  'advanced.igmpx': {
    menu: {
      name: 'navAdvancedIGMPX',
      desc: 'navAdvancedIGMPXDesc',
      sref: 'advanced.igmpx.settings',
    },
    hideInAPMode: !0,
    title: 'navAdvancedIGMPX',
    url: '/igmpx',
  },
  'advanced.igmpx.settings': {
    url: '/settings',
    title: 'navAdvancedIGMPX',
    page: 'igmpx',
  },
  'advanced.igmpx.addStream': {
    url: '/addStream?type',
    title: 'navAdvancedIGMPXAddStream',
    page: 'igmpxStream',
  },
  'advanced.igmpx.editStream': {
    url: '/editStreams?type&inx',
    title: 'navAdvancedIGMPXEditStream',
    page: 'igmpxStream',
  },
  'advanced.hot_wifi': {
    menu: {
      name: 'navAdvancedHotWifi',
      desc: 'navAdvancedHotWifiDesc',
      sref: 'advanced.hot_wifi',
    },
    page: 'hot_wifi',
    title: 'navAdvancedHotWifi',
    url: '/hot_wifi',
  },
  policyRouting: {
    menu: {
      name: 'navPolicyRout',
      desc: 'navPolicyRoutDesc',
      sref: 'policyRouting.tables',
      icon: 'routing',
    },
    title: 'policyRouting',
    url: '/policy_routing',
  },
  'policyRouting.tables': {
    menu: {
      name: 'navPolicyRoutTables',
      desc: 'navPolicyRoutTablesDesc',
      sref: 'policyRouting.tables',
    },
    page: 'policyRoutTables',
    title: 'navPolicyRoutTables',
    url: '/tables',
  },
  'policyRouting.routes': {
    menu: {
      name: 'navPolicyRoutRoutes',
      desc: 'navPolicyRoutRoutesDesc',
      sref: 'policyRouting.routes.info',
    },
    title: 'navPolicyRoutRoutes',
    url: '/routes',
  },
  'policyRouting.routes.info': {
    url: '/info?version',
    title: 'navPolicyRoutRoutes',
    page: 'policyRoutRoutesInfo',
  },
  'policyRouting.routes.add': {
    url: '/add?version',
    title: 'navPolicyRoutRoutesAdd',
    page: 'policyRoutRoutesRoute',
  },
  'policyRouting.routes.edit': {
    url: '/edit?version,id',
    title: 'navPolicyRoutRoutesEdit',
    page: 'policyRoutRoutesRoute',
  },
  'policyRouting.rules': {
    menu: {
      name: 'navPolicyRoutRules',
      desc: 'navPolicyRoutRulesDesc',
      sref: 'policyRouting.rules',
    },
    page: 'policyRoutRules',
    title: 'navPolicyRoutRules',
    url: '/rules?version',
  },
  firewall: {
    menu: {
      name: 'navFirewall',
      desc: 'navFirewallDesc',
      sref: 'firewall.ipfilter.info',
      icon: 'firewall',
    },
    title: 'navFirewall',
    url: '/firewall',
  },
  'firewall.ipfilter': {
    menu: {
      name: 'navFirewallIPFilter',
      desc: 'navFirewallIPFilterDesc',
      sref: 'firewall.ipfilter.info',
    },
    hideInAPMode: !0,
    title: 'navFirewallIPFilter',
    url: '/ipfilter',
  },
  'firewall.ipfilter.info': {
    url: '/info',
    title: 'navFirewallIPFilter',
    page: 'ipfilterInfo',
  },
  'firewall.ipfilter.add': {
    url: '/add',
    title: 'navFirewallIPFilterAdd',
    page: 'ipfilterRule',
  },
  'firewall.ipfilter.edit': {
    url: '/edit?inx',
    title: 'navFirewallIPFilterEdit',
    page: 'ipfilterRule',
  },
  'firewall.vservers': {
    menu: {
      name: 'navFirewallVservers',
      desc: 'navFirewallVserversDesc',
      sref: 'firewall.vservers.info',
    },
    hideInAPMode: !0,
    title: 'navFirewallVservers',
    url: '/vservers',
  },
  'firewall.vservers.info': {
    url: '/info',
    title: 'navFirewallVservers',
    page: 'vserversInfo',
  },
  'firewall.vservers.add': {
    url: '/add',
    title: 'navFirewallVserversAdd',
    page: 'vserversRule',
  },
  'firewall.vservers.edit': {
    url: '/edit?inx',
    title: 'navFirewallVserversEdit',
    page: 'vserversRule',
  },
  'firewall.dmz': {
    menu: {
      name: 'navFirewallDMZ',
      desc: 'navFirewallDMZDesc',
      sref: 'firewall.dmz',
    },
    hideInAPMode: !0,
    title: 'navFirewallDMZ',
    page: 'dmz',
    url: '/dmz',
  },
  'firewall.macfilter': {
    menu: {
      name: 'navMacFilter',
      desc: 'navMacFilterDesc',
      sref: 'firewall.macfilter',
    },
    page: 'macfilter',
    title: 'navMacFilter',
    url: '/macfilter',
  },
  'firewall.urlfilter': {
    menu: {
      name: 'navUrlFilter',
      desc: 'navUrlFilterDesc',
      sref: 'firewall.urlfilter',
    },
    hideInAPMode: !0,
    page: 'urlfilter',
    title: 'navUrlFilter',
    url: '/urlfilter',
  },
  'firewall.dos_settings': {
    menu: {
      name: 'navDosSettings',
      desc: 'navDosSettingsDesc',
      sref: 'firewall.dos_settings',
    },
    page: 'dos_settings',
    title: 'navDosSettings',
    url: '/dos',
  },
  openvpn: {
    menu: { name: 'navOpenVPN', sref: 'openvpn.status', icon: 'openvpn' },
    title: 'navOpenVPN',
    url: '/openvpn',
  },
  'openvpn.status': {
    menu: { name: 'navOpenVPNStatus', sref: 'openvpn.status' },
    page: 'openVpnStatus',
    title: 'navOpenVPNStatus',
    url: '/state',
  },
  'openvpn.settings': {
    menu: {
      name: 'navOpenVPNSettings',
      desc: 'navOpenVPNSettingsDesc',
      sref: 'openvpn.settings',
    },
    page: 'openVpnSettings',
    title: 'navOpenVPNSettings',
    url: '/settings',
  },
  'openvpn.keys': {
    menu: {
      name: 'navOpenVPNKeys',
      desc: 'navOpenVPNKeysDesc',
      sref: 'openvpn.keys',
    },
    page: 'openVpnKeys',
    title: 'navOpenVPNKeys',
    url: '/keys',
  },
  'firewall.dmz': {
    menu: {
      name: 'navFirewallDMZ',
      desc: 'navFirewallDMZDesc',
      sref: 'firewall.dmz',
    },
    hideInAPMode: !0,
    title: 'navFirewallDMZ',
    page: 'dmz',
    url: '/dmz',
  },
  'firewall.macfilter': {
    menu: {
      name: 'navMacFilter',
      desc: 'navMacFilterDesc',
      sref: 'firewall.macfilter',
    },
    page: 'macfilter',
    title: 'navMacFilter',
    url: '/macfilter',
  },
  'firewall.urlfilter': {
    menu: {
      name: 'navUrlFilter',
      desc: 'navUrlFilterDesc',
      sref: 'firewall.urlfilter',
    },
    hideInAPMode: !0,
    page: 'urlfilter',
    title: 'navUrlFilter',
    url: '/urlfilter',
  },
  'firewall.zones': {
    menu: {
      name: 'navFirewallProZones',
      desc: 'navFirewallProZonesDesc',
      sref: 'firewall.zones',
    },
    title: 'navFirewallProZones',
    page: 'firewallZones',
    url: '/zones?version',
  },
  'firewall.policy': {
    menu: {
      name: 'navFirewallProPolicy',
      desc: 'navFirewallProPolicyDesc',
      sref: 'firewall.policy',
    },
    title: 'navFirewallProPolicy',
    page: 'firewallPolicy',
    url: '/policy?ipversion',
  },
  'firewall.rules': {
    menu: {
      name: 'navFirewallProRules',
      desc: 'navFirewallProRulesDesc',
      sref: 'firewall.rules.list',
    },
    title: 'navFirewallProRules',
    url: '/rules?version',
  },
  'firewall.rules.list': {
    url: '/list',
    title: 'navFirewallProRules',
    page: 'firewallRulesList',
  },
  'firewall.rules.add': {
    url: '/add',
    title: 'navFirewallProRulesAdd',
    page: 'firewallRulesEdit',
  },
  'firewall.rules.edit': {
    url: '/edit?inx',
    title: 'navFirewallProRulesEdit',
    page: 'firewallRulesEdit',
  },
  'firewall.masq': {
    menu: {
      name: 'navFirewallProMasq',
      desc: 'navFirewallProMasqDesc',
      sref: 'firewall.masq.list',
    },
    title: 'navFirewallProMasq',
    url: '/masq',
  },
  'firewall.masq.list': {
    url: '/list',
    title: 'navFirewallProMasq',
    page: 'firewallMasqList',
  },
  'firewall.masq.add': {
    url: '/add',
    title: 'firewallProMasqAdd',
    page: 'firewallMasqEdit',
  },
  'firewall.masq.edit': {
    url: '/edit?inx',
    title: 'firewallProMasqEdit',
    page: 'firewallMasqEdit',
  },
  system: {
    menu: {
      name: 'navSystem',
      desc: 'navSystemDesc',
      sref: 'system.summary',
      icon: 'settings',
    },
    title: 'navSystem',
    url: '/system',
  },
  'system.summary': {
    menu: { name: 'navSystem', desc: 'navSystemDesc', sref: 'system' },
    hidden: !0,
    page: 'system',
    title: 'navSystem',
    url: '/summary',
  },
  'system.config': {
    menu: {
      name: 'navSystemConfig',
      desc: 'navSystemConfigDesc',
      sref: 'system.config',
    },
    page: 'sysConfig',
    title: 'navSystemConfig',
    url: '/config',
  },
  'system.firmware': {
    menu: {
      name: 'navSystemFWUpdate',
      desc: 'navSystemFWUpdateDesc',
      sref: 'system.firmware',
    },
    page: 'firmware',
    title: 'navSystemFWUpdate',
    url: '/firmware',
  },
  'system.syslog': {
    menu: {
      name: 'navSystemSyslog',
      desc: 'navSystemSyslogDesc',
      sref: 'system.syslog',
    },
    page: 'syslog',
    title: 'navSystemSyslog',
    url: '/syslog?tab',
  },
  'system.ping': {
    menu: {
      name: 'navSystemPing',
      desc: 'navSystemPingDesc',
      sref: 'system.ping',
    },
    page: 'ping',
    title: 'navSystemPing',
    url: '/ping',
  },
  'system.traceroute': {
    menu: {
      name: 'navSystemTraceroute',
      desc: 'navSystemTracerouteDesc',
      sref: 'system.traceroute',
    },
    page: 'traceroute',
    title: 'navSystemTraceroute',
    url: '/traceroute',
  },
  'system.telnet': {
    menu: {
      name: 'navSystemTelnet',
      desc: 'navSystemTelnetDesc',
      sref: 'system.telnet',
    },
    page: 'telnet',
    title: 'navSystemTelnet',
    url: '/telnet',
  },
  'system.ntp': {
    menu: {
      name: 'navSystemNtp',
      desc: 'navSystemNtpDesc',
      sref: 'system.ntp',
    },
    page: 'ntp',
    title: 'navSystemNtp',
    url: '/ntp',
  },
  stats: {
    menu: {
      name: 'navStats',
      desc: 'navStatsDesc',
      sref: 'stats.network',
      icon: 'statistics',
    },
    url: '/stats',
    title: 'navStats',
  },
  'stats.network': {
    menu: {
      name: 'nawStatsNet',
      desc: 'nawStatsNetDesc',
      sref: 'stats.network',
    },
    url: '/network',
    title: 'nawStatsNet',
    page: 'statsNetwork',
  },
  'stats.pon': {
    menu: { name: 'navStatsPon', desc: 'navStatsPonDesc', sref: 'stats.pon' },
    url: '/pon',
    title: 'navStatsPon',
    page: 'statsPon',
  },
  'stats.ddm': {
    menu: { name: 'navStatsDDM', desc: 'navStatsDDMDesc', sref: 'stats.ddm' },
    url: '/ddm',
    title: 'navStatsDDM',
    page: 'statsDDM',
  },
  'stats.dhcp': {
    menu: {
      name: 'navStatsDHCP',
      desc: 'nawStatsDHCPDesc',
      sref: 'stats.dhcp',
    },
    url: '/dhcp',
    title: 'navStatsDHCP',
    page: 'statsDhcp',
  },
  'stats.routing': {
    menu: {
      name: 'navStatsRoute',
      desc: 'navStatsRouteDesc',
      sref: 'stats.routing',
    },
    hideInAPMode: !0,
    url: '/routing',
    title: 'navStatsRoute',
    page: 'statsRouting',
  },
  'stats.clients': {
    menu: {
      name: 'navStatsClients',
      desc: 'navStatsClientsDesc',
      sref: 'stats.clients',
    },
    url: '/clients',
    title: 'navStatsClients',
    page: 'statsClients',
  },
  'stats.ports': {
    menu: {
      name: 'navStatsPorts',
      desc: 'navStatsPortsDesc',
      sref: 'stats.ports',
    },
    url: '/ports',
    title: 'navStatsPorts',
    page: 'statsPorts',
  },
  'stats.portDetails': {
    url: '/ports/{portAlias:LAN1|LAN2|LAN3|LAN4|WAN|lan1|lan2|lan3|lan4|wan}',
    title: 'navStatsPortDetails',
    page: 'statsPortDetails',
    hidden: !0,
  },
  'stats.igmp': {
    menu: {
      name: 'navStatsIgmp',
      desc: 'navStatsIgmpDesc',
      sref: 'stats.igmp',
    },
    url: '/igmp',
    title: 'navStatsIgmp',
    page: 'statsIgmp',
  },
  'stats.sessions': {
    menu: {
      name: 'navStatsSessions',
      desc: 'navStatsSessionsDesc',
      sref: 'stats.sessions',
    },
    hideInAPMode: !0,
    url: '/sessions',
    title: 'navStatsSessions',
    page: 'statsSessions',
  },
  'stats.dsl': {
    menu: { name: 'navStatsDSL', desc: 'navStatsDSLDesc', sref: 'stats.dsl' },
    url: '/dsl',
    title: 'navStatsDSL',
    page: 'statsDSL',
  },
  yandexdns: {
    menu: {
      name: 'navYandexDns',
      sref: 'yandexdns.settings',
      langIcon: 'ya_icon_name',
    },
    hideInAPMode: !0,
    url: '/yandexdns',
    title: 'navYandexDns',
  },
  'yandexdns.settings': {
    menu: { name: 'navYandexDnsSettings', sref: 'yandexdns.settings' },
    url: '/settings',
    title: 'navYandexDnsSettings',
    page: 'yandexDnsSettings',
  },
  'yandexdns.rules': {
    menu: { name: 'navYandexDnsDevices', sref: 'yandexdns.rules' },
    url: '/rules',
    title: 'navYandexDnsDevices',
    page: 'yandexDnsRules',
  },
  safedns: {
    menu: {
      name: 'navSafeDNS',
      desc: 'navSafeDNSDesc',
      sref: 'safedns.settings',
      icon: 'lighthouse',
    },
    url: '/safedns',
    title: 'navSafeDNS',
    url: '/safedns',
  },
  'safedns.settings': {
    menu: { name: 'navSafeDNSSettings', sref: 'safedns.settings' },
    url: '/settings',
    title: 'navSafeDNSSettings',
    page: 'safeDnsSettings',
  },
  'safedns.mac': {
    menu: { name: 'navSafeDNSMac', sref: 'safedns.mac' },
    url: '/mac',
    title: 'navSafeDNSMac',
    page: 'safeDnsMac',
  },
  usbmodem: {
    menu: { name: 'navUSBModem', sref: 'usbmodem', icon: 'usb_modem' },
    hideInAPMode: !0,
    url: '/usbmodem',
    title: 'navUSBModem',
  },
  'usbmodem.basic': {
    menu: { name: 'navUSBModemBasic', sref: 'usbmodem.basic' },
    url: '/basic',
    title: 'navUSBModemBasic',
    page: 'usbmodemBasic',
  },
  'usbmodem.pin': {
    menu: { name: 'navUSBModemPIN', sref: 'usbmodem.pin' },
    url: '/pin',
    title: 'navUSBModemPIN',
    page: 'usbmodemPIN',
  },
  'usbmodem.sms': {
    menu: { name: 'navUSBModemSMS', sref: 'usbmodem.sms' },
    url: '/sms',
    title: 'navUSBModemSMS',
    page: 'usbmodemSMS',
  },
  home: {
    menu: {
      name: 'navHome',
      desc: 'navHomeDesc',
      sref: 'home',
      icon: 'home',
      openPage: !0,
    },
    hideInAPMode: !0,
    page: 'home',
    url: '/home',
    title: 'navHome',
  },
  dcc: {
    menu: {
      external: !0,
      url: '/wizard/index-wizard.html',
      icon: 'dcc',
      name: 'navDCC',
    },
    title: 'navDCC',
  },
});