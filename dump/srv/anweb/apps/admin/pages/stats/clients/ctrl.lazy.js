'use strict';
angular.module('app').controllerProvider.register('clientStatsCtrl', [
  '$scope',
  'devinfo',
  'funcs',
  'ngDialog',
  'statsClientsUtil',
  function($scope, devinfo, funcs, ngDialog, util) {
    function onInfoLoaded(data) {
      ($scope.clientStats = data), $scope.$emit('pageload');
    }
    util.subscribeInfo(onInfoLoaded, $scope),
      ($scope.showDetails = function(item, key) {
        devinfo.suspend();
        var dlg = ngDialog.open({
          template: 'dialogs/stats/client_stat_details/dialog.tpl.html',
          controller: 'clientStatDetailsCtrl',
          resolve: funcs.getLazyResolve(
            'dialogs/stats/client_stat_details/ctrl.lazy.js',
            'clientStatDetailsCtrl'
          ),
          data: { header: item.ip, model: item },
        });
        dlg.closePromise.then(function() {
          devinfo.resume();
        });
      });
  },
]);
