'use strict';
!(function() {
  function ddnsUtil(constants, funcs, device, somovd) {
    function pull() {
      function readCb(response) {
        if (!funcs.is.allRPCSuccess(response)) return Promise.reject();
        var input = {
          ddns: response.rq[0].data.ddns,
          ifaces: response.rq[1].data.iface_names,
          services: constants.services,
          needChooseIface: constants.needChooseIface,
        };
        return (
          (config = converter.somovdToNative(input)),
          (activate = !0),
          Promise.resolve()
        );
      }
      return somovd.read([constants.ddns, constants.ifaces], readCb);
    }
    function makeHelper() {
      return new device.ddns.Helper(config);
    }
    function wasActivate() {
      return activate;
    }
    function apply(settings, index) {
      var data = converter.nativeToSomovd(settings);
      return somovd.write(constants.ddns, data, index).then(function(response) {
        return funcs.is.RPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      });
    }
    function remove(items, keys) {
      function getRemoveList() {
        return keys
          .sort()
          .reverse()
          .map(keysMapper);
      }
      function keysMapper(key) {
        return { id: constants.ddns, pos: key, data: {} };
      }
      function removeCb(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      }
      return somovd.remove(getRemoveList()).then(removeCb);
    }
    var config = {},
      activate = !1,
      converter = device.ddns.converter;
    return {
      pull: pull,
      apply: apply,
      makeHelper: makeHelper,
      remove: remove,
      wasActivate: wasActivate,
    };
  }
  angular
    .module('app')
    .service('ddnsUtil', [
      'ddnsConstants',
      'funcs',
      'device',
      'somovd',
      ddnsUtil,
    ]);
})();
