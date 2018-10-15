'use strict';
!(function() {
  function miscUtil(somovd, device, funcs, constants) {
    function pull() {
      function readCb(response) {
        rpcs.forEach(function(rpc, inx) {
          config[rpc.key] = response.rq[inx].data;
        }),
          constants.IGMP &&
            (config.igmpFn = {
              name: config.igmp.enable
                ? 2 === config.igmp.version
                  ? 'IGMPv2'
                  : 'IGMPv3'
                : 'off',
            }),
          constants.MLD &&
            (config.mldFn = {
              name:
                config.mld && config.mls.enabled
                  ? config.mldOptions[config.mld.version + 1]
                  : 'off',
            }),
          constants.PPPOE_PASS_THROUGH_OVER_IFACE &&
            (config.ifaces = getPassThroughIfaces(
              config.ifaceList.iface_names
            ));
      }
      function getNum(rpc) {
        return rpc.num;
      }
      return somovd.read(rpcs.map(getNum), readCb);
    }
    function getConfig() {
      return config ? config : '';
    }
    function apply(settings) {
      function writeCb(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      }
      function listMap(rpc) {
        return { id: rpc.num, data: settings[rpc.key], pos: -1 };
      }
      return somovd.write(rpcs.map(listMap), !1, writeCb);
    }
    var config = {},
      rpcs = [];
    return (
      constants.IGMP &&
        rpcs.push({ key: 'igmp', num: constants.CONFIG_ID_IGMP }),
      constants.MLD && rpcs.push({ key: 'mld', num: constants.CONFIG_ID_MLD }),
      constants.NET_FILTER &&
        rpcs.push({ key: 'netfilter', num: constants.CONFIG_ID_NETFILTER }),
      constants.PPPOE_PASS_THROUGH &&
        rpcs.push({
          key: 'passThrough',
          num: constants.CONFIG_ID_PPPOE_PASS_THROUGH,
        }),
      constants.PPPOE_PASS_THROUGH_OVER_IFACE &&
        rpcs.push({
          key: 'ifacesList',
          num: constants.CONFIG_ID_WAN_IFACES_LIST,
        }),
      constants.SUPPORT_RLX_QOS &&
        rpcs.push({ key: 'rlxIptvQos', num: constants.CONFIG_ID_RLX_IPTV_QOS }),
      { pull: pull, apply: apply, getConfig: getConfig }
    );
  }
  angular
    .module('app')
    .service('miscUtil', [
      'somovd',
      'device',
      'funcs',
      'miscConstants',
      miscUtil,
    ]);
})();
