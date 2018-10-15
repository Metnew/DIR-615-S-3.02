'use strict';
function WifiMacEditDialogCtrl($scope, snackbars) {
  var inx = $scope.ngDialogData.inx,
    isNew = ($scope.isNew = $scope.ngDialogData.isNew),
    rule = ($scope.rule = $scope.ngDialogData.rule),
    rules = angular.copy($scope.rules),
    wifiMacFilter = $scope.device.wifiMacFilter;
  ($scope.header = 'wifi_mac_' + (isNew ? 'add' : 'edit')),
    ($scope.save = function() {
      var save = isNew ? wifiMacFilter.add : wifiMacFilter.set.bind(null, inx);
      $scope.wifi_mac_form.$valid &&
        (isNew || wifiMacFilter.cut(inx),
        save(rule),
        $scope.update($scope.closeThisDialog.bind(null, 'saved')));
    }),
    ($scope.uniqueMacValidator = function(mac) {
      function isInCurrentNetwork(checkingRule) {
        return (
          !0 &&
          rule.Network === checkingRule.Network &&
          rule.Band === checkingRule.Band
        );
      }
      function isOtherRule(_, checkingInx) {
        return inx !== checkingInx;
      }
      var curNetworkRules = funo.filter(rules, isInCurrentNetwork),
        otherRules = funo.filter(curNetworkRules, isOtherRule),
        usedMacs = _.map(otherRules, _.property('MAC'));
      _.each(usedMacs, function(elem, inx) {
        usedMacs[inx] = elem.toUpperCase();
      });
      var isMacUsed = ~usedMacs.indexOf(mac.toUpperCase());
      return isMacUsed ? 'wifi_mac_used' : null;
    });
}
