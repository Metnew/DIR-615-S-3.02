'use strict';
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  return Array.from(arr);
}
angular.module('wizard').controller('wizardSummaryCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'profiles',
  'devinfo',
  'translate',
  'regions',
  'dataShare',
  'stepManager',
  'profileInspector',
  '$timeout',
  'checkDeviceModeChange',
  function(
    $scope,
    $rootScope,
    $state,
    $stateParams,
    profiles,
    devinfo,
    translate,
    regions,
    dataShare,
    stepManager,
    profile,
    $timeout,
    checkDeviceModeChange
  ) {
    function seviceToHuman(service) {
      if (!service) return '';
      switch (service.toLowerCase()) {
        case '':
          return '';
        case 'iptv':
          return 'IPTV';
        case 'voip':
          return 'VoIP';
        default:
          return 'IPTV+VoIP';
      }
    }
    function addFileLine(s, v, simple) {
      v || (v = ''),
        simple
          ? ($scope.summaryFile && ($scope.summaryFile += '\r\n'),
            ($scope.summaryFile += translate(s)))
          : '' == s
            ? ($scope.summaryFile += translate(s) + ': ' + v)
            : ($scope.summaryFile && ($scope.summaryFile += '\r\n'),
              ($scope.summaryFile += translate(s) + ': ' + v));
    }
    function addFileFields(fields) {
      _.each(fields, function(field) {
        field.hide || addFileLine(field.name, field.value);
      });
    }
    function addFileBR() {
      $scope.summaryFile += '\r\n';
    }
    function getDestinationAddress(conn) {
      if ('DSL.ATM' == conn.MediaType) {
        var destAddr = conn.Media.DSL.ATM.DestinationAddress;
        return [
          { name: 'VPI', value: destAddr.split('/')[0] },
          { name: 'VCI', value: destAddr.split('/')[1] },
        ];
      }
      return [];
    }
    ($scope.stepData = stepManager.getData()), console.log($scope.stepData);
    var device = $scope.device;
    profile.set($scope.nativeData);
    var originToHuman = {
        AutoConfigured: 'wanIPv6AutoConfigured',
        AutoConfiguredByDHCPv6: 'wanIPv6AutoConfiguredByDHCPv6',
        AutoConfiguredBySlaac: 'wanIPv6AutoConfiguredBySlaac',
        AutoConfiguredByDHCPv6PD: 'wanIPv6AutoConfiguredByDHCPv6PD',
      },
      manualProfile = dataShare.get('ManualProfile'),
      isApMode = 'ap' === manualProfile.$DeviceMode.Mode,
      isClient = 'Client' === manualProfile.$InterfaceStep.WiFiMode,
      isRepeater = 'Repeater' === manualProfile.$InterfaceStep.WiFiMode,
      isWDS = 'WDS' === manualProfile.$InterfaceStep.WiFiMode,
      isWISPRepeater = 'WISPRepeater' === manualProfile.$InterfaceStep.WiFiMode,
      isWDSInBridge = isWDS && 'Bridge' == manualProfile.$WiFiWdsStep.Mode,
      deviceSection = { name: 'wizard_smr_device', fields: [] },
      modes = {
        Router: 'mod_router',
        WISPRepeater: 'mod_wisp_repeater',
        AP: 'mod_access_point',
        Repeater: 'mod_repeater',
        Client: 'mod_client',
        WDS: 'mod_wds',
        USB: 'mod_router',
      };
    ($scope.summaryFile = ''),
      ($scope.lanPorts = _.clone($rootScope.gLanPorts)),
      $scope.gReversPortNames || $scope.lanPorts.reverse(),
      ($scope.region = dataShare.get('FoundRegion')),
      ($scope.compileSummary = function(native, info) {
        var wanVID = null,
          result = (regions.byID(native.RegionID), []),
          wanConnection = _.chain(native.Config.WAN)
            .values()
            .pluck('Connection')
            .compact()
            .pluck('1')
            .compact()
            .first()
            .value();
        if (wanConnection && 'Ethernet' != wanConnection.MediaType) {
          var group = { name: 'wizard_summary_connection', fields: [] };
          switch (wanConnection.MediaType) {
            case 'Dongle':
              group.fields.push({
                name: 'wizard_interface_type_step',
                value: translate('usb_modem'),
              });
              break;
            case 'WiFi':
              group.name = '';
          }
          result.push(group);
        }
        if (wanConnection && 'DSL.PTM' == wanConnection.MediaType)
          wanConnection.VLAN.Enable && (wanVID = wanConnection.VLAN.ID);
        else if (native.Config.VLAN) {
          var service = _.find(_.pairs(native.Config.VLAN.services), function(
            pair
          ) {
            return 'internet' == _.first(pair);
          });
          service && _.last(service).vid && (wanVID = _.last(service).vid);
        }
        if (
          ($scope.gFirstData && $scope.gFirstData.Password
            ? (addFileLine('wizard_smr_username', 'admin'),
              addFileLine('wizard_smr_password', $scope.gFirstData.Password))
            : native.Config.SystemPassword &&
              (addFileLine(
                'wizard_smr_username',
                native.Config.SystemPassword.Login
              ),
              addFileLine(
                'wizard_smr_password',
                native.Config.SystemPassword.Password
              )),
          native.Config.LAN && native.Config.LAN[1].IPv4
            ? addFileLine(
                'wizard_smr_devip',
                native.Config.LAN[1].IPv4.StaticIP[1].Address
              )
            : addFileLine('wizard_smr_devip', info.lan[0].ip),
          addFileBR(),
          native.Config.WAN)
        ) {
          if (profile.isViewFound(/Config.WAN.Bridge.Connection.1./)) {
            var conn = native.Config.WAN.Bridge.Connection[1];
            result.push({
              name: 'Bridge',
              fields: [
                { name: 'VLAN ID', value: wanVID, hide: !wanVID },
              ].concat(_toConsumableArray(getDestinationAddress(conn))),
            }),
              addFileLine('Bridge'),
              wanVID && addFileLine('VLAN ID', wanVID);
          }
          if (profile.isViewFound(/Config.WAN.PPTP.Connection.1./)) {
            var conn = native.Config.WAN.PPTP.Connection[1];
            result.push({
              name: conn.ActualType,
              fields: [
                { name: 'wizard_smr_username', value: conn.Username },
                { name: 'wizard_smr_password', value: conn.Password },
                { name: 'wanVPNServiceName', value: conn.ServiceName },
                { name: 'VLAN ID', value: wanVID, hide: !wanVID },
              ].concat(_toConsumableArray(getDestinationAddress(conn))),
            }),
              addFileLine(conn.ActualType),
              addFileLine('wizard_smr_username', conn.Username),
              addFileLine('wizard_smr_password', conn.Password),
              addFileLine('wanVPNServiceName', conn.ServiceName),
              wanVID && addFileLine('VLAN ID', wanVID);
          }
          if (profile.isViewFound(/Config.WAN.PPPoE.Connection.1./)) {
            var conn = native.Config.WAN.PPPoE.Connection[1],
              isPPPoA =
                'DSL.ATM' == conn.MediaType &&
                'PPPoA' == conn.Media.DSL.ATM.LinkType;
            result.push({
              name: isPPPoA ? 'PPPoA' : 'PPPoE',
              fields: [
                { name: 'wizard_smr_username', value: conn.Username },
                { name: 'wizard_smr_password', value: conn.Password },
                { name: 'VLAN ID', value: wanVID, hide: !wanVID },
              ].concat(_toConsumableArray(getDestinationAddress(conn))),
            }),
              addFileLine(isPPPoA ? 'PPPoA' : 'PPPoE'),
              addFileLine('wizard_smr_username', conn.Username),
              addFileLine('wizard_smr_password', conn.Password),
              wanVID && addFileLine('VLAN ID', wanVID);
          }
          if (profile.isViewFound(/Config.WAN.PPPoEDual.Connection.1./)) {
            var conn = native.Config.WAN.PPPoEDual.Connection[1];
            result.push({
              name: 'PPPoE Dual Stack',
              fields: [
                { name: 'wizard_smr_username', value: conn.Username },
                { name: 'wizard_smr_password', value: conn.Password },
                { name: 'VLAN ID', value: wanVID, hide: !wanVID },
              ].concat(_toConsumableArray(getDestinationAddress(conn))),
            }),
              addFileLine('PPPoE Dual Stack'),
              addFileLine('wizard_smr_username', conn.Username),
              addFileLine('wizard_smr_password', conn.Password),
              wanVID && addFileLine('VLAN ID', wanVID);
          }
          if (profile.isViewFound(/Config.WAN.PPPoEv6.Connection.1./)) {
            var conn = native.Config.WAN.PPPoEv6.Connection[1];
            result.push({
              name: 'IPv6 PPPoE',
              fields: [
                { name: 'wizard_smr_username', value: conn.Username },
                { name: 'wizard_smr_password', value: conn.Password },
                { name: 'VLAN ID', value: wanVID, hide: !wanVID },
              ].concat(_toConsumableArray(getDestinationAddress(conn))),
            }),
              addFileLine('IPv6 PPPoE'),
              addFileLine('wizard_smr_username', conn.Username),
              addFileLine('wizard_smr_password', conn.Password),
              wanVID && addFileLine('VLAN ID', wanVID);
          }
          if (profile.isViewFound(/Config.WAN.3G.Connection.1./)) {
            var conn = native.Config.WAN['3G'].Connection[1];
            result.push({
              name: '3G',
              fields: [
                { name: 'wizard_smr_username', value: conn.Username },
                { name: 'wizard_smr_password', value: conn.Password },
                { name: 'APN', value: conn.APN },
                { name: 'VLAN ID', value: wanVID, hide: !wanVID },
              ],
            }),
              addFileLine('3G'),
              addFileLine('wizard_smr_username', conn.Username),
              addFileLine('wizard_smr_password', conn.Password),
              addFileLine('APN', conn.APN),
              wanVID && addFileLine('VLAN ID', wanVID);
          }
          if (profile.isViewFound(/Config.WAN.LTE.Connection.1./)) {
            var conn = native.Config.WAN.LTE.Connection[1];
            result.push({
              name: 'LTE',
              fields: [
                { name: 'wizard_smr_username', value: conn.Username },
                { name: 'wizard_smr_password', value: conn.Password },
                { name: 'APN', value: conn.APN },
                { name: 'VLAN ID', value: wanVID, hide: !wanVID },
              ],
            }),
              addFileLine('LTE'),
              addFileLine('wizard_smr_username', conn.Username),
              addFileLine('wizard_smr_password', conn.Password),
              addFileLine('APN', conn.APN),
              wanVID && addFileLine('VLAN ID', wanVID);
          }
          if (profile.isViewFound(/Config.WAN.IPv4oE.Connection.1./)) {
            var conn = native.Config.WAN.IPv4oE.Connection[1],
              isATM = 'DSL.ATM' == conn.MediaType,
              isIPoA = isATM && 'IPoA' == conn.Media.DSL.ATM.LinkType;
            'Static' == conn.AddressingType
              ? (result.push({
                  name: isIPoA ? 'IPoA' : 'statip',
                  fields: [
                    { name: 'wanAddress', value: conn.StaticIPAddress0 },
                    { name: 'wanNetmask', value: conn.StaticIPSubnetMask0 },
                    { name: 'wanGatewayIP', value: conn.GatewayIPAddress },
                    { name: 'wizard_dns', value: conn.DNSServer1 },
                    { name: 'VLAN ID', value: wanVID, hide: !wanVID },
                  ].concat(_toConsumableArray(getDestinationAddress(conn))),
                }),
                addFileLine(isIPoA ? 'IPoA' : translate('statip')),
                addFileLine('wanAddress', conn.StaticIPAddress0),
                addFileLine('wanNetmask', conn.StaticIPSubnetMask0),
                addFileLine('wanGatewayIP', conn.GatewayIPAddress),
                addFileLine('wizard_dns', conn.DNSServer1),
                wanVID && addFileLine('VLAN ID', wanVID),
                addFileBR())
              : (result.push({
                  name: 'dynip',
                  fields: [
                    { name: 'VLAN ID', value: wanVID, hide: !wanVID },
                  ].concat(_toConsumableArray(getDestinationAddress(conn))),
                }),
                wanVID
                  ? (addFileLine(translate('dynip')),
                    wanVID && addFileLine('VLAN ID', wanVID))
                  : addFileLine(translate('dynip'), null, !0));
          }
          if (profile.isViewFound(/Config.WAN.IPv6oE.Connection.1./)) {
            var conn = native.Config.WAN.IPv6oE.Connection[1];
            if ('Static' == conn.Origin)
              result.push({
                name: 'statipv6',
                fields: [
                  { name: 'wanAddress', value: conn.StaticIPAddress0 },
                  { name: 'wanGatewayIP', value: conn.GatewayIPAddress },
                  {
                    name: 'wizard_dns',
                    value: conn.DNSServer1,
                    hide: !conn.DNSServer1,
                  },
                  { name: 'VLAN ID', value: wanVID, hide: !wanVID },
                ].concat(_toConsumableArray(getDestinationAddress(conn))),
              }),
                addFileLine(translate('statipv6')),
                addFileLine('wanAddress', conn.StaticIPAddress0),
                addFileLine('wanGatewayIP', conn.GatewayIPAddress),
                conn.DNSServer1 && addFileLine('wizard_dns', conn.DNSServer1),
                wanVID && addFileLine('VLAN ID', wanVID),
                addFileBR();
            else {
              var conn = native.Config.WAN.IPv6oE.Connection[1],
                origin = translate(originToHuman[conn.Origin]);
              result.push({
                name: 'dynipv6',
                fields: [
                  { name: 'wizard_ipv6by', value: origin },
                  { name: 'VLAN ID', value: wanVID, hide: !wanVID },
                ].concat(_toConsumableArray(getDestinationAddress(conn))),
              }),
                addFileLine(translate('dynipv6')),
                addFileLine('wizard_ipv6by', origin),
                wanVID && addFileLine('VLAN ID', wanVID);
            }
          }
          addFileFields(getDestinationAddress(conn)), addFileBR();
        }
        if (native.Config.LAN) {
          var IPv4 = native.Config.LAN[1].IPv4;
          if (IPv4 && IPv4.StaticIP) {
            var StaticIP = IPv4.StaticIP[1],
              fields = [];
            'Dynamic' == IPv4.AddressingMode
              ? fields.push({ name: 'dynip', value: translate('yes') })
              : (fields.push({ name: 'wanAddress', value: StaticIP.Address }),
                fields.push({ name: 'wanNetmask', value: StaticIP.SubnetMask }),
                fields.push({
                  name: 'lanGatewayIP',
                  value: StaticIP.GatewayAddress,
                })),
              (fields = _.filter(fields, function(e) {
                return !!e.value;
              })),
              result.push({ name: 'LAN', fields: fields }),
              addFileLine('LAN'),
              addFileFields(fields),
              addFileBR();
          }
        }
        if (isWDS) {
          var WDS = native.Config.WiFi.WDS,
            isOpen = 'None' == WDS.EncryptionType,
            fields = [
              {
                name: 'wifiWDSMode',
                value: translate('wifiWDSMode' + WDS.Mode),
              },
              {
                name: 'wifiWDSEncrypt',
                value: isOpen ? 'Open' : WDS.EncryptionType,
              },
              { name: 'wifiWDSKey', value: WDS.EncryptionKey, hide: isOpen },
            ];
          _.each(WDS.Mac, function(mac, key) {
            fields.push({ name: 'Mac ' + key, value: mac, hide: !mac });
          }),
            result.push({ name: 'WDS', fields: fields }),
            addFileLine('WDS'),
            addFileFields(fields),
            addFileBR();
        }
        if (
          (native.Config.EtherWAN &&
            (_.isEmpty(native.Config.EtherWAN.Port)
              ? addFileLine('wizard_inet_port', 'Internet')
              : addFileLine(
                  'wizard_inet_port',
                  translate('wizard_smr_port') +
                    native.Config.EtherWAN.Port.replace(/[a-zA-Z]+/, '')
                ),
            addFileBR()),
          !native.Config.WiFi ||
            isClient ||
            isWDSInBridge ||
            _.each(native.Config.WiFi.Radio, function(radio, inst) {
              if ('2.4GHz' == radio.OperatingFrequencyBand)
                var band = translate('24ghz'),
                  testData = $rootScope.gWifiChangeTest24;
              else
                var band = translate('5ghz'),
                  testData = $rootScope.gWifiChangeTest5;
              var ap = radio.AccessPoint[1],
                wifi = {
                  name: 'Wi-Fi ' + band,
                  fields: [
                    {
                      name: 'wizard_smr_enable',
                      value: translate(radio.Enable ? 'yes' : 'no'),
                    },
                  ],
                };
              if (
                (radio.Enable &&
                  $rootScope.rootIsWIFIClient &&
                  !_.isUndefined(testData) &&
                  !_.isEqual(testData, radio) &&
                  (wifi.warn = translate('wizard_smr_wifi_warn')),
                radio.Enable && ap)
              ) {
                var security = ap.Security;
                wifi.fields.push({ name: 'SSID', value: ap.SSID }),
                  addFileLine('WiFi ' + band),
                  addFileLine('wizard_smr_ssid', ap.SSID),
                  'None' == security.ModeEnabled
                    ? wifi.fields.push({
                        name: 'wizard_smr_encrypt',
                        value: 'Open',
                      })
                    : (wifi.fields.push({
                        name: 'wizard_smr_encrypt',
                        value: security.ModeEnabled,
                      }),
                      security.ModeEnabled.indexOf('Personal') &&
                        (wifi.fields.push({
                          name: 'wizard_smr_password',
                          value: security.PreSharedKey,
                        }),
                        addFileLine(
                          'wizard_smr_password',
                          security.PreSharedKey
                        )));
              }
              result.push(wifi);
              var guestAp = radio.AccessPoint[2];
              if (guestAp) {
                var guestWiFi = {
                    name: 'WiFi ' + band + '(Guest)',
                    fields: [
                      {
                        name: 'wizard_smr_enable',
                        value: translate(radio.Enable ? 'yes' : 'no'),
                      },
                    ],
                  },
                  security = guestAp.Security;
                guestWiFi.fields.push({ name: 'SSID', value: guestAp.SSID }),
                  addFileLine('wizard_smr_guest_ssid', guestAp.SSID),
                  'None' == security.ModeEnabled
                    ? guestWiFi.fields.push({
                        name: 'wizard_smr_encrypt',
                        value: 'Open',
                      })
                    : (guestWiFi.fields.push({
                        name: 'wizard_smr_encrypt',
                        value: security.ModeEnabled,
                      }),
                      security.ModeEnabled.indexOf('Personal') &&
                        (guestWiFi.fields.push({
                          name: 'wizard_smr_password',
                          value: security.PreSharedKey,
                        }),
                        addFileLine(
                          'wizard_smr_guest_pass',
                          security.PreSharedKey
                        ))),
                  guestAp.BandwidthRestricted &&
                    (guestWiFi.fields.push({
                      name: 'wifiBandwidthRestricted',
                      value: guestAp.BandwidthRestricted,
                    }),
                    addFileLine(
                      'wifiBandwidthRestricted',
                      guestAp.BandwidthRestricted
                    )),
                  guestAp.MaxAssociatedDevices &&
                    (guestWiFi.fields.push({
                      name: 'wifiMaxClients',
                      value: guestAp.MaxAssociatedDevices,
                    }),
                    addFileLine(
                      'wifiMaxClients',
                      guestAp.MaxAssociatedDevices
                    )),
                  result.push(guestWiFi);
              }
              addFileBR();
            }),
          (native.Config.VLAN && $scope.showPortPanel()) ||
            $scope.nativeData.Config.GroupingInterfaces)
        ) {
          addFileLine('wizard_smr_services');
          var sorted = _.sortBy($scope.services, function(s) {
            return s.name;
          });
          _.each(sorted, function(port) {
            if (port.service) {
              var name =
                  translate('wizard_smr_port') +
                  port.name.replace(/[a-zA-Z]+/, ''),
                service = seviceToHuman(port.service);
              addFileLine(name, service);
            }
          }),
            addFileBR();
        }
        if (
          ((deviceSection.fields = [
            { name: 'wizard_smr_model', value: info.modelName },
            { name: 'wizard_smr_software_version', value: info.version },
            {
              name: 'wizard_smr_serial',
              value: info.serialNumber,
              hide: !info.serialNumber,
            },
          ]),
          isApMode ||
            deviceSection.fields.push(
              profile.containLAN()
                ? {
                    name: 'IP',
                    value: native.Config.LAN[1].IPv4.StaticIP[1].Address,
                  }
                : { name: 'IP', value: _.first(info.lan).ip }
            ),
          manualProfile &&
            manualProfile.$InterfaceStep.WiFiMode &&
            deviceSection.fields.push({
              name: 'wizard_smr_mode',
              value: translate(modes[manualProfile.$InterfaceStep.WiFiMode]),
            }),
          (isClient || isRepeater || isWISPRepeater) &&
            deviceSection.fields.push({
              name: 'wizard_smr_client',
              value: manualProfile.$WifiClientStep.SSID,
            }),
          result.push(deviceSection),
          profile.containLAN() &&
            (result.push({
              name: 'LAN',
              fields: [
                {
                  name: 'wanAddress',
                  value: native.Config.LAN[1].IPv4.StaticIP[1].Address,
                },
                {
                  name: 'wanNetmask',
                  value: native.Config.LAN[1].IPv4.StaticIP[1].SubnetMask,
                },
              ],
            }),
            addFileLine('LAN'),
            addFileLine(
              'wanAddress',
              native.Config.LAN[1].IPv4.StaticIP[1].Address
            ),
            addFileLine(
              'wanNetmask',
              native.Config.LAN[1].IPv4.StaticIP[1].SubnetMask
            ),
            addFileBR()),
          native.Config.SystemPassword &&
            _.size(native.Config.SystemPassword.Password) &&
            result.push({
              name: 'wizard_smr_syspass',
              fields: [
                {
                  name: 'wizard_smr_username',
                  value: native.Config.SystemPassword.Login,
                },
                {
                  name: 'wizard_smr_password',
                  value: native.Config.SystemPassword.Password,
                  hidden: !0,
                },
              ],
            }),
          native.Config.SystemTime && native.Config.SystemTime.TimeZone)
        ) {
          var timeZone = parseInt(native.Config.SystemTime.TimeZone);
          console.log('nativeTZ:', native.Config.SystemTime.TimeZone, timeZone);
          var timeZoneUTC =
            timeZone >= 0 ? 'UTC+' + timeZone : 'UTC' + timeZone;
          result.push({
            name: translate('wizard_timezone') + ': ' + timeZoneUTC,
            fields: [],
          });
        }
        return result;
      }),
      ($scope.services = (function(config) {
        if (config.VLAN) return config.VLAN.groups.lan;
        if (config.GroupingInterfaces) {
          var services = [];
          return (
            _.each(config.GroupingInterfaces, function(group) {
              console.log('group', group);
              var name = group.create.name;
              _.each(group.create.lans, function(port) {
                services.push({ name: port, service: name.toLowerCase() });
              });
            }),
            services
          );
        }
      })($scope.nativeData.Config)),
      ($scope.apply = function() {
        if (!isApMode || confirm(translate('wizard_ap_will_lost'))) {
          checkDeviceModeChange.stop(), $scope.showOverlay(!0);
          var native = $scope.nativeData;
          native.Config.VoIP &&
            native.Config.VoIP.__Skip &&
            delete native.Config.VoIP;
          var somovd = device.profile.nativeToSomovd(native);
          (somovd.KeepDefaultConns = native.KeepDefaultConns),
            'optional' == native.View['Config.SystemPassword.Password'] &&
              '' == $scope.nativeData.Config.SystemPassword.Password &&
              delete somovd.Config.SystemPassword;
          try {
            profiles.apply(somovd, function(res) {
              res.data && res.data.result && res.data.result.duration
                ? (($rootScope.gApplyDuration = res.data.result.duration),
                  $timeout(function() {
                    stepManager.action('apply'), $scope.showOverlay(!1);
                  }, 5e3))
                : (stepManager.action('apply', { error: !0 }),
                  $scope.showOverlay(!1));
            });
          } catch (e) {
            console.log(e);
          }
        }
      }),
      ($scope.customPrevStep = function() {
        dataShare.isSet('ManualProfile')
          ? stepManager.action('prev', { fromManual: !0 })
          : $stateParams.prev
            ? $state.go($stateParams.prev)
            : stepManager.action('prev', {});
      }),
      ($scope.summary = []),
      devinfo.once('version|net').then(function(info) {
        $scope.summary = $scope.compileSummary($scope.nativeData, info);
      });
  },
]);
