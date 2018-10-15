'use strict';
function LANStepController(
  $scope,
  $rootScope,
  manualProfile,
  translate,
  device
) {
  function updateIPv4NetworkRange() {
    if (is.ipv4(IPv4Static.Address) && is.ipv4(IPv4Static.SubnetMask)) {
      var range = device.funcs.ipv4.subnet.getNetworkRange(
        IPv4Static.Address,
        IPv4Static.SubnetMask
      );
      (IPv4DHCP.Server.MinAddress = range.start),
        (IPv4DHCP.Server.MaxAddress = range.end);
    }
  }
  function isDynamic() {
    return 'Dynamic' == profile.$LANStep.IPv4.AdressingType;
  }
  function useDynamicChange() {
    $scope.lanStep.useDynamic
      ? ((profile.$LANStep.IPv4.AddressingMode = 'Dynamic'),
        (IPv4Static.Address = IPv4Static._DefaultAddress),
        (IPv4Static.SubnetMask = IPv4Static._DefaultSubnetMask),
        (IPv4Static.GatewayAddress = ''),
        (IPv4DHCP.Mode = null),
        updateIPv4NetworkRange())
      : ((profile.$LANStep.IPv4.AddressingMode = 'Static'),
        (IPv4DHCP.Mode = 'Disable'),
        (IPv4DHCP.Server.MinAddress = null),
        (IPv4DHCP.Server.MaxAddress = null));
  }
  var is = device.funcs.is,
    profile = manualProfile.profile(),
    IPv4Static = profile.$LANStep.IPv4.StaticIP[1],
    IPv4DHCP = profile.$LANStep.IPv4.DHCP;
  $scope.lanStep = {
    profile: profile,
    IPv4Static: IPv4Static,
    IPv4DHCP: IPv4DHCP,
    useDynamic: isDynamic(),
    isDynamic: isDynamic,
    updateIPv4NetworkRange: updateIPv4NetworkRange,
    useDynamicChange: useDynamicChange,
  };
}
angular.module('wizard').controller('LANStepController', LANStepController),
  (LANStepController.$inject = [
    '$scope',
    '$rootScope',
    'manualProfile',
    'translate',
    'device',
  ]);
