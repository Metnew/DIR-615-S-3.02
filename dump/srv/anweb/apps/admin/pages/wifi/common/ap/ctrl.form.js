'use strict';
!(function() {
  function WifiAPForm($scope, $state, device, shared) {
    function activate() {
      ($scope.loading = !0),
        shared.activate().then(function() {
          ($scope.loading = !1),
            device.wifi.setBandFreq(freq),
            ($scope.wifi.isActivate = !0);
          var wds = device.wifi.getWDSData();
          ($scope.wifi.isWDSInBridgeMode = wds && 'Bridge' == wds.Mode),
            $scope.$emit('pageload');
        });
    }
    function apply() {
      isFormInvalid() || shared.apply('ap', freq);
    }
    function wasModified() {
      return (
        $scope.wifi.isActivate && $scope.wifi.ap && $scope.wifi.ap.isChange()
      );
    }
    function isAdd() {
      return 'add' === action;
    }
    function isFormInvalid() {
      return $scope.form.$invalid;
    }
    var action = $state.current.name.split('.').pop(),
      freq = $state.params.freq;
    ($scope.wifi = {
      isActivate: !1,
      isWDSInBridgeMode: !1,
      apply: apply,
      wasModified: wasModified,
      isAdd: isAdd,
    }),
      activate();
  }
  angular
    .module('app')
    .controller('WifiAPForm', [
      '$scope',
      '$state',
      'device',
      'wifiCommonShared',
      WifiAPForm,
    ]);
})();
