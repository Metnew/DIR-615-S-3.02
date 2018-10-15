'use strict';
angular.module('app').controllerProvider.register('routingStatsCtrl', [
  '$scope',
  'StatsRoutingUtil',
  'devinfo',
  'funcs',
  'ngDialog',
  function($scope, util, devinfo, funcs, ngDialog) {
    function init() {
      function success() {
        (helper = util.makeHelper()),
          onInfoLoaded(helper.getData()),
          util.subscribeInfo(onInfoLoaded, $scope);
      }
      util.pull().then(success);
    }
    function onInfoLoaded(data) {
      ($scope.routingStats = data), $scope.$emit('pageload');
    }
    var helper;
    init(),
      ($scope.getDestString = function(item) {
        return helper.getDestString(item);
      }),
      ($scope.showDetails = function(item, key) {
        devinfo.suspend();
        var dlg = ngDialog.open({
          template: 'dialogs/stats/route_stat_details/dialog.tpl.html',
          controller: 'routeStatDetailsCtrl',
          resolve: funcs.getLazyResolve(
            'dialogs/stats/route_stat_details/ctrl.lazy.js',
            'routeStatDetailsCtrl'
          ),
          data: { model: item },
        });
        dlg.closePromise.then(function() {
          devinfo.resume();
        });
      }),
      ($scope.needTable = function() {
        return util.needTable();
      });
  },
]);
