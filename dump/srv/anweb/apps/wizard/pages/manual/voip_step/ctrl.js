'use strict';
function VoIPStepController($scope, $rootScope, manualProfile, translate) {
  function onVoipUseChange() {
    profile.$VoIPStep.Use || manualProfile.clearServices('voip');
  }
  var profile = manualProfile.profile();
  $scope.voipStep = {
    profile: profile,
    onVoipUseChange: onVoipUseChange,
    requiredVID: function() {
      return manualProfile.requiredVID();
    },
    setVOIPService: function(port) {
      var warn = manualProfile.setService(port, 'voip');
      warn &&
        _.defer(function() {
          return alert(translate(warn));
        });
    },
    checkJointVLAN: function() {
      var warn = manualProfile.checkJointVLAN('$VoIPStep');
      warn &&
        _.defer(function() {
          return alert(translate(warn));
        });
    },
    checkJointVPIVCI: function() {
      var warn = manualProfile.checkJointVPIVCI('$VoIPStep');
      warn &&
        _.defer(function() {
          return alert(translate(warn));
        });
    },
  };
}
angular.module('wizard').controller('VoIPStepController', VoIPStepController),
  (VoIPStepController.$inject = [
    '$scope',
    '$rootScope',
    'manualProfile',
    'translate',
  ]);
