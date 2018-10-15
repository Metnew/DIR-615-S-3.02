'use strict';
!(function() {
  function WanFlagsCtrl($scope, $state, translate, device, helper) {
    function makeSupported(type) {
      var base = supported.flags(type);
      return (
        (base.IGMP = base.IGMP && !core.mode.isAdvancedMode()),
        (base.MLD = base.MLD && !core.mode.isAdvancedMode()),
        base
      );
    }
    function isUnavailableFlag(flag) {
      return helper.flags.unavailableFlag(flag, connection, type, inx);
    }
    var supported = device.wan.supported(),
      type = $state.params.type,
      inx = $state.params.inx,
      connection = $scope.wan.model.connection,
      core = $scope.wanCore;
    ($scope.flagsInfo = helper.flags.getAllInfo()),
      ($scope.flags = {
        data: connection.Flags,
        supported: makeSupported(type),
        unavailable: {},
      }),
      $scope.flags.data &&
        _.each($scope.flagsInfo, function(flag) {
          ($scope.flags.unavailable[flag.name] = {}),
            $scope.$watchCollection(
              function() {
                return {
                  unavailable: isUnavailableFlag(flag.name),
                  flag: flag.name,
                };
              },
              function(obj) {
                var name = obj.flag;
                obj.unavailable
                  ? (($scope.flags.unavailable[name].oldData = angular.copy(
                      $scope.flags.data[name]
                    )),
                    ($scope.flags.data[name] = !1))
                  : _.has($scope.flags.unavailable[name], 'oldData') &&
                    (($scope.flags.data[name] = angular.copy(
                      $scope.flags.unavailable[name].oldData
                    )),
                    delete $scope.flags.unavailable[name].oldData);
              }
            );
        });
  }
  angular
    .module('app')
    .controller('WanFlagsCtrl', [
      '$scope',
      '$state',
      'translate',
      'device',
      'wanHelper',
      WanFlagsCtrl,
    ]);
})();
