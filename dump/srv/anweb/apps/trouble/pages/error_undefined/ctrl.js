'use strict';
angular.module('trouble').controller('errorUndefinedCtrl', [
  '$scope',
  'troubleCheck',
  function($scope, troubleCheck) {
    {
      var data = troubleCheck.getData();
      data.ipv4gw ? data.ipv4gw : data.ipv6gw;
    }
    $scope.errText = 'wizard_trouble_neterr';
  },
]);
