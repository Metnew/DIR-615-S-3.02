'use strict';
!(function(params) {
  angular.module('wizard').factory('manualProfile', [
    '$rootScope',
    'devinfo',
    'dataShare',
    'translate',
    'funcs',
    'manualConstants',
    'manualDefaults',
    function(
      $rootScope,
      devinfo,
      dataShare,
      translate,
      funcs,
      constants,
      defaults
    ) {
      function init() {
        var profileDefaults = {
          $Support: {},
          $InterfaceStep: { IfaceType: '', WiFiMode: '' },
          $InternetStep: {
            WANType: '',
            Username: '',
            Password: '',
            Origin: 'AutoConfigured',
            ServiceName: '',
            Mac: '',
            DialNumber: '',
            APN: '',
            CloneMac: !1,
            UseVLAN: !1,
            VID: null,
            VPI: '',
            VCI: '',
          },
          $EtherWAN: { Port: null },
          $WifiClientStep: { ConnectMode: 'select' },
          $WiFiWdsStep: {
            Mode: 'Repeater',
            EncryptionType: 'None',
            EncryptionKey: '',
            Mac: { 1: '', 2: '', 3: '', 4: '' },
          },
          $LANStep: {
            IPv4: {
              AddressingMode: 'Static',
              DHCP: {
                Mode: 'Disable',
                Server: { MinAddress: null, MaxAddress: null },
              },
              StaticIP: { 1: { Address: null, SubnetMask: null } },
            },
          },
          $WiFiStep: {
            2.4: {
              Enable: !0,
              EnableBroadcast: !0,
              SSID: 'WiFi',
              PSK: '',
              WithoutPass: !1,
              GuestAP: !1,
              GuestSSID: 'WiFi-Guest',
              GuestPSK: '',
              GuestWithoutPass: !0,
            },
            5: {
              Enable: !0,
              EnableBroadcast: !0,
              SSID: 'WiFi5',
              PSK: '',
              WithoutPass: !1,
              GuestAP: !1,
              GuestSSID: 'WiFi5-Guest',
              GuestPSK: '',
              GuestWithoutPass: !0,
            },
          },
          $IPTVStep: { Use: !1, UseVID: !1, VID: null, VPI: null, VCI: null },
          $VoIPStep: { Use: !1, UseVID: !1, VID: null, VPI: null, VCI: null },
          $PasswordStep: { Login: $rootScope.gAuth.username, Password: '' },
          $SystemLanguage: { Language: translate.getLang() },
          $Groups: { lan: [], wifi: [] },
          $RemoteUpdate: { Enable: !0 },
          $DeviceMode: { Mode: null },
        };
        return (
          funcs.deepExtend(profileDefaults, defaults),
          (_profile = dataShare.setIfEmpty('ManualProfile', profileDefaults))
        );
      }
      function clean() {
        dataShare.remove('ManualProfile'), (_profile = null);
      }
      function getProfile() {
        return _profile;
      }
      function getService(portName) {
        var found = _.find(_profile.$Groups.lan, function(port) {
          return portName == port.name;
        });
        return found ? found.service : void 0;
      }
      function setService(port, service) {
        var found = _.find(_profile.$Groups.lan, function(__port) {
          return port.name == __port.name;
        });
        if (found) {
          if (_profile.$EtherWAN.Port && _profile.$EtherWAN.Port == port.name)
            return null;
          if (port.management) return 'wizard_port_mgm_warn';
          found.service = found.service == service ? '' : service;
        }
      }
      function clearServices(service) {
        _.each(_profile.$Groups.lan, function(port) {
          port.service == service && (port.service = '');
        });
      }
      function equalVlanId(stepOne, stepTwo) {
        if (
          _.contains([stepOne, stepTwo], '$InternetStep') &&
          constants.SAME_VLAN_WAN_BRIDGE
        )
          return !1;
        var stepUseVlan = {
          $InternetStep: _profile.$InternetStep.UseVLAN,
          $VoIPStep: _profile.$VoIPStep.Use && _profile.$VoIPStep.UseVID,
          $IPTVStep: _profile.$IPTVStep.Use && _profile.$IPTVStep.UseVID,
        };
        return (
          stepUseVlan[stepOne] &&
          stepUseVlan[stepTwo] &&
          _profile[stepOne].VID &&
          _profile[stepTwo].VID &&
          _profile[stepOne].VID === _profile[stepTwo].VID
        );
      }
      function checkJointVLAN(step) {
        return equalVlanId(step, '$InternetStep') &&
          !constants.SAME_VLAN_WAN_BRIDGE
          ? 'wizard_tag_used'
          : equalVlanId('$IPTVStep', '$VoIPStep')
            ? 'wizard_joint_vlan'
            : void 0;
      }
      function equalVPIVCI(stepOne, stepTwo) {
        return (
          _profile[stepOne].VPI === _profile[stepTwo].VPI &&
          _profile[stepOne].VCI === _profile[stepTwo].VCI
        );
      }
      function checkJointVPIVCI(step) {
        return equalVPIVCI(step, '$InternetStep')
          ? 'wizard_tag_used_dsl'
          : equalVPIVCI('$IPTVStep', '$VoIPStep')
            ? 'wizard_joint_vlan'
            : void 0;
      }
      function setVIDEnable(is) {
        _.each(['$IPTVStep', '$VoIPStep'], function(step) {
          _profile[step] && (_profile[step].UseVID = is);
        });
      }
      function requiredVID() {
        return _profile.$InternetStep.UseVLAN && _profile.$Support.withoutWanU;
      }
      function isWDSMode(mode) {
        return (
          'WDS' == _profile.$InterfaceStep.WiFiMode &&
          _profile.$WiFiWdsStep.Mode == mode
        );
      }
      var _profile = null;
      return {
        init: init,
        profile: getProfile,
        clean: clean,
        setService: setService,
        getService: getService,
        clearServices: clearServices,
        equalVlanId: equalVlanId,
        checkJointVLAN: checkJointVLAN,
        isWDSMode: isWDSMode,
        equalVPIVCI: equalVPIVCI,
        checkJointVPIVCI: checkJointVPIVCI,
        setVIDEnable: setVIDEnable,
        requiredVID: requiredVID,
      };
    },
  ]);
})();
