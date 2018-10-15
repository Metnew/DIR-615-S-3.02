'use strict';
!(function() {
  angular.module(regdep('trouble-check'), []).service('troubleCheck', [
    'devinfo',
    function(devinfo) {
      function getWANStatus(ports) {
        var etherwan = _.find(ports, function(port) {
          return port.isEtherwan;
        });
        if (etherwan) return etherwan.status > 0;
        var wan = _.find(ports, function(port) {
          return port.isWan;
        });
        return wan && wan.status > 0;
      }
      function isWiFiIface(iface) {
        return _.contains(['wifi', 'wifi24ghz', 'wifi5ghz'], iface);
      }
      function getNextStatus(fn) {
        function query(data) {
          if (data) {
            if (!data) return;
            devinfo.unsubscribe(areas, query), (lastData = data);
            var wanStatus = getWANStatus(data.availPorts),
              gw = {};
            (connNotCreated = !1),
              data && data.ipv4gw
                ? (gw = data.ipv4gw)
                : data && data.ipv6gw
                  ? (gw = data.ipv6gw)
                  : (connNotCreated = !0),
              (status = 'error_undefined'),
              '3g' == gw.contype || 'lte' == gw.contype
                ? ((modemPinStatus = data.dongle.pinStatus),
                  (modemTryLeft = data.dongle.pinTryLeft),
                  data.dongle && data.dongle.status
                    ? 'SIM not inserted' == data.dongle.imsi
                      ? (status = 'error_dongle_sim_not_inserted')
                      : data.dongle.pinStatus && 'ok' != data.dongle.pinStatus
                        ? (status = 'error_dongle_pin')
                        : 'PPPAuthFailed' == gw.status
                          ? (status = 'error_ppp_auth')
                          : 'Connected' == gw.connection_status &&
                            (status = 'connected')
                    : (status = 'error_dongle_not_inserted'))
                : wanStatus || isWiFiIface(gw.ifacetype) || connNotCreated
                  ? connNotCreated
                    ? (status = 'error_conn_not_created')
                    : 'Connected' == gw.connection_status
                      ? (status = 'connected')
                      : 'PPPAuthFailed' == gw.status && wanStatus
                        ? (status = 'error_ppp_auth')
                        : 'PPPNotResponse' == gw.status && wanStatus
                          ? (status = 'error_undefined')
                          : 'DHCPIPNotReceived' == gw.status &&
                            wanStatus &&
                            (status = 'error_dhcp_ip_not_received')
                  : (status = 'error_cable'),
              isWiFiIface(gw.ifacetype) &&
                'WiFiDisconnected' == gw.connection_status &&
                (status = 'error_wifi'),
              console.log('status:', status),
              fn(status);
          }
        }
        devinfo.subscribe(areas, query);
      }
      var areas = 'net|ports|notice|dongle|version',
        lastData = {},
        status = null,
        connNotCreated = null,
        modemPinStatus = null,
        modemTryLeft = null;
      return {
        getNextStatus: getNextStatus,
        getLastStatus: function() {
          return status;
        },
        getData: function() {
          return lastData;
        },
      };
    },
  ]);
})();
