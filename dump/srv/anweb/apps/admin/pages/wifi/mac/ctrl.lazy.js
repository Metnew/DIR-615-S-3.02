'use strict';
!(function() {
  function wifiMacCtrl($scope, translate, snackbars, ngDialog) {
    function getFilterPrototype() {
      var band = Object.keys($scope.networks)[0],
        network = Object.keys($scope.networks[band].List)[0];
      return {
        Enable: !0,
        MAC: '',
        Hostname: '',
        Band: band,
        Network: network,
      };
    }
    function update(cb) {
      function pushCb(err) {
        return err
          ? void snackbars.add('rpc_write_error')
          : (snackbars.add('rpc_write_success'), void pull(cb));
      }
      push(pushCb);
    }
    function pull(cb) {
      wifiMacFilter.pull(function() {
        var data = wifiMacFilter.data();
        console.log(JSON.stringify(data, null, 4)),
          ($scope.networks = data.Networks),
          ($scope.rules = data.Rules),
          ($scope.maxRulesCount = data.MaxRulesCount),
          cb && cb(),
          ($scope.isReady = !0);
      });
    }
    function push(cb) {
      wifiMacFilter.push(cb);
    }
    function openDialog(item, inx, isNew) {
      ngDialog.open({
        template: 'dialogs/wifi_mac_edit/dialog.tpl.html',
        className: 'wifi_mac_edit_dialog',
        controller: WifiMacEditDialogCtrl,
        data: { rule: item || getFilterPrototype(), inx: inx, isNew: isNew },
        scope: $scope,
      });
    }
    function openNetworkDialog(inx, band) {
      ngDialog.open({
        template: 'dialogs/wifi_mac_edit_network/dialog.tpl.html',
        className: 'wifi_mac_edit_network_dialog',
        controller: WifiMacEditNetworkDialogCtrl,
        data: { inx: inx, band: band },
        scope: $scope,
      });
    }
    var device = $scope.device,
      wifiMacFilter = device.wifiMacFilter,
      macModes = ['allow', 'deny'];
    pull($scope.$emit.bind($scope, 'pageload')),
      ($scope.isReady = !1),
      ($scope.macModes = macModes),
      ($scope.update = update),
      ($scope.isEmptyRules = function() {
        return !$scope.rules || 0 === _.size($scope.rules);
      }),
      ($scope.isEmptyNetwork = function() {
        return !$scope.networks || 0 === _.size($scope.networks);
      }),
      ($scope.isMoreThanOneBand = function() {
        return _.size($scope.networks) > 1;
      }),
      ($scope.getNetworkShort = function(network) {
        return translate(network.AccessPolicy);
      }),
      ($scope.isRuleOfDisabledNetwork = function(rule) {
        return !$scope.networks[rule.Band].List[rule.Network].Enable;
      }),
      ($scope.add = function() {
        if (
          !$scope.maxRulesCount ||
          _.size($scope.rules) < $scope.maxRulesCount
        )
          openDialog(null, -1, !0);
        else {
          var msgMaxRules = translate('wifi_mac_max_rules_message').replace(
            /<MAX_RULES>/,
            $scope.maxRulesCount
          );
          alert(msgMaxRules);
        }
      }),
      ($scope.edit = function(item, inx) {
        openDialog(angular.copy($scope.rules[inx]), inx, !1);
      }),
      ($scope.remove = function(items, keys) {
        keys.forEach(wifiMacFilter.cut), $scope.update();
      }),
      ($scope.editNetwork = function(item, inx, band) {
        openNetworkDialog(inx, band);
      });
  }
  angular
    .module('app')
    .controllerProvider.register('wifiMacCtrl', [
      '$scope',
      'translate',
      'snackbars',
      'ngDialog',
      wifiMacCtrl,
    ]);
})();
