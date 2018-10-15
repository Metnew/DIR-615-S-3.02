'use strict';
!(function() {
  function macFilterUtil(somovd, devinfo, device, funcs, consts) {
    function getConfig() {
      return config;
    }
    function getAttrs() {
      return null;
    }
    function pull() {
      function success(response) {
        if (!funcs.is.allRPCSuccess(response[0])) return Promise.reject();
        var macfilter = response[0].rq[0]
            ? response[0].rq[0].data.macfilter
            : null,
          ifaces = response[0].rq[1]
            ? response[0].rq[1].data.iface_names
            : null,
          client = response[1] ? response[1].client : null;
        return (
          (config = converter.somovdToNative({
            macfilter: macfilter,
            ifaces: ifaces,
            client: client,
          })),
          (__initMacfilter = funcs.deepClone(macfilter)),
          Promise.resolve()
        );
      }
      var rpcs = [consts.CONFIG_ID_MAC_FILTER];
      return Promise.all([somovd.read(rpcs), devinfo.once('client')]).then(
        success
      );
    }
    function applyConfig(changed) {
      var helper = makeHelper(),
        macfilter = converter.nativeToSomovd(changed),
        somovdRequests = helper.makeSomovdRequests(macfilter, __initMacfilter);
      return somovd.multi(somovdRequests);
    }
    function makeHelper() {
      return new Helper();
    }
    var config = null,
      __initMacfilter = null,
      Helper = device.macfilter.Helper,
      converter = device.macfilter.converter;
    return {
      getConfig: getConfig,
      getAttrs: getAttrs,
      pull: pull,
      applyConfig: applyConfig,
      makeHelper: makeHelper,
    };
  }
  angular
    .module('app')
    .service('macFilterUtil', [
      'somovd',
      'devinfo',
      'device',
      'funcs',
      'macfilterConstants',
      macFilterUtil,
    ]);
})();
