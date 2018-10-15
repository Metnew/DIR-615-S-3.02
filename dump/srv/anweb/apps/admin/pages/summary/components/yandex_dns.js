'use strict';
!(function() {
  function SummaryYandexDnsService(device) {
    function get() {
      function getDeviceCountString(count) {
        var residual = count % 10,
          label = '';
        return (
          (0 == residual || (residual >= 5 && 9 >= residual)) &&
            (label = 'from_five_to_nine_devices'),
          1 == residual && (label = 'one_device'),
          residual >= 2 &&
            4 >= residual &&
            (label = 'from_two_to_four_devices'),
          label
        );
      }
      function updateModesInfo() {
        var settings = yandexRules.getSettings(),
          clients = yandexRules.getClients(),
          inModeDeviceCount = function(mode) {
            var inMode = _.filter(clients, function(client) {
              return (
                (!!client.rule && client.rule.mode == mode) ||
                (!client.rule && settings['default'] == mode)
              );
            });
            return inMode.length;
          };
        (modesInfo.safe.devicesCount = inModeDeviceCount('safe')),
          (modesInfo.safe.devicesString = getDeviceCountString(
            modesInfo.safe.devicesCount
          )),
          (modesInfo.child.devicesCount = inModeDeviceCount('child')),
          (modesInfo.child.devicesString = getDeviceCountString(
            modesInfo.child.devicesCount
          )),
          (modesInfo.off.devicesCount = inModeDeviceCount('off')),
          (modesInfo.off.devicesString = getDeviceCountString(
            modesInfo.off.devicesCount
          ));
      }
      function yandexHandler(response, areas) {
        if (response) {
          var areaParts = areas.split('|'),
            areasData = [];
          _.each(areaParts, function(area) {
            areasData.push(response[area]);
          }),
            yandexRules.setFromDevinfoResponse(areasData),
            updateModesInfo(),
            (yandexInfo.settings = yandexRules.getSettings());
        }
      }
      function updateSettings() {
        updateModesInfo(), saveYandexSettings();
      }
      function toggleYandexDns() {
        saveYandexSettings();
      }
      function saveYandexSettings() {
        yandexSettings.setConfig(yandexInfo.settings), yandexSettings.push();
      }
      function turnUnsafeToDefault() {
        if (yandexInfo.settings.enabled) {
          var rules = yandexRules.getRules();
          _.each(
            rules,
            function(rule) {
              'off' == rule.mode && (rule.mode = this.settings['default']);
            },
            yandexInfo
          ),
            yandexRules.setRules(rules),
            updateModesInfo(),
            yandexRules.push();
        }
      }
      if (yandexInfo) return yandexInfo;
      var yandexRules = device.yandexDns.rules,
        yandexSettings = device.yandexDns.settings,
        availabelModes = yandexSettings.getAvailableModes(),
        modesInfo = {
          safe: { label: _.findWhere(availabelModes, { value: 'safe' }).label },
          child: {
            label: _.findWhere(availabelModes, { value: 'child' }).label,
          },
          off: { label: _.findWhere(availabelModes, { value: 'off' }).label },
        };
      return (yandexInfo = {
        settings: yandexRules.getSettings(),
        modesInfo: modesInfo,
        modesList: _.keys(modesInfo),
        toggleYandexDns: toggleYandexDns,
        updateSettings: updateSettings,
        saveYandexSettings: saveYandexSettings,
        turnUnsafeToDefault: turnUnsafeToDefault,
        getDeviceCountString: getDeviceCountString,
        area: yandexRules.getAreas(),
        devinfoHandler: yandexHandler,
      });
    }
    var yandexInfo = null;
    return { get: get };
  }
  angular.module('app').factory('summaryYandexDns', SummaryYandexDnsService),
    (SummaryYandexDnsService.$inject = ['device']);
})();
