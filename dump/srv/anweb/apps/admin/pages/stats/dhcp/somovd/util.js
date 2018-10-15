'use strict';
!(function() {
  function StatsDHCPUtil(somovd, device, devinfo, funcs, constants) {
    function pull() {
      function readCb(response) {
        return funcs.is.allRPCSuccess(response) ? void 0 : Promise.reject();
      }
      return somovd.read([constants.rpc], readCb);
    }
    function subscribeInfo(cb, $scope) {
      devinfo.onceAndSubscribe(
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
    function makeHelper() {
      return new device.statsDHCP.Helper(config);
    }
    var config = null;
    return { pull: pull, subscribeInfo: subscribeInfo, makeHelper: makeHelper };
  }
  angular
    .module('app')
    .service('StatsDHCPUtil', [
      'somovd',
      'device',
      'devinfo',
      'funcs',
      'statsDHCPConstants',
      StatsDHCPUtil,
    ]);
})();
