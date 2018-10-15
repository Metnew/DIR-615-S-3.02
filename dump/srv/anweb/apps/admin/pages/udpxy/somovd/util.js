'use strict';
!(function() {
  function updxyUtil(constants, funcs, device, somovd) {
    function pull() {
      function readCb(response) {
        return funcs.is.RPCSuccess(response)
          ? ((config = response.data.udpxy),
            (config = converter.somovdToNative(config)),
            Promise.resolve())
          : Promise.reject();
      }
      return somovd.read(constants.CONFIG_ID_UDPXY).then(readCb);
    }
    function apply(settings) {
      function writeCb(response) {
        return funcs.is.RPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      }
      var data = converter.nativeToSomovd(settings);
      return somovd.write(
        constants.CONFIG_ID_UDPXY,
        { udpxy: data },
        -1,
        writeCb
      );
    }
    function makeHelper() {
      return new device.udpxy.Helper(config);
    }
    function needIface() {
      return !1;
    }
    var config,
      converter = device.udpxy.converter;
    return {
      pull: pull,
      apply: apply,
      makeHelper: makeHelper,
      needIface: needIface,
    };
  }
  angular
    .module('app')
    .service('udpxyUtil', [
      'udpxyConstants',
      'funcs',
      'device',
      'somovd',
      updxyUtil,
    ]);
})();
