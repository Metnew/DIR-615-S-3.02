'use strict';
angular.module('trouble').controller('failedCtrl', [
  '$scope',
  'troubleCheck',
  function($scope, troubleCheck) {
    ($scope.data = troubleCheck.getData()),
      ($scope.status = troubleCheck.getLastStatus()),
      ($scope.showPhoneAndMail = !0),
      ($scope.mfilter = function(mail) {
        return mail.replace(/<|>/g, '');
      }),
      ($scope.params = (function(data, status) {
        var conn = data.ipv4gw ? data.ipv4gw : data.ipv6gw,
          username = conn ? conn.username : null,
          password = conn ? conn.password : null,
          mac = conn ? conn.mac : null;
        return [
          { name: 'wizard_smr_model', value: data.modelName },
          { name: 'wizard_smr_software_version', value: data.version },
          { name: 'wizard_hw_revision', value: data.hwRevision },
          { name: 'wizard_smr_mac', value: mac },
          { name: 'wizard_pppoe_username', value: username },
          { name: 'wizard_pppoe_password', value: password },
        ];
      })($scope.data, $scope.status));
  },
]);
