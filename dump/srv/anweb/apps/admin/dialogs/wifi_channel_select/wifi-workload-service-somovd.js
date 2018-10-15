'use strict';
!(function() {
  var config = {
    wifiWorkloadRpc: { '2.4GHz': '199', '5GHz': '241' },
    wifiChannelsRpc: '37',
  };
  angular.module('app').factory('wifiWorkloadService', [
    '$q',
    'devinfo',
    function($q, devinfo) {
      function getInfo(band) {
        var wifiWorkloadRpc = config.wifiWorkloadRpc[band],
          wifiChannelsRpc = config.wifiChannelsRpc;
        return devinfo
          .once(wifiWorkloadRpc + '|' + wifiChannelsRpc, { timeout: 6e4 })
          .then(function(response) {
            var output = {};
            return (
              response[wifiWorkloadRpc] &&
                (output.workload = response[wifiWorkloadRpc]),
              response[wifiChannelsRpc] &&
                (output.channels =
                  '5GHz' == band
                    ? response[wifiChannelsRpc]['5G_ChannelList']
                    : response[wifiChannelsRpc].ChannelList),
              output
            );
          });
      }
      return { getInfo: getInfo };
    },
  ]);
})();
