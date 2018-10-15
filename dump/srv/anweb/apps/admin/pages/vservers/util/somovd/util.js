'use strict';
!(function() {
  function vserversUtil(somovd, devinfo, device, funcs, attrs, consts) {
    function getConfig() {
      return angular.copy(config);
    }
    function getAttrs() {
      return (
        consts.SUPPORT_NAT_LOOPBACK || delete attrs.SNAT, angular.copy(attrs)
      );
    }
    function pull() {
      function success(response) {
        if (!funcs.is.allRPCSuccess(response)) return Promise.reject();
        var input = {
          vserver: response.rq[0].data.vserver,
          httpaccess: _.has(response.rq[1].data, 'httpaccess')
            ? response.rq[1].data.httpaccess
            : response.rq[1].data,
          ifaces: response.rq[2].data,
          tr69: response.rq[3].data,
        };
        return (
          consts.SUPPORTED_VOIP &&
            (input.voip = _.has(response.rq[4].data, 'VoiceService')
              ? response.rq[4].data.VoiceService[1].VoiceProfile[1].SIP
              : response.rq[4].data),
          (config = converter.somovdToNative(input)),
          (__initVservers = funcs.deepClone(input.vserver)),
          Promise.resolve()
        );
      }
      var rpcs = [
        consts.CONFIG_ID_DSL_VSERVERS,
        consts.CONFIG_ID_HTTPACCESS,
        consts.CONFIG_ID_WAN_TEMP,
        consts.CONFIG_ID_TR69,
      ];
      return (
        consts.SUPPORTED_VOIP && rpcs.push(constants.CONFIG_ID_VOIP),
        somovd.read(rpcs).then(success)
      );
    }
    function removeRules(indexes) {
      function removeCb(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      }
      function makeRemoveList(indexes) {
        return (
          (indexes = indexes.sort().reverse()),
          _.map(indexes, function(index) {
            return {
              id: consts.CONFIG_ID_DSL_VSERVERS,
              data: __initVservers[index],
              pos: index,
            };
          })
        );
      }
      var removeList = makeRemoveList(indexes);
      return somovd.remove(removeList, removeCb), Promise.resolve();
    }
    function applyRule(rule, index) {
      function writeCb(response) {
        return (
          funcs.is.RPCSuccess(response) || Promise.reject(), Promise.resolve()
        );
      }
      var convertRules = converter.nativeToSomovd({ Rules: [rule] });
      return convertRules && 0 != convertRules.length
        ? somovd.write(
            consts.CONFIG_ID_DSL_VSERVERS,
            convertRules[0],
            _.isUndefined(index) ? -1 : index,
            writeCb
          )
        : Promise.reject();
    }
    function isSupported(name) {
      var attrs = getAttrs();
      return !!funcs.fetchBranch(attrs, name + '.');
    }
    function makeHelper() {
      return new Helper();
    }
    var config = null,
      __initVservers = null,
      Helper = device.vservers.Helper,
      converter = device.vservers.converter;
    return {
      getConfig: getConfig,
      getAttrs: getAttrs,
      pull: pull,
      removeRules: removeRules,
      applyRule: applyRule,
      isSupported: isSupported,
      makeHelper: makeHelper,
    };
  }
  angular
    .module('app')
    .service('vserversUtil', [
      'somovd',
      'devinfo',
      'device',
      'funcs',
      'vserversAttributes',
      'vserversConstants',
      vserversUtil,
    ]);
})();
