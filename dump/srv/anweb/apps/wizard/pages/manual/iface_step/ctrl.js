'use strict';
function InterfaceStepController(
  $scope,
  $rootScope,
  manualModes,
  manualProfile,
  defaults,
  manualStepApiDispatcher,
  translate,
  constants
) {
  function onInterfaceChange() {
    (profile.$InternetStep.WANType = defaults.$InternetStep
      ? defaults.$InternetStep.WANType || ''
      : ''),
      (profile.$EtherWAN.Port = null),
      (profile.$InterfaceStep.WiFiMode = _.first(
        _.keys($scope.getAvailModes())
      )),
      ($scope.interfaceStep.selectedMethodGroup = selectedMethodGroup()),
      _.size(manualModes) && onDeviceModeChange();
  }
  function onDeviceModeChange() {
    var obj = manualModes[profile.$InterfaceStep.WiFiMode];
    (profile.$DeviceMode.Mode = obj.DeviceMode || null),
      $scope.getMode().applyDefaults(),
      profile.$WiFiStep && $scope.resetSSID();
  }
  function drawAdditionalIfaces() {
    return ['wifi_client', 'usb_modem']
      .filter(function(iface) {
        return _.contains($scope.ifaceTypes, iface);
      })
      .map(function(i) {
        return connMethodInterfaceGroup[i];
      });
  }
  function selectedMethodGroup() {
    return connMethodInterfaceGroup[profile.$InterfaceStep.IfaceType];
  }
  function getIfaceTypes() {
    return _.intersection($scope.ifaceTypes, getModesTypes());
  }
  function getModesTypes() {
    var modes = $scope.getAllAvailModes(),
      ifaces = [];
    return (
      _.each(modes, function(mode) {
        ifaces = ifaces.concat(mode.IfaceType);
      }),
      _.uniq(ifaces)
    );
  }
  function getModeImage(mode) {
    var ifaceType = profile.$InterfaceStep.IfaceType;
    switch (ifaceType) {
      case 'adsl':
      case 'vdsl':
        return modesImages.DSLRouter;
      case 'etherwan':
        return modesImages.Etherwan;
    }
    return modesImages[mode];
  }
  function activate() {
    $scope.interfaceStep.stepActive = !0;
  }
  function deactivate() {
    $scope.interfaceStep.stepActive = !1;
  }
  function needHideIfaceDescription() {
    return 'ethernet' != profile.$InterfaceStep.IfaceType ||
      (constants.DSL_SEPARATED_WAN_PORT && constants.SUPPORT_ETHERWAN)
      ? !1
      : !0;
  }
  var profile = manualProfile.profile(),
    connMethodInterfaceGroup = {
      adsl: 'internet',
      vdsl: 'internet',
      ethernet: 'internet',
      etherwan: 'internet',
      wifi_client: 'wifi',
      wifi_wds: 'wifi',
      usb_modem: 'usb',
    },
    ifaceNotes = {
      usb_modem: 'usb_modem_desc',
      ethernet: 'ethernet_connection_note',
      etherwan: 'etherwan_connection_note',
      adsl: 'adsl_connection_note',
      vdsl: 'vdsl_connection_note',
    },
    modesImages = {
      Router: 'mode_router',
      Etherwan: 'mode_router_etherwan',
      DSLRouter: 'mode_dsl_router',
      WISPRepeater: 'mode_wisp_repeater',
      AP: 'mode_ap',
      Repeater: 'mode_repeater',
      Client: 'mode_client',
      USB: 'mode_usb',
      WDS: 'mode_wds',
    };
  ($scope.interfaceStep = {
    profile: profile,
    stepActive: !1,
    ifaceNotes: ifaceNotes,
    getModeImage: getModeImage,
    getIfaceTypes: getIfaceTypes,
    onInterfaceChange: onInterfaceChange,
    onDeviceModeChange: onDeviceModeChange,
    needHideIfaceDescription: needHideIfaceDescription,
    drawAdditionalIfaces: drawAdditionalIfaces(),
  }),
    manualStepApiDispatcher.get().registerStepApi({
      name: 'InterfaceStep',
      onActivate: activate,
      onLeave: deactivate,
    });
}
angular
  .module('wizard')
  .controller('InterfaceStepController', InterfaceStepController),
  (InterfaceStepController.$inject = [
    '$scope',
    '$rootScope',
    'manualModes',
    'manualProfile',
    'manualDefaults',
    'manualStepApiDispatcher',
    'translate',
    'manualConstants',
  ]);
