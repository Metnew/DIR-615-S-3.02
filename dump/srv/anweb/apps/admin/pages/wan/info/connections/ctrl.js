'use strict';
!(function() {
  function WanInfoConnectionsCtrl($scope, $state, translate, helper, $timeout) {
    function clean() {
      connections.list.length = 0;
    }
    function make(raws) {
      function addRaw(conn) {
        var actualType = helper.connection.identifyActualType(
            conn.data,
            conn.type
          ),
          statusInfo = _.partial(getStatusInfo, conn.type, conn.instance),
          iface = helper.media.buildInterface(conn.data);
        connections.list.push({
          name: conn.data.Name,
          inx: conn.instance,
          type: conn.type,
          iface: iface,
          actualType: actualType,
          status: statusInfo,
          rows: makeRows(conn.type, conn.instance, iface),
        });
      }
      function makeRows(type, instance, iface) {
        function Origin(value) {
          var keys = {
            AutoConfigured: 'wanIPv6AutoConfigured',
            AutoConfiguredByDHCPv6: 'wanIPv6AutoConfiguredByDHCPv6',
            AutoConfiguredBySlaac: 'wanIPv6AutoConfiguredBySlaac',
            AutoConfiguredByDHCPv6PD: 'wanIPv6AutoConfiguredByDHCPv6PD',
          };
          return translate(keys[value]);
        }
        function isPPTP(type) {
          return 'pptp' == type;
        }
        var data = helper.connection.getConnection(type, instance);
        if (!data) return [];
        var rows = [
          { name: 'iface', value: translate(iface.info) },
          {
            name: 'wanPppUsername',
            value: data.Username,
            hide: !data.Username,
          },
          {
            name: 'wanIPv6OriginMethod',
            value: Origin(data.Origin),
            hide: 'Static' == data.Origin || !data.Origin,
          },
        ];
        return (
          data.StaticIPAddress0
            ? rows.push({ name: 'wanAddress', value: data.StaticIPAddress0 })
            : data.StaticIPv6Address0
              ? rows.push({
                  name: 'wanAddress',
                  value: data.StaticIPv6Address0,
                })
              : 'pppoeDual' == type
                ? (data.IPAddress &&
                    rows.push({ name: 'wanAddress', value: data.IPAddress }),
                  data.IPv6Address &&
                    rows.push({
                      name: 'wanIPv6Address',
                      value: data.IPv6Address,
                    }))
                : data.IPAddress
                  ? rows.push({ name: 'wanAddress', value: data.IPAddress })
                  : data.IPv6Address &&
                    rows.push({ name: 'wanAddress', value: data.IPv6Address }),
          (rows = rows.concat([
            {
              name: 'wanIPv6Prefix',
              value: data.StaticIPPrefix0,
              hide: !data.StaticIPPrefix0,
            },
            {
              name: 'wanNetmask',
              value: data.StaticIPSubnetMask0,
              hide: !data.StaticIPSubnetMask0,
            },
            {
              name: 'wanNetmask',
              value: data.SubnetMask,
              hide: !data.SubnetMask || data.StaticIPSubnetMask0,
            },
            {
              name: isPPTP(type) ? 'wanVPNServiceName' : 'wanServiceName',
              value: data.ServiceName,
              hide: !data.ServiceName,
            },
            {
              name: 'wanGatewayIP',
              value: data.GatewayIPAddress,
              hide: !data.GatewayIPAddress || 'ipv6oe' == type,
            },
            {
              name: 'wanAuthenticationProtocol',
              value: data.AuthenticationProtocol,
              hide: !data.AuthenticationProtocol,
            },
          ])),
          data.Flags &&
            (rows = rows.concat([
              {
                name: 'IGMP',
                value: translate(data.Flags.IGMP ? 'on' : 'off'),
                hide: 'ipv4oe' != type,
              },
              {
                name: 'MLD',
                value: translate(data.Flags.MLD ? 'on' : 'off'),
                hide: 'ipv6oe' != type || !supported.mld(),
              },
            ])),
          rows
        );
      }
      clean(), _.each(raws, addRaw), (connections.isMakeList = !0);
    }
    function isEmpty() {
      return 0 == this.list.length;
    }
    function isSingle() {
      return 1 == this.list.length;
    }
    function getMiniTableStatusInfo(item) {
      var statusInfo = item.status();
      return (
        '<status-info\n                        status="' +
        statusInfo.status +
        '"\n						on="' +
        statusInfo.statusText +
        '"\n                        off="' +
        statusInfo.statusText +
        '"\n                        pending="' +
        statusInfo.statusText +
        '"\n                        >\n                    </status-info>'
      );
    }
    function getStatusInfo(type, inx) {
      function isLoading() {
        return (
          $scope.reconnecting &&
          -1 != _.indexOf($scope.reconnectList, device.wan[type].get(inx).__Key)
        );
      }
      var conn = helper.connection.getConnection(type, inx);
      if (!conn) return '';
      var status,
        status = helper.connection.getStatus(conn),
        statusDetail = helper.connection.getStatusDetail(conn),
        actualStatus =
          statusDetail && 'Connected' != status ? statusDetail : status,
        statusText = translate('wanStatus' + actualStatus);
      switch (actualStatus) {
        case 'Connected':
          status = 'on';
          break;
        case 'Connecting':
          status = 'pending';
          break;
        case 'Disabled':
        case 'Disconnected':
        case 'Unknown':
        case 'PPPServerNotAvailable':
        case 'PPPPeerNegotiationFailed':
        case 'PPPPeerNotResponding':
        case 'PPPAuthFailed':
        case 'PPPNotResponse':
        case 'kabinet_not_started':
          status = 'off';
      }
      return (
        isLoading() && (status = 'loading'),
        { statusText: statusText, status: status }
      );
    }
    function getMiniInfo(item) {
      var result = '';
      return (
        (result += translate(item.actualType)),
        'Unknown' != item.iface.type &&
          (result += '/' + translate(item.iface.type)),
        result
      );
    }
    function add(actualType) {
      var options = {};
      $state.go(currentState + '.connection.add', options);
    }
    function edit(item) {
      $state.go(currentState + '.connection.edit', {
        type: item.type,
        inx: item.inx,
      });
    }
    function remove(items) {
      core.cut(items).then(function() {
        info.update();
      });
    }
    function reconnectItem(item) {
      (item._reconnecting = !0),
        device.wan.reconnect([item], function() {
          $timeout(function() {
            item._reconnecting = !1;
          }, 2e3);
        });
    }
    function reconnectItems(items) {
      ($scope.reconnecting = !0),
        device.wan.reconnect(items, function() {
          $scope.reconnecting = !1;
        });
    }
    function reconfigure() {
      confirm(translate('wanRemoveConnAllWarning')) && add();
    }
    function isReconnecting() {
      return $scope.reconnecting ? !0 : !1;
    }
    var device = $scope.device,
      core = $scope.wanCore,
      supported = device.wan.supported();
    ($scope.wan.info.connections = {
      list: [],
      clean: clean,
      make: make,
      isEmpty: isEmpty,
      isSingle: isSingle,
      getMiniTableStatusInfo: getMiniTableStatusInfo,
      getMiniInfo: getMiniInfo,
      add: add,
      edit: edit,
      remove: remove,
      reconnectItem: reconnectItem,
      reconnectItems: reconnectItems,
      reconfigure: reconfigure,
      isReconnecting: isReconnecting,
    }),
      ($scope.wan.info.connections.isMakeList = !1);
    var info = $scope.wan.info,
      connections = $scope.wan.info.connections;
    info.isActivate && make(info.raws),
      $scope.$on('wan.info.activate', function($event, raws) {
        make(raws);
      }),
      $scope.$on('wan.info.update', function($event, raws) {
        make(raws);
      }),
      $scope.$on('wan.info.update_raws', function($event, raws) {
        make(raws);
      });
    var currentState = $state.current.name.split('.');
    currentState.pop(), (currentState = currentState.join('.'));
  }
  angular
    .module('app')
    .controller('WanInfoConnectionsCtrl', [
      '$scope',
      '$state',
      'translate',
      'wanHelper',
      '$timeout',
      WanInfoConnectionsCtrl,
    ]);
})();
