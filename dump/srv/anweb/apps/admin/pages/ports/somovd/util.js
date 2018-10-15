'use strict';
!(function() {
  function PortSettingsUtil(somovd, device, devinfo, funcs, constants) {
    function pull() {
      function readCb(response) {
        return funcs.is.allRPCSuccess(response)
          ? ((config = response.rq[0].data),
            (__initConfig = config),
            (config = converter.somovdToNative(config)),
            Promise.resolve())
          : Promise.reject();
      }
      return somovd.read([constants.portSettingsRPC], readCb);
    }
    function apply(input) {
      function writeCb(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject(response.error);
      }
      var data = converter.nativeToSomovd(input);
      return somovd.write(constants.portSettingsRPC, data, -1, writeCb);
    }
    function subscribe(cb, $scope) {
      devinfo.subscribe(
        constants.portSettingsRPC.toString(),
        function(response) {
          if (response && response[constants.portSettingsRPC.toString()]) {
            var ports = converter.somovdToNative(
                response[constants.portSettingsRPC.toString()]
              ),
              helper = device.portSettings.Helper(ports);
            (ports = helper.getData()), cb && cb(ports);
          }
        },
        $scope
      );
    }
    function makeHelper() {
      return new device.portSettings.Helper(config);
    }
    var config = null,
      converter = device.portSettings.converter,
      __initConfig = null;
    return {
      pull: pull,
      apply: apply,
      subscribe: subscribe,
      makeHelper: makeHelper,
    };
  }
  angular
    .module('app')
    .service('PortSettingsUtil', [
      'somovd',
      'device',
      'devinfo',
      'funcs',
      'portSettingsConstants',
      PortSettingsUtil,
    ]);
})();
