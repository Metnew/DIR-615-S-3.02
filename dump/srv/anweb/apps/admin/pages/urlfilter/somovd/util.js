'use strict';
!(function() {
  function urlfilterUtil(constants, somovd, device, funcs) {
    function pull() {
      function readCb(response) {
        if (!funcs.is.allRPCSuccess(response)) return Promise.reject();
        var rq = response.rq;
        return (
          (config = rq[0].data.urlsettings
            ? rq[0].data.urlsettings
            : rq[0].data),
          (list = funcs.deepClone(rq[1].data)),
          Promise.resolve()
        );
      }
      return somovd.read(
        [
          constants.rpc.CONFIG_ID_GET_URLF_CONFIG,
          constants.rpc.CONFIG_ID_GET_URL_LIST,
        ],
        readCb
      );
    }
    function push(settings) {
      function getRequests(settings) {
        var write = [],
          remove = [];
        settings.write &&
          _.each(settings.write, function(elem) {
            elem.config && write.push(getConfigRequest(elem.config)),
              elem.list && (write = write.concat(getListRequest(elem.list)));
          }),
          settings.remove &&
            (remove = remove.concat(getListRequest(settings.remove)));
        var result = {};
        return (
          write.length && (result.write = write),
          remove.length && (result.remove = remove),
          result
        );
      }
      function getConfigRequest(config) {
        return {
          id: constants.rpc.CONFIG_ID_GET_URLF_CONFIG,
          data: config,
          pos: -1,
        };
      }
      function getListRequest(settings) {
        var listsRequest = settings;
        return (
          _.map(listsRequest, function(list) {
            return (list.id = constants.rpc.CONFIG_ID_GET_URL_LIST), list;
          }),
          listsRequest
        );
      }
      var requests = getRequests(settings);
      return somovd.multi(requests, !1, function(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : Promise.reject();
      });
    }
    function makeHelper() {
      return new device.urlfilter.Helper(config, list);
    }
    function needPrepareSettings() {
      return !0;
    }
    var config = null,
      list = null;
    return {
      pull: pull,
      push: push,
      makeHelper: makeHelper,
      needPrepareSettings: needPrepareSettings,
    };
  }
  angular
    .module('app')
    .service('urlfilterUtil', [
      'rpcUrlfilterConstants',
      'somovd',
      'device',
      'funcs',
      urlfilterUtil,
    ]);
})();
