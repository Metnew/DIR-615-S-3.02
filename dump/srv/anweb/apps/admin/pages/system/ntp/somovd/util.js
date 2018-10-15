'use strict';
!(function() {
  function systemNtpUtil(somovd, devinfo, device, funcs) {
    function pull() {
      function success(response) {
        var input = response.data.ntpclient;
        return (config = converter.somovdToDsysinit(input)), Promise.resolve();
      }
      return somovd.read(RPC).then(success);
    }
    function apply(input) {
      var config = converter.dsysinitToSomovd(input);
      return somovd.write(RPC, config).then(function(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      });
    }
    function subscribeTime(cb, $scope) {
      devinfo.subscribe(
        RPC.toString(),
        function(response) {
          if (response && response[RPC.toString()]) {
            var input = converter.somovdToDsysinit(
                response[RPC.toString()].ntpclient
              ),
              time = funcs.fetchBranch(input, paths.time);
            cb && cb(time);
          }
        },
        $scope
      );
    }
    function makeHelper() {
      return new device.systemTime.Helper(config);
    }
    var config = null,
      converter = device.systemTime.converter,
      RPC = device.systemTime.constants.rpc,
      paths = device.systemTime.constants.paths;
    return {
      pull: pull,
      apply: apply,
      subscribeTime: subscribeTime,
      makeHelper: makeHelper,
    };
  }
  angular
    .module('app')
    .service('systemNtpUtil', [
      'somovd',
      'devinfo',
      'device',
      'funcs',
      systemNtpUtil,
    ]);
})();
