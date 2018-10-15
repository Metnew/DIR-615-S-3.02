'use strict';
!(function() {
  function StatsRoutingUtil(somovd, device, devinfo, funcs, constants) {
    function pull() {
      function readCb(response) {
        return funcs.is.allRPCSuccess(response)
          ? ((config = response.rq[0].data), Promise.resolve())
          : Promise.reject();
      }
      return somovd.read([constants.rpc], readCb);
    }
    function subscribeInfo(cb, $scope) {
      devinfo.subscribe(
        constants.rpc.toString(),
        function(response) {
          response &&
            response[constants.rpc.toString()] &&
            cb &&
            cb(response[constants.rpc.toString()]);
        },
        $scope
      );
    }
    function needTable() {
      return !1;
    }
    function makeHelper() {
      return new device.statsRouting.Helper(config);
    }
    var config = null;
    return {
      pull: pull,
      subscribeInfo: subscribeInfo,
      needTable: needTable,
      makeHelper: makeHelper,
    };
  }
  angular
    .module('app')
    .service('StatsRoutingUtil', [
      'somovd',
      'device',
      'devinfo',
      'funcs',
      'statsRoutingConstants',
      StatsRoutingUtil,
    ]);
})();
