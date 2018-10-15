'use strict';
function IPTVStepController($scope, $rootScope, manualProfile, translate) {
  function onIptvStepUseChange() {
    profile.$IPTVStep.Use || manualProfile.clearServices('iptv');
  }
  var profile = manualProfile.profile();
  $scope.iptvStep = {
    profile: profile,
    onIptvStepUseChange: onIptvStepUseChange,
    requiredVID: function() {
      return manualProfile.requiredVID();
    },
    setIPTVService: function(port) {
      var warn = manualProfile.setService(port, 'iptv');
      warn &&
        _.defer(function() {
          return alert(translate(warn));
        });
    },
    checkJointVLAN: function() {
      var warn = manualProfile.checkJointVLAN('$IPTVStep');
      warn &&
        _.defer(function() {
          return alert(translate(warn));
        });
    },
    checkJointVPIVCI: function() {
      var warn = manualProfile.checkJointVPIVCI('$IPTVStep');
      warn &&
        _.defer(function() {
          return alert(translate(warn));
        });
    },
  };
}
angular.module('wizard').controller('IPTVStepController', IPTVStepController),
  (IPTVStepController.$inject = [
    '$scope',
    '$rootScope',
    'manualProfile',
    'translate',
  ]);
