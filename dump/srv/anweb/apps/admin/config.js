'use strict';
angular.module('app.config', []).constant('pageList', {
  statsNetwork: {
    html: ['/apps/admin/pages/stats/network/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/stats/network/ctrl.lazy.js'],
    ctrl: 'networkStatsCtrl',
  },
  statsDhcp: {
    html: ['/apps/admin/pages/stats/dhcp/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/stats/dhcp/ctrl.lazy.js'],
    ctrl: 'dhcpStatsCtrl',
  },
  statsRouting: {
    html: ['/apps/admin/pages/stats/routing/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/stats/routing/ctrl.lazy.js'],
    ctrl: 'routingStatsCtrl',
  },
  statsClients: {
    html: ['/apps/admin/pages/stats/clients/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/stats/clients/ctrl.lazy.js'],
    ctrl: 'clientStatsCtrl',
  },
  statsIgmp: {
    html: ['/apps/admin/pages/stats/igmp/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/stats/igmp/ctrl.lazy.js'],
    ctrl: 'igmpStatsCtrl',
  },
  statsSessions: {
    html: ['/apps/admin/pages/stats/sessions/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/stats/sessions/ctrl.lazy.js'],
    ctrl: 'sessionStatsCtrl',
  },
  statsPorts: {
    html: ['/apps/admin/pages/stats/ports/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/stats/ports/ctrl.lazy.js'],
    ctrl: 'portStatsCtrl',
  },
  statsPortDetails: {
    html: ['/apps/admin/pages/stats/ports/details.page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/stats/ports/details.ctrl.lazy.js'],
    ctrl: 'portDetailsStatsCtrl',
  },
  wanCore: {
    html: ['/apps/admin/pages/wan/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wan/ctrl.lazy.js'],
    ctrl: 'WanCoreCtrl',
  },
  wanInfo: {
    html: ['/apps/admin/pages/wan/info/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wan/info/ctrl.lazy.js'],
    ctrl: 'WanInfoCtrl',
  },
  wanInfoConnections: {
    html: ['/apps/admin/pages/wan/info/connections/page.list.tpl.html'],
    lazyDeps: [],
    ctrl: 'WanInfoConnectionsCtrl',
  },
  wanSimpleConnections: {
    html: ['/apps/admin/pages/wan/info/connections/page.simple.tpl.html'],
    lazyDeps: [],
    ctrl: 'WanInfoConnectionsCtrl',
  },
  wanInfoGwif: {
    html: ['/apps/admin/pages/wan/info/gwif/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'WanInfoGwifCtrl',
  },
  wanInfoIgmp: {
    html: ['/apps/admin/pages/wan/info/igmp/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'WanInfoIgmpCtrl',
  },
  wanConnection: {
    html: ['/apps/admin/pages/wan/connection/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wan/connection/ctrl.lazy.js'],
    ctrl: 'WanConnectionCtrl',
  },
  wanAdd: {
    html: ['/apps/admin/pages/wan/connection/add/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wan/connection/add/ctrl.lazy.js'],
    ctrl: 'WanAddCtrl',
  },
  wanEdit: {
    html: ['/apps/admin/pages/wan/connection/edit/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wan/connection/edit/ctrl.lazy.js'],
    ctrl: 'wanEditCtrl',
  },
  wanHeader: {
    html: ['/apps/admin/pages/wan/connection/components/header/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'WanHeaderCtrl',
  },
  wanContent: {
    html: ['/apps/admin/pages/wan/connection/components/content/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'WanContentCtrl',
  },
  wanGeneral: {
    html: [
      '/apps/admin/pages/wan/connection/components/general/page.tpl.html',
      '/apps/admin/pages/wan/connection/components/general/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/general/page.full.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WanGeneralCtrl',
  },
  wanMedia: {
    html: [
      '/apps/admin/pages/wan/connection/components/media/page.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/page.full.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/ethernet/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/ethernet/page.full.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/wifi/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/wifi/page.full.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/ptm/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/ptm/page.full.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/atm/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/media/atm/page.full.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WanMediaCtrl',
  },
  wanFlags: {
    html: ['/apps/admin/pages/wan/connection/components/flags/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'WanFlagsCtrl',
  },
  wanDynIPv4oE: {
    html: [
      '/apps/admin/pages/wan/connection/components/ipv4oe/dynamicIP/page.tpl.html',
      '/apps/admin/pages/wan/connection/components/ipv4oe/dynamicIP/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/ipv4oe/dynamicIP/page.full.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WanDynIPv4oeCtrl',
  },
  wanStatIPv4oE: {
    html: [
      '/apps/admin/pages/wan/connection/components/ipv4oe/staticIP/page.tpl.html',
      '/apps/admin/pages/wan/connection/components/ipv4oe/staticIP/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/ipv4oe/staticIP/page.full.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WanStatIPv4oeCtrl',
  },
  wanDynIPv6oE: {
    html: [
      '/apps/admin/pages/wan/connection/components/ipv6oe/dynamicIP/page.tpl.html',
      '/apps/admin/pages/wan/connection/components/ipv6oe/dynamicIP/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/ipv6oe/dynamicIP/page.full.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WanDynIPv6oeCtrl',
  },
  wanStatIPv6oE: {
    html: [
      '/apps/admin/pages/wan/connection/components/ipv6oe/staticIP/page.tpl.html',
      '/apps/admin/pages/wan/connection/components/ipv6oe/staticIP/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/ipv6oe/staticIP/page.full.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WanStatIPv6oeCtrl',
  },
  wanPPP: {
    html: [
      '/apps/admin/pages/wan/connection/components/ppp/page.tpl.html',
      '/apps/admin/pages/wan/connection/components/ppp/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/ppp/page.full.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WanPPPCtrl',
  },
  wanUsbModem: {
    html: [
      '/apps/admin/pages/wan/connection/components/usbmodem/page.tpl.html',
      '/apps/admin/pages/wan/connection/components/usbmodem/page.basic.tpl.html',
      '/apps/admin/pages/wan/connection/components/usbmodem/page.full.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WanUsbModemCtrl',
  },
  lan: {
    html: [
      '/apps/admin/pages/lan/page.tpl.html',
      '/apps/admin/pages/lan/list/page.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'lanCtrl',
  },
  lanInterface: {
    html: [
      '/apps/admin/pages/lan/interface/page.tpl.html',
      '/apps/admin/pages/lan/interface/page.list.tpl.html',
      '/apps/admin/pages/lan/form/page.tpl.html',
      '/apps/admin/pages/lan/header/page.tpl.html',
      '/apps/admin/pages/lan/ipv4/page.tpl.html',
      '/apps/admin/pages/lan/ipv6/page.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'lanInterfaceCtrl',
  },
  wanReserv: {
    html: ['/apps/admin/pages/wanreserv/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wanreserv/ctrl.lazy.js'],
    ctrl: 'WanReservCtrl',
  },
  wifiCommon: {
    html: [
      '/apps/admin/pages/wifi/common/page.tpl.html',
      '/apps/admin/pages/wifi/common/general/page.tpl.html',
      '/apps/admin/pages/wifi/common/ap.info/page.tpl.html',
      '/apps/admin/pages/wifi/common/ap/ap.tpl.html',
      '/apps/admin/pages/wifi/common/ap/page.tpl.html',
    ],
    lazyDeps: ['/apps/admin/pages/wifi/common/ctrl.lazy.js'],
    ctrl: 'wifiCommonCtrl',
  },
  wifiAP: {
    html: [
      '/apps/admin/pages/wifi/common/ap/form.tpl.html',
      '/apps/admin/pages/wifi/common/ap/ap.tpl.html',
    ],
    lazyDeps: [],
    ctrl: 'WifiAPForm',
  },
  wifiClientMgm: {
    html: ['/apps/admin/pages/wifi/client_mgm/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wifi/client_mgm/ctrl.lazy.js'],
    ctrl: 'wifiClientMgmCtrl',
  },
  wifiWps: {
    html: ['/apps/admin/pages/wifi/wps/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wifi/wps/ctrl.lazy.js'],
    ctrl: 'wifiWPSCtrl',
  },
  wifiWMM: {
    html: ['/apps/admin/pages/wifi/wmm/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wifi/wmm/ctrl.lazy.js'],
    ctrl: 'wifiWMMCtrl',
  },
  wifiClient: {
    html: ['/apps/admin/pages/wifi/client/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wifi/client/ctrl.lazy.js'],
    ctrl: 'wifiClientCtrl',
  },
  wifiClientTable: {
    html: ['/general/templates/wifi/client/clientTable.tpl.html'],
    lazyDeps: [],
    ctrl: 'WifiClientTableCtrl',
  },
  wifiClientShaping: {
    html: ['/apps/admin/pages/wifi/client_shaping/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wifi/client_shaping/ctrl.lazy.js'],
    ctrl: 'wifiClientShapingCtrl',
  },
  wifiAdv: {
    html: ['/apps/admin/pages/wifi/advanced/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wifi/advanced/ctrl.lazy.js'],
    ctrl: 'wifiAdvCtrl',
  },
  wifiMac: {
    html: ['/apps/admin/pages/wifi/mac/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wifi/mac/ctrl.lazy.js'],
    ctrl: 'wifiMacCtrl',
  },
  wifiRoaming: {
    html: ['/apps/admin/pages/wifi/roaming/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wifi/roaming/ctrl.lazy.js'],
    ctrl: 'wifiRoamingCtrl',
  },
  vlan: {
    html: ['/apps/admin/pages/vlan/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/vlan/ctrl.lazy.js'],
    ctrl: 'VlanCtrl',
  },
  vlanList: {
    html: ['/apps/admin/pages/vlan/list/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/vlan/list/ctrl.lazy.js'],
    ctrl: 'VlanListCtrl',
  },
  vlanForm: {
    html: ['/apps/admin/pages/vlan/form/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/vlan/form/ctrl.lazy.js'],
    ctrl: 'VlanFormCtrl',
  },
  upnp: {
    html: ['/apps/admin/pages/upnp/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/upnp/ctrl.lazy.js'],
    ctrl: 'UpnpCtrl',
  },
  dns: {
    html: ['/apps/admin/pages/dns/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/dns/ctrl.lazy.js'],
    ctrl: 'DnsCtrl',
  },
  misc: {
    html: ['/apps/admin/pages/misc/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/misc/ctrl.lazy.js'],
    ctrl: 'MiscCtrl',
  },
  ports: {
    html: ['/apps/admin/pages/ports/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/ports/ctrl.lazy.js'],
    ctrl: 'PortsCtrl',
  },
  ddnsInfo: {
    html: ['/apps/admin/pages/ddns/info/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/ddns/info/ctrl.lazy.js'],
    ctrl: 'DdnsCtrl',
  },
  ddnsRule: {
    html: ['/apps/admin/pages/ddns/rule/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/ddns/rule/ctrl.lazy.js'],
    ctrl: 'DdnsRuleCtrl',
  },
  routing: {
    html: ['/apps/admin/pages/routing/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/routing/ctrl.lazy.js'],
    ctrl: 'RoutingCtrl',
  },
  tr69: {
    html: ['/apps/admin/pages/tr69/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/tr69/ctrl.lazy.js'],
    ctrl: 'Tr69Ctrl',
  },
  raccess: {
    html: ['/apps/admin/pages/raccess/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/raccess/ctrl.lazy.js'],
    ctrl: 'RemoteAccessCtrl',
  },
  udpxy: {
    html: ['/apps/admin/pages/udpxy/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/udpxy/ctrl.lazy.js'],
    ctrl: 'UDPXYCtrl',
  },
  redirect: {
    html: ['/apps/admin/pages/redirect/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/redirect/ctrl.lazy.js'],
    ctrl: 'RedirectCtrl',
  },
  bandwidth_control: {
    html: ['/apps/admin/pages/bandwidth/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/bandwidth/ctrl.lazy.js'],
    ctrl: 'BandwidthController',
  },
  dos_settings: {
    html: ['/apps/admin/pages/dosSettings/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/dosSettings/ctrl.lazy.js'],
    ctrl: 'DosSettingsCtrl',
  },
  ipfilterInfo: {
    html: ['/apps/admin/pages/ipfilter/info/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/ipfilter/info/ctrl.lazy.js'],
    ctrl: 'IPFilterInfoCtrl',
  },
  ipfilterRule: {
    html: ['/apps/admin/pages/ipfilter/rule/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/ipfilter/rule/ctrl.lazy.js'],
    ctrl: 'IPFilterRuleCtrl',
  },
  vserversInfo: {
    html: ['/apps/admin/pages/vservers/info/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/vservers/info/ctrl.lazy.js'],
    ctrl: 'VserversInfoCtrl',
  },
  vserversRule: {
    html: ['/apps/admin/pages/vservers/rule/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/vservers/rule/ctrl.lazy.js'],
    ctrl: 'VserversRuleCtrl',
  },
  dmz: {
    html: ['/apps/admin/pages/dmz/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/dmz/ctrl.lazy.js'],
    ctrl: 'DmzCtrl',
  },
  macfilter: {
    html: ['/apps/admin/pages/macfilter/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/macfilter/ctrl.lazy.js'],
    ctrl: 'MacFilterCtrl',
  },
  urlfilter: {
    html: [
      '/apps/admin/pages/urlfilter/page.tpl.html',
      '/apps/admin/pages/urlfilter/dnsfilter.tpl.html',
      '/apps/admin/pages/urlfilter/addrList.tpl.html',
    ],
    lazyDeps: ['/apps/admin/pages/urlfilter/ctrl.lazy.js'],
    ctrl: 'UrlFilterCtrl',
  },
  system: {
    html: ['/apps/admin/pages/system/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/system/ctrl.lazy.js'],
    ctrl: 'SystemCtrl',
  },
  sysConfig: {
    html: ['/apps/admin/pages/system/config/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/system/config/ctrl.lazy.js'],
    ctrl: 'SysConfigCtrl',
  },
  firmware: {
    html: ['/apps/admin/pages/system/firmware/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/system/firmware/ctrl.lazy.js'],
    ctrl: 'SysFirmwareCtrl',
  },
  syslog: {
    html: ['/apps/admin/pages/system/log/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/system/log/ctrl.lazy.js'],
    ctrl: 'SysLogCtrl',
  },
  ping: {
    html: ['/apps/admin/pages/system/ping/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/system/ping/ctrl.lazy.js'],
    ctrl: 'SysPingCtrl',
  },
  traceroute: {
    html: ['/apps/admin/pages/system/traceroute/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/system/traceroute/ctrl.lazy.js'],
    ctrl: 'SysTracerouteCtrl',
  },
  telnet: {
    html: ['/apps/admin/pages/system/telnet/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/system/telnet/ctrl.lazy.js'],
    ctrl: 'SysTelnetCtrl',
  },
  ntp: {
    html: ['/apps/admin/pages/system/ntp/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/system/ntp/ctrl.lazy.js'],
    ctrl: 'SysNtpCtrl',
  },
  yandexDnsSettings: {
    html: ['/apps/admin/pages/yandexDns/settings/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/yandexDns/settings/ctrl.lazy.js'],
    ctrl: 'yandexDnsSettingsController',
  },
  yandexDnsRules: {
    html: ['/apps/admin/pages/yandexDns/rules/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/yandexDns/rules/ctrl.lazy.js'],
    ctrl: 'yandexDnsRulesController',
  },
  portsWizard: {
    html: ['/apps/admin/pages/wizards/ports/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/wizards/ports/ctrl.lazy.js'],
    ctrl: 'WizardPortsController',
  },
  home: {
    html: ['/apps/admin/pages/home/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/home/ctrl.lazy.js'],
    ctrl: 'HomeCtrl',
  },
  notice: {
    html: ['/apps/admin/pages/notice/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'NoticeCtrl',
  },
  summary: {
    html: ['/apps/admin/pages/summary/page.tpl.html'],
    lazyDeps: ['/apps/admin/pages/summary/ctrl.lazy.js'],
    ctrl: 'SummaryCtrl',
  },
  error: {
    html: ['/apps/admin/pages/error/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'ErrorCtrl',
  },
});
