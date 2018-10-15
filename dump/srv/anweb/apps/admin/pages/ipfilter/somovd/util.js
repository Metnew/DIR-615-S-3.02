'use strict';
!(function() {
  function ipfilterUtil(constants, somovd, device, funcs) {
    function pull() {
      function readCb(response) {
        if (!funcs.is.allRPCSuccess(response)) return Promise.reject();
        (ipfilter = response.rq[0].data.ipfilter),
          (lan = converterLan.somovdToNative(response.rq[1].data.iface_names)
            .LAN);
        var input = { BRCM: constants.BRCM, BRIPV6: constants.BRIPV6 };
        return (
          (attributes = converterAttrs(input)),
          (activate = !0),
          Promise.resolve()
        );
      }
      return somovd.read(
        [constants.CONFIG_ID_IPFILTER, constants.CONFIG_ID_WAN_TEMP],
        readCb
      );
    }
    function wasActivate() {
      return activate;
    }
    function removeRules(removeList) {
      function removeCb(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      }
      return (
        _.map(removeList, function(elem) {
          return (elem.id = constants.CONFIG_ID_IPFILTER), elem;
        }),
        somovd.remove(removeList, removeCb)
      );
    }
    function applyRule(rule, index) {
      function writeCb(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      }
      return (
        (index = _.isUndefined(index) ? -1 : index),
        somovd.write(constants.CONFIG_ID_IPFILTER, rule, index, writeCb)
      );
    }
    function makeHelper() {
      return new device.ipfilter.Helper(ipfilter, lan, attributes);
    }
    var ipfilter = null,
      lan = null,
      attributes = null,
      activate = !1,
      converterLan = device.ipfilter.lanConverter,
      converterAttrs = device.ipfilter.attrsConverter;
    return {
      pull: pull,
      wasActivate: wasActivate,
      removeRules: removeRules,
      applyRule: applyRule,
      makeHelper: makeHelper,
    };
  }
  angular
    .module('app')
    .service('ipfilterUtil', [
      'rpcIpfilterConstants',
      'somovd',
      'device',
      'funcs',
      ipfilterUtil,
    ]);
})();
