'use strict';
!(function() {
  function wanMode(anwebStorage, device, $q, devinfo) {
    function init() {
      function onData(res) {
        storage = anwebStorage.make(
          'wanMode-' + res.modelId + '-' + res.buildDate
        );
        var storAdvanced = storage.get(key),
          isAdvancedConf = isAdvancedConfig();
        storAdvanced === !1 && isAdvancedConf
          ? (storage.set(warningKey, !0), (isAdvanced = !0))
          : (isAdvanced = _.isBoolean(storAdvanced)
              ? storAdvanced
              : isAdvancedConf);
      }
      return devinfo.once('version').then(onData);
    }
    function setAdvanced(value) {
      value || storage.set(warningKey, !1),
        storage.set(key, value),
        (isAdvanced = value);
    }
    function isAdvancedConfig() {
      function makeTypeStr(obj) {
        var dataModel = device.wan.getDataModelName(obj.type);
        return _.contains(
          gateways,
          'Device.WAN.' + dataModel + '.Connection.' + obj.instance + '.'
        )
          ? obj.type + '@gw'
          : obj.type;
      }
      var gateways = [
          device.wan.getDefaultGateway('v4'),
          device.wan.getDefaultGateway('v6'),
        ],
        conns = device.wan.flattenConnections(),
        types = _.map(conns, makeTypeStr),
        list = [
          ['ipv4oa@gw'],
          ['ipv4oe@gw'],
          ['ipv6oe@gw'],
          ['pppoe@gw', 'ipv4oe'],
          ['pptp@gw', 'ipv4oe'],
          ['pptp'],
          ['pppoe@gw'],
          ['pppoa@gw'],
          ['pppoev6@gw'],
          ['pppoeDual@gw'],
          ['3g@gw'],
          ['lte@gw'],
          ['bridge'],
        ];
      return (
        conns.length &&
        !_.some(list, function(obj) {
          return _.isEqual(obj.sort(), types.sort());
        })
      );
    }
    function isAdvancedMode() {
      return isAdvanced;
    }
    function isForcedChange() {
      return storage && storage.get(warningKey);
    }
    function isSupport() {
      return device.wan.isDefined('BR2_PACKAGE_ANWEB_WAN_SIMPLE_MODE');
    }
    var key = 'useAdvancedPage',
      warningKey = 'useAdvancedPageWarning',
      isAdvanced = !0,
      storage = null;
    return {
      init: init,
      setAdvanced: setAdvanced,
      isAdvancedConfig: isAdvancedConfig,
      isAdvancedMode: isAdvancedMode,
      isForcedChange: isForcedChange,
      isSupport: isSupport,
    };
  }
  angular
    .module('app')
    .service('wanMode', ['anwebStorage', 'device', '$q', 'devinfo', wanMode]);
})();
