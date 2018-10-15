'use strict';
!(function() {
  function wanReservationUtil(device, somovd, funcs) {
    function pull() {
      return somovd.read([210, 1], function(response) {
        if (!funcs.is.allRPCSuccess(response)) return Promise.reject();
        var input = { 210: response.rq[0].data, 1: response.rq[1].data };
        return (config = converter.somovdToNative(input)), Promise.resolve();
      });
    }
    function apply(config) {
      var input = converter.nativeToSomovd(config);
      return (
        input.enable || (input = _.pick(input, 'enable')),
        somovd.write(210, input, -1).then(function(response) {
          return funcs.is.RPCSuccess(response)
            ? Promise.resolve()
            : Promise.reject();
        })
      );
    }
    function getConfig() {
      return config;
    }
    function makeHelper() {
      return new Helper();
    }
    var config = null,
      converter = device.wanReservation.converter,
      Helper = device.wanReservation.constructor;
    return {
      pull: pull,
      apply: apply,
      getConfig: getConfig,
      makeHelper: makeHelper,
      needCheckGw: !0,
    };
  }
  angular
    .module('app')
    .service('wanReservationUtil', [
      'device',
      'somovd',
      'funcs',
      wanReservationUtil,
    ]);
})();
