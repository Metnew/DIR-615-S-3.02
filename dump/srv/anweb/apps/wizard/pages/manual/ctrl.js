'use strict';
angular.module('wizard').controller('wizardManualCtrl', [
  '$scope',
  '$rootScope',
  'funcs',
  '$state',
  '$controller',
  'translate',
  'manualModes',
  'manualProfile',
  'manualBuilder',
  'devinfo',
  '$timeout',
  'dataShare',
  'dongle',
  'device',
  '$stateParams',
  'stepManager',
  'manualStepApiDispatcher',
  'manualConstants',
  function(
    $scope,
    $rootScope,
    funcs,
    $state,
    $controller,
    translate,
    manualModes,
    manualProfile,
    manualBuilder,
    devinfo,
    $timeout,
    dataShare,
    dongle,
    device,
    $stateParams,
    stepManager,
    manualStepApiDispatcher,
    constants
  ) {
    function buildSteps(stepsList) {
      return _.map(stepsList, function(step) {
        var createGetter = function(prop) {
          return function() {
            return _.result(step, prop);
          };
        };
        return _.extend({}, step, {
          skip: createGetter('skip'),
          nextDisabled: createGetter('nextDisabled'),
          error: createGetter('error'),
          controller: _.isFunction(window[step.controller])
            ? window[step.controller]
            : function() {},
          dummyCtrl: !_.isFunction(window[step.controller]),
        });
      });
    }
    function isSkiped(name) {
      var step = _.find($scope.steps, function(s) {
        return s.name == name;
      });
      return step && step.skip && step.skip();
    }
    function getMode(mode) {
      var modes = {
        OPEN: 'None',
        'WEP-64': 'WEP-64',
        'WEP-128': 'WEP-128',
        WPAPSK: 'WPA-Personal',
        WPA2PSK: 'WPA2-Personal',
        WPAPSKWPA2PSK: 'WPA-WPA2-Personal',
        WPA: 'WPA-Enterprise',
        WPA2: 'WPA2-Enterprise',
        WPA1WPA2: 'WPA-WPA2-Enterprise',
      };
      return modes[mode];
    }
    ($scope.constants = constants), ($scope.support = {});
    var firstStart = !manualProfile.profile(),
      profile = manualProfile.init(),
      isDSL = ($scope.isDSL = $rootScope.gIsDSL),
      isATM = ($scope.isATM = function() {
        return isDSL && 'adsl' == profile.$InterfaceStep.IfaceType;
      }),
      isEtherwan = (($scope.isPTM = function() {
        return isDSL && 'vdsl' == profile.$InterfaceStep.IfaceType;
      }),
      ($scope.isEtherwan = function() {
        return 'etherwan' == profile.$InterfaceStep.IfaceType;
      })),
      isUSBModem = (($scope.isEthernet = function() {
        return 'ethernet' == profile.$InterfaceStep.IfaceType;
      }),
      ($scope.isUSBModem = function() {
        return 'usb_modem' == profile.$InterfaceStep.IfaceType;
      }));
    ($scope.vlanIDMin = constants.vlanIDMin),
      ($scope.ifaceTypes = constants.ifaceTypes),
      ($scope.supportWiFiClient = _.contains(
        constants.ifaceTypes,
        'wifi_client'
      )),
      ($scope.needShowNotification = !1),
      console.log('profile', profile);
    var steps = [
      {
        template: '/wizard/pages/manual/iface_step/page.tpl.html',
        controller: 'InterfaceStepController',
        name: 'InterfaceStep',
        nextDisabled: function() {
          return !profile.$InterfaceStep.IfaceType;
        },
        skip: function() {
          return 1 == $scope.ifaceTypes.length;
        },
      },
      {
        template: '/wizard/pages/manual/etherwan_step/page.tpl.html',
        controller: 'EtherwanStepController',
        name: 'EtherwanStep',
        nextDisabled: function() {
          return !profile.$EtherWAN.Port;
        },
        skip: function() {
          return !isEtherwan();
        },
      },
      {
        template: '/wizard/pages/manual/usb_modem_step/page.tpl.html',
        controller: 'UsbModemStepController',
        name: 'UsbModemStep',
        nextDisabled: function() {
          return (
            !dongle.state() ||
            _.contains(
              [
                'intersected_subnet',
                'wait_dongle',
                'wait_sim',
                'wait_pin',
                'wait_create',
                'wan_failed',
                'sim_is_blocked',
              ],
              dongle.state()
            )
          );
        },
        skip: function() {
          return 'usb_modem' != profile.$InterfaceStep.IfaceType;
        },
      },
      {
        template: '/wizard/pages/manual/wds_step/page.tpl.html',
        controller: 'WiFiWDSStepController',
        name: 'WiFiWDSStep',
        skip: function() {
          return 'WDS' != profile.$InterfaceStep.WiFiMode;
        },
      },
      {
        template: '/wizard/pages/manual/lan_step/page.tpl.html',
        controller: 'LANStepController',
        name: 'LANStep',
        skip: function() {
          return !_.contains(
            ['AP', 'Repeater', 'Client', 'WDS'],
            profile.$InterfaceStep.WiFiMode
          );
        },
      },
      {
        template: '/wizard/pages/manual/wifi_client_step/page.tpl.html',
        controller: 'WiFiClientStepController',
        name: 'WiFiClientStep',
        nextDisabled: function() {
          return !profile.$WifiClientStep.SSID;
        },
        skip: function() {
          return (
            'wifi_client' != profile.$InterfaceStep.IfaceType ||
            'WDS' == profile.$InterfaceStep.WiFiMode
          );
        },
      },
      {
        template: '/wizard/pages/manual/internet_step/page.tpl.html',
        controller: 'InternetStepController',
        name: 'InternetStep',
        nextDisabled: function() {
          return !profile.$InternetStep.WANType;
        },
        skip: function() {
          return (
            $scope.isDevModeAP() ||
            ('usb_modem' == profile.$InterfaceStep.IfaceType &&
              'wan_created' == dongle.state())
          );
        },
      },
      {
        template: '/wizard/pages/manual/wifi_step/page.tpl.html',
        controller: 'WiFi24StepController',
        name: 'WiFiStep',
        skip: function() {
          return (
            'Client' === profile.$InterfaceStep.WiFiMode ||
            manualProfile.isWDSMode('Bridge')
          );
        },
      },
      {
        template: '/wizard/pages/manual/wifi_step/page.tpl.html',
        controller: 'WiFiStep5Controller',
        name: 'WiFi5GStep',
        skip: function() {
          return (
            'Client' === profile.$InterfaceStep.WiFiMode ||
            manualProfile.isWDSMode('Bridge') ||
            !$rootScope.rootIsSupport5G
          );
        },
      },
      {
        template: '/wizard/pages/manual/iptv_step/page.tpl.html',
        controller: 'IPTVStepController',
        name: 'IPTVStep',
        error: function() {
          return isATM() &&
            manualProfile.equalVPIVCI('$IPTVStep', '$InternetStep')
            ? translate('wizard_tag_used_dsl')
            : !isATM() &&
              manualProfile.equalVlanId('$IPTVStep', '$InternetStep')
              ? translate('wizard_tag_used')
              : null;
        },
        nextDisabled: function() {
          var iptvPort = _.find(profile.$Groups.lan, function(port) {
            return 'iptv' == port.service;
          });
          return profile.$IPTVStep.Use && !iptvPort;
        },
        skip: function() {
          return $scope.isDevModeAP() || isUSBModem();
        },
      },
      {
        template: '/wizard/pages/manual/voip_step/page.tpl.html',
        controller: 'VoIPStepController',
        name: 'VoIPStep',
        error: function() {
          return isATM() &&
            manualProfile.equalVPIVCI('$VoIPStep', '$InternetStep')
            ? translate('wizard_tag_used_dsl')
            : !isATM() &&
              manualProfile.equalVlanId('$VoIPStep', '$InternetStep')
              ? translate('wizard_tag_used')
              : null;
        },
        nextDisabled: function() {
          var voipPort = _.find(profile.$Groups.lan, function(port) {
            return 'voip' == port.service;
          });
          return profile.$VoIPStep.Use && !voipPort;
        },
        skip: function() {
          return $scope.isDevModeAP() || isUSBModem();
        },
      },
      {
        template: '/wizard/pages/manual/password_step/page.tpl.html',
        controller: 'PasswordStepController',
        name: 'PasswordStep',
        nextDisabled: function() {
          return !_.size(profile.$PasswordStep.Password);
        },
      },
    ];
    ($scope.steps = buildSteps(steps)),
      ($scope.stepsApiContainer = manualStepApiDispatcher.get($scope)),
      dataShare.remove('FoundRegion'),
      ($scope.infoLoading = !0),
      devinfo.init({ need_auth: !0 }),
      devinfo
        .once('wifi|wifi_general|client|ports|version|notice|net')
        .then(function(data) {
          if (firstStart) {
            if (data.needChangeSSID24)
              var devMac = '-' + data.deviceMac.replace(/:/g, '').slice(-4);
            else var devMac = '';
            (profile.$LANStep.IPv4.StaticIP[1].Address = data.lan[0].ip),
              (profile.$LANStep.IPv4.StaticIP[1]._DefaultAddress = _.clone(
                profile.$LANStep.IPv4.StaticIP[1].Address
              )),
              (profile.$LANStep.IPv4.StaticIP[1].SubnetMask = data.lan[0].mask),
              (profile.$LANStep.IPv4.StaticIP[1]._DefaultSubnetMask = _.clone(
                profile.$LANStep.IPv4.StaticIP[1].SubnetMask
              )),
              data.wifi
                ? ((profile.$WifiClientStep.SeparateClient = !!data.wifi
                    .supportSeparateClient),
                  (profile.$WiFiStep[2.4].WithoutPass =
                    'OPEN' == data.wifi.authMode),
                  (profile.$WiFiStep[2.4].SSID =
                    (data.wifi.ssid || '') + devMac),
                  (profile.$WiFiStep[2.4].OriginSSID =
                    profile.$WiFiStep[2.4].SSID),
                  (profile.$WiFiStep[2.4].PSK = data.wifi.WPAPSK || ''),
                  (profile.$WiFiStep[2.4].OriginPSK =
                    profile.$WiFiStep[2.4].PSK),
                  (profile.$WiFiStep[2.4].GuestSSID =
                    (data.wifi.ssid || '') + devMac + '_Guest'),
                  (profile.$WiFiStep[2.4].supportGuestAccess = !!data.wifi
                    .supportGuestAccess),
                  (profile.$WiFiStep[2.4].supportGuestNet =
                    data.wifi.guestNetMax > 1),
                  data.needChangeSSID24 &&
                    (profile.$WiFiStep[2.4].defaultSSID = data.wifi.ssid),
                  (profile.$WiFiStep[2.4].GuestMaxAssociatedDevices =
                    data.wifi_general.f24.MaxStaNum),
                  (profile.$WiFiStep[2.4].supportMaxAssociatedDevices = !_.isUndefined(
                    data.wifi_general.f24.MaxStaNum
                  )),
                  (profile.$WiFiStep[2.4].modeAvailable =
                    data.wifi_general.f24.modeAvailable),
                  (profile.$WiFiStep[2.4].wirelessMode =
                    data.wifi_general.f24.wirelessMode),
                  (profile.$WiFiStep[2.4].DefaultSecurityMode = getMode(
                    data.wifi_general.f24.authMode
                  )),
                  _.isUndefined(data.wifi_general.f24.BwRestrict) ||
                    (profile.$WiFiStep[2.4].GuestBandwidthRestricted = {
                      value: data.wifi_general.f24.BwRestrict / 1024,
                      enable: 0 != data.wifi_general.f24.BwRestrict,
                      min: 1,
                      max: 150,
                    }),
                  $rootScope.rootIsSupport5G
                    ? ((profile.$WiFiStep[5].WithoutPass =
                        'OPEN' == data.wifi['5G_authMode']),
                      (profile.$WiFiStep[5].SSID =
                        (data.wifi['5G_ssid'] || '') + devMac),
                      (profile.$WiFiStep[5].OriginSSID =
                        profile.$WiFiStep[5].SSID),
                      (profile.$WiFiStep[5].PSK = data.wifi.WPAPSK || ''),
                      (profile.$WiFiStep[5].GuestSSID =
                        (data.wifi['5G_ssid'] || '') + devMac + '_Guest'),
                      (profile.$WiFiStep[5].UseOldSettings = !1),
                      (profile.$WiFiStep[5].supportGuestAccess = !!data.wifi
                        .supportGuestAccess),
                      (profile.$WiFiStep[5].supportGuestNet =
                        data.wifi.guestNetMax > 1),
                      data.needChangeSSID5 &&
                        (profile.$WiFiStep[5].defaultSSID =
                          data.wifi['5G_ssid']),
                      (profile.$WiFiStep[5].GuestMaxAssociatedDevices =
                        data.wifi_general.f24.MaxStaNum),
                      (profile.$WiFiStep[5].supportMaxAssociatedDevices = !_.isUndefined(
                        data.wifi_general.f24.MaxStaNum
                      )),
                      (profile.$WiFiStep[5].modeAvailable =
                        data.wifi_general.f5.modeAvailable),
                      (profile.$WiFiStep[5].wirelessMode =
                        data.wifi_general.f5.wirelessMode),
                      (profile.$WiFiStep[5].DefaultSecurityMode = getMode(
                        data.wifi_general.f24.authMode
                      )),
                      _.isUndefined(data.wifi_general.f5.BwRestrict) ||
                        (profile.$WiFiStep[5].GuestBandwidthRestricted = {
                          value: data.wifi_general.f5.BwRestrict / 1024,
                          enable: 0 != data.wifi_general.f5.BwRestrict,
                          min: 1,
                          max: 450,
                        }))
                    : delete profile.$WiFiStep[5])
                : delete profile.$WiFiStep,
              (profile.$InternetStep.Mac = data.client.mac),
              data.wifi &&
                ($rootScope.gWifiChangeTest = manualBuilder.build(
                  profile
                ).Config.WiFi);
          }
          var client = data.client,
            ports = data.availPorts,
            hasManagamentPort = _.findWhere(ports, { management: !0 });
          !_.isEmpty(client) &&
          'LAN' == client.name &&
          _.isUndefined(hasManagamentPort)
            ? ($scope.needShowNotification = !0)
            : _.isEmpty(client) &&
              _.isUndefined(hasManagamentPort) &&
              ($scope.needShowNotification = !0),
            ($scope.data = data),
            ($scope.infoLoading = !1);
        }),
      ($scope.interfaceInfo = {
        ethernet: {
          wanTypes: [
            'pppoe',
            'statip',
            'dynip',
            'statipv6',
            'dynipv6',
            'pppoev6',
            'dynpppoe',
            'pppoedual',
            'statpppoe',
            'dynpptp',
            'statpptp',
            'dynl2tp',
            'statl2tp',
          ],
          name:
            constants.DSL_SEPARATED_WAN_PORT && constants.SUPPORT_ETHERWAN
              ? 'ethernet_wan_conn'
              : 'wired_connection',
        },
        wifi_client: {
          wanTypes: [
            'pppoe',
            'statip',
            'dynip',
            'statipv6',
            'dynipv6',
            'pppoev6',
            'dynpppoe',
            'pppoedual',
            'statpppoe',
            'dynpptp',
            'statpptp',
            'dynl2tp',
            'statl2tp',
          ],
          name: 'wifi',
        },
        usb_modem: {
          wanTypes: function() {
            var dongleInfo = dongle.info(),
              modemType = dongleInfo ? dongleInfo.actualMode : null;
            return _.isString(modemType) && '3g' == modemType.toLowerCase()
              ? ['3g']
              : ['3g', 'lte'];
          },
          name: 'usb_modem',
          type: 'wireless_connection',
        },
        optical_fiber: {
          wanTypes: [
            'pppoe',
            'statip',
            'dynip',
            'statipv6',
            'dynipv6',
            'pppoev6',
            '3g',
            'dynpppoe',
            'pppoedual',
            'statpppoe',
            'dynpptp',
            'statpptp',
            'dynl2tp',
            'statl2tp',
          ],
          name: 'optical_fiber',
          type: 'wired_connection',
        },
        adsl: {
          wanTypes: [
            'pppoe',
            'statip',
            'dynip',
            'statipv6',
            'dynipv6',
            'pppoev6',
            'dynpppoe',
            'pppoedual',
            'statpppoe',
            'dynpptp',
            'statpptp',
            'dynl2tp',
            'statl2tp',
            'pppoa',
            'ipoa',
          ],
          name: 'adsl_connection',
        },
        vdsl: {
          wanTypes: [
            'pppoe',
            'statip',
            'dynip',
            'statipv6',
            'dynipv6',
            'pppoev6',
            'dynpppoe',
            'pppoedual',
            'statpppoe',
            'dynpptp',
            'statpptp',
            'dynl2tp',
            'statl2tp',
          ],
          name: 'vdsl_connection',
        },
        etherwan: {
          wanTypes: [
            'pppoe',
            'statip',
            'dynip',
            'statipv6',
            'dynipv6',
            'pppoev6',
            'dynpppoe',
            'pppoedual',
            'statpppoe',
            'dynpptp',
            'statpptp',
            'dynl2tp',
            'statl2tp',
          ],
          name: 'ethernet_lan_conn',
        },
      }),
      firstStart
        ? 1 == $scope.ifaceTypes.length
          ? ((profile.$InterfaceStep.IfaceType = $scope.ifaceTypes[0]),
            ($scope.step = _.find($scope.steps, function(obj) {
              return 'InternetStep' == obj.name;
            })))
          : (dongle.cleanInfo(), ($scope.step = _.first($scope.steps)))
        : ($scope.step = _.last($scope.steps)),
      $scope.stepsApiContainer.setCurrentStepApi($scope.step.name),
      $scope.$on('$destroy', function() {
        $scope.showAvailOverlay(!0);
      }),
      ($scope.nextDisabled = function() {
        return $scope.step.nextDisabled();
      }),
      ($scope.isDevModeAP = function() {
        var mode = manualModes[profile.$InterfaceStep.WiFiMode];
        return mode && 'ap' == mode.DeviceMode;
      }),
      ($scope.isShowModes = function() {
        var modes = $scope.getAvailModes();
        return !modes.USB && _.size(modes);
      }),
      ($scope.isDisableModes = function() {
        return _.size($scope.getAvailModes()) < 2;
      }),
      ($scope.getAvailModes = function() {
        return funo.filter($scope.getAllAvailModes(), function(mode) {
          return mode.IfaceType.indexOf(profile.$InterfaceStep.IfaceType) >= 0;
        });
      }),
      ($scope.getAllAvailModes = function() {
        return funo.filter(manualModes, function(mode) {
          return (
            !$rootScope.devMode.devmode_hw_switch_support ||
            $rootScope.devMode.device_mode === mode.DeviceMode
          );
        });
      }),
      ($scope.getMode = function() {
        var mod = manualModes[profile.$InterfaceStep.WiFiMode];
        return {
          isAvailIface: function(ifaceType) {
            return mod.IfaceType == ifaceType;
          },
          isDisabled: function(flag) {
            return mod && mod.Disabled[flag];
          },
          applyDefaults: function() {
            mod &&
              profile.$WiFiStep &&
              (_.extend(profile.$WiFiStep[2.4], mod.Defaults),
              $rootScope.rootIsSupport5G &&
                _.extend(profile.$WiFiStep[5], mod.Defaults));
          },
        };
      }),
      ($scope.resetSSID = function() {
        (profile.$WiFiStep[2.4].SSID = _.clone(
          profile.$WiFiStep[2.4].OriginSSID
        )),
          $rootScope.rootIsSupport5G &&
            (profile.$WiFiStep[5].SSID = _.clone(
              profile.$WiFiStep[5].OriginSSID
            ));
      }),
      ($scope.restoreWifi = function(freq) {
        function restore() {
          var isOpen = 'NONE' == mbssid.EncrypType;
          (profile.$WiFiStep[freq].SSID = mbssid.SSID),
            (profile.$WiFiStep[freq].PSK = mbssid.WPAPSK),
            (profile.$WiFiStep[freq].WithoutPass = isOpen);
        }
        function needShow() {
          return (
            profile.$WiFiStep[freq] &&
            mbssid.SSID.length &&
            mbssid.WPAPSK.length
          );
        }
        function isDisabled() {
          var isSsidEqual = profile.$WiFiStep[freq].SSID == mbssid.SSID,
            isPskEqual = profile.$WiFiStep[freq].PSK == mbssid.WPAPSK;
          return isSsidEqual && isPskEqual;
        }
        var mbssid,
          keys = { 2.4: 'mbssid', 5: '5G_mbssid' },
          key = keys[freq],
          mbssidStr = sessionStorage.getItem(key);
        try {
          return (
            (mbssid = JSON.parse(mbssidStr)[0]),
            { restore: restore, needShow: needShow, isDisabled: isDisabled }
          );
        } catch (e) {
          return {
            restore: function() {},
            needShow: function() {
              return !1;
            },
            isDisabled: function() {
              return !0;
            },
          };
        }
      }),
      ($scope.changeStepTo = function(name) {
        ($scope.step = _.find($scope.steps, function(obj) {
          return obj.name == name;
        })),
          $scope.stepsApiContainer.setCurrentStepApi($scope.step.name);
      }),
      ($scope.nextStep = function() {
        ($scope.applyed = !0),
          $timeout(function() {
            $scope.$emit('goToErrorForm', !0);
            var stepIndex = $scope.steps.indexOf($scope.step),
              error = $scope.step.error();
            if (
              (error && alert(error), !error && $scope.manualStepForm.$valid)
            ) {
              for (
                var nextStep = null, i = stepIndex;
                i < $scope.steps.length - 1;
                i++
              )
                if (
                  $scope.steps[i + 1] &&
                  !$scope.steps[i + 1].dummyCtrl &&
                  !$scope.steps[i + 1].skip()
                ) {
                  nextStep = $scope.steps[i + 1];
                  break;
                }
              if (nextStep)
                $scope.scrollToTop(),
                  ($scope.step = nextStep),
                  $scope.stepsApiContainer.setCurrentStepApi($scope.step.name);
              else
                try {
                  console.log('manual profile origin', profile);
                  var profileClone = JSON.parse(JSON.stringify(profile));
                  console.log('manual profile prepared', profileClone);
                  var isUSBModem =
                      'usb_modem' == profileClone.$InterfaceStep.IfaceType,
                    isCableConnect = !_.contains(
                      ['usb_modem', 'wifi_client'],
                      profileClone.$InterfaceStep.IfaceType
                    );
                  isSkiped('EtherwanStep') && delete profileClone.$EtherWAN,
                    isSkiped('WiFiWDSStep') && delete profileClone.$WiFiWdsStep,
                    isSkiped('LANStep') && delete profileClone.$LANStep,
                    ($rootScope.nativeData = manualBuilder.build(profileClone)),
                    isUSBModem &&
                      'wan_created' == dongle.state() &&
                      delete $rootScope.nativeData.Config.WAN,
                    console.log(
                      'manual native profile:',
                      $rootScope.nativeData
                    ),
                    console.log(
                      'manual somovd:',
                      device.profile.nativeToSomovd($rootScope.nativeData)
                    ),
                    manualStepApiDispatcher.clean(),
                    stepManager.action('next', {
                      cable: isCableConnect,
                      isAP: $scope.isDevModeAP(),
                    });
                } catch (e) {
                  console.log('manual error', e);
                }
            }
          });
      }),
      ($scope.prevStep = function() {
        $timeout(function() {
          for (
            var stepIndex = $scope.steps.indexOf($scope.step),
              prevStep = null,
              i = stepIndex;
            i >= 0;
            i--
          )
            if (
              $scope.steps[i - 1] &&
              !$scope.steps[i - 1].dummyCtrl &&
              !$scope.steps[i - 1].skip()
            ) {
              prevStep = $scope.steps[i - 1];
              break;
            }
          0 > stepIndex ||
            (prevStep
              ? ($scope.scrollToTop(),
                ($scope.step = prevStep),
                $scope.stepsApiContainer.setCurrentStepApi($scope.step.name))
              : (manualProfile.clean(),
                manualStepApiDispatcher.clean(),
                stepManager.action('prev')));
        });
      }),
      $scope.$watch('step', function() {
        $scope.applyed = !1;
      });
    var stopWatch = $scope.$watch('rootAvailPorts', function(ports) {
      ports &&
        !_.size(profile.$Groups.lan) &&
        ((profile.$Groups = {
          lan: _.map($rootScope.rootLANPorts, function(port) {
            return { name: port.name, service: '' };
          }),
          wifi: _.map($rootScope.rootWIFIPorts, function(port) {
            return { name: port.name, service: '' };
          }),
        }),
        $rootScope.rootWANPort &&
          (profile.$__internetPort = $rootScope.rootWANPort.name),
        stopWatch());
    });
  },
]);
