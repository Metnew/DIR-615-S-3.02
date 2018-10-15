'use strict';
!(function() {
  function lanIPChangeService(
    location,
    devinfo,
    somovd,
    funcs,
    $timeout,
    storageService
  ) {
    function isChange() {
      return storage.get('isSaveConfigAfterChange') && __isChangeIP();
    }
    function getNewIP() {
      return storage.get('newIP');
    }
    function clear() {
      storage.clearAll();
    }
    function __init() {
      function pull() {
        function hasIP(result) {
          return result && result.lan && result.lan.length && result.lan[0].ip;
        }
        devinfo.skipAuth.once('net|notice').then(function(result) {
          if (!hasIP(result)) return void $timeout(pull, 3e3);
          var oldIP = storage.get('oldIP'),
            ip = result.lan[0].ip,
            systemNotice = result.systemNotice;
          oldIP && oldIP != ip
            ? (storage.set('newIP', ip),
              storage.set(
                'isSaveConfigAfterChange',
                'NeedSave' != systemNotice &&
                  'NeedSaveAndReboot' != systemNotice
              ))
            : (storage.set('newIP', ''),
              storage.set('isSaveConfigAfterChange', !1));
        });
      }
      var host = location.host();
      storage.set('oldIP', funcs.is.ipv4(host) ? host : ''),
        somovd.subscribe(
          'write',
          { id: constants.CONFIG_ID_WAN_TEMP },
          __checkChangeIP
        ),
        somovd.subscribe(
          'cmd',
          { id: constants.CMD_SAVE_AND_REBOOT },
          __checkSaveConfig
        ),
        somovd.subscribe(
          'cmd',
          { id: constants.CMD_SAVE_CONFIG },
          __checkSaveConfig
        ),
        pull();
    }
    function __checkChangeIP(error, result) {
      function hasChangeLAN(data) {
        return data && data.br0 && data.br0.services.br0;
      }
      function getLANIP(data) {
        return data.br0.services.br0.ip;
      }
      if (!error && funcs.is.RPCSuccess(result)) {
        var data = result.request.params.data;
        hasChangeLAN(data) && storage.set('newIP', getLANIP(data));
      }
    }
    function __checkSaveConfig(error, result) {
      !error &&
        funcs.is.RPCSuccess(result) &&
        storage.set('isSaveConfigAfterChange', __isChangeIP() ? !0 : !1);
    }
    function __isChangeIP() {
      var oldIP = storage.get('oldIP'),
        newIP = storage.get('newIP');
      return oldIP && newIP && oldIP != newIP;
    }
    var storage = storageService.make('lan-ip-change');
    return __init(), { isChange: isChange, getNewIP: getNewIP, clear: clear };
  }
  var constants = {
      CONFIG_ID_WAN_TEMP: 1,
      CMD_SAVE_AND_REBOOT: 8,
      CMD_SAVE_CONFIG: 20,
    },
    lanIPChangeModule = angular.module(regdep('lanIPChange'), [
      'device',
      'devinfo',
      'anweb-storage',
    ]);
  lanIPChangeModule.service('lanIPChange', [
    '$location',
    'devinfo',
    'somovd',
    'funcs',
    '$timeout',
    'anwebStorage',
    lanIPChangeService,
  ]);
})();
