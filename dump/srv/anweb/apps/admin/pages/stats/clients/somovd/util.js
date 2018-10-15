'use strict';
!(function() {
  function statsClientsUtil(funcs, device, somovd, devinfo, constants) {
    function subscribeInfo(cb, $scope) {
      function prepareData(response) {
        if (response && response[constants.rpc]) {
          var data = response[constants.rpc];
          cb && cb(data);
        }
      }
      devinfo.subscribe(constants.rpc.toString(), prepareData, $scope);
    }
    return { subscribeInfo: subscribeInfo };
  }
  angular
    .module('app')
    .service('statsClientsUtil', [
      'funcs',
      'device',
      'somovd',
      'devinfo',
      'statsClientsConstants',
      statsClientsUtil,
    ]);
})();
