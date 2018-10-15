'use strict';
!(function() {
  function wanHelper(media, connection, flags) {
    return { media: media, connection: connection, flags: flags };
  }
  function wanHelperMedia(device) {
    function getAllTypes() {
      return wan.media.getTypes();
    }
    function hasType(type) {
      var types = getAllTypes();
      return _.contains(types, type);
    }
    function identifyUseTypes() {
      var allTypes = getAllTypes();
      return _.filter(allTypes, function(type) {
        return 'DSL.ATM' == type && supported.media.atm()
          ? !0
          : wan.media.hasInterfaces(type);
      });
    }
    function getMediaTypesByContype(contype) {
      function isUsbModemContype(contype) {
        var usbModemContypes = ['3g', 'lte', 'usb'];
        return _.contains(usbModemContypes, contype);
      }
      function isXXTPContype(contype) {
        var xxtpContypes = ['pptp', 'l2tp'];
        return _.contains(xxtpContypes, contype);
      }
      function isXXoAContype(contype) {
        return 'pppoa' == contype || 'ipv4oa' == contype;
      }
      if (isXXTPContype(contype)) return [];
      if (isUsbModemContype(contype)) return ['Dongle'];
      if (isXXoAContype(contype)) return ['DSL.ATM'];
      var mediaTypes = getAllTypes();
      return (mediaTypes = _.difference(mediaTypes, ['Dongle']));
    }
    function getInterface(type, instance, contype) {
      if (!instance) {
        var iface = getTemplate(type);
        return (
          'DSL.ATM' != type ||
            iface.LinkType ||
            (iface.LinkType = getATMLinkType(contype)),
          'DSL.ATM' != type ||
            iface.DestinationAddress ||
            (iface.DestinationAddress = wan.media.atm.getUniqDestinationAddress(
              iface.LinkType
            )),
          'Dongle' != type ||
            iface.Type ||
            (iface.Type = getDongleType(contype)),
          iface
        );
      }
      var iface = wan.media.getInterface(type, instance);
      return (
        'DSL.ATM' == type && (iface.LinkType = getATMLinkType(contype)), iface
      );
    }
    function getInfoIface(type) {
      switch (type) {
        case 'DSL.ATM':
          return 'ATM ';
        default:
          return '';
      }
    }
    function buildInterface(conn) {
      function getAutoInterface() {
        return { type: 'auto', info: 'autoSelected', description: '-' };
      }
      function getLowerInterface(conn) {
        function getLowerConnection(link) {
          var conns = device.wan.flattenConnections(),
            result = _.find(conns, function(elem) {
              return elem.data.__Link == link;
            });
          return result ? result.data : null;
        }
        var lowerConn = getLowerConnection(conn.__LowerConnection);
        return {
          type: 'tunnel',
          info: lowerConn ? lowerConn.Name : '-',
          description: '-',
        };
      }
      function getTunnelInterface(conn) {
        function getParentConnection(iface) {
          var conns = device.wan.flattenConnections(['ipv4oe']),
            result = _.find(conns, function(elem) {
              return elem.data.__Key == iface;
            });
          return result ? result.data : null;
        }
        var parentConn = getParentConnection(conn.__LowerLayer);
        return {
          type: 'tunnel',
          info: parentConn ? parentConn.Name : '-',
          description: '-',
        };
      }
      function getUnknownInterface() {
        return { type: 'unknown', info: '-', description: '-' };
      }
      var data = conn.Media,
        type = conn.MediaType;
      return conn.__LowerConnection
        ? getLowerInterface(conn)
        : '4' == conn.__Layer
          ? conn.AutomaticalConnection
            ? getAutoInterface()
            : getTunnelInterface(conn)
          : hasType(type)
            ? {
                type: type,
                info:
                  getInfoIface(type) +
                  funcs.fetchBranch(data, type + '.' + infoKeyMap[type]),
                description: descriptionMap[type],
              }
            : getUnknownInterface();
    }
    function buildInterfaces(type, contype) {
      function getATMNewInterface() {
        return {
          info: 'addNewPVC',
          description: descriptionMap['DSL.ATM'],
          type: 'DSL.ATM',
          isNew: !0,
        };
      }
      function getCondition(mediatype, contype) {
        var condition = {};
        return (
          'Dongle' == mediatype
            ? (condition.Type = getDongleType(contype))
            : 'DSL.ATM' == mediatype &&
              (condition.LinkType = getATMLinkType(contype)),
          condition
        );
      }
      function checkParams(obj, params) {
        return _.every(params, function(value, name) {
          return obj[name] == value;
        });
      }
      var result = [],
        ifaces = wan.media.getInterfacesFlatten(type),
        condition = getCondition(type, contype);
      return (
        _.each(ifaces, function(iface) {
          checkParams(iface.data, condition) &&
            result.push({
              type: type,
              instance: iface.instance,
              info: getInfoIface(type) + iface.data[infoKeyMap[type]],
              description: descriptionMap[type],
            });
        }),
        'DSL.ATM' == type && result.push(getATMNewInterface()),
        result
      );
    }
    function getATMLinkType(contype) {
      return 'pppoa' == contype
        ? 'PPPoA'
        : 'ipv4oa' == contype
          ? 'IPoA'
          : 'EoA';
    }
    function getDongleType(contype) {
      return 'lte' == contype ? 'LTE' : '3g' == contype ? '3G' : 'USB';
    }
    function getTemplate(type) {
      return funcs.deepClone(template.media[type]());
    }
    var wan = device.wan,
      template = device.wan.template(),
      supported = device.wan.supported(),
      funcs = device.funcs,
      infoKeyMap = {
        Ethernet: 'Name',
        WiFi: 'Name',
        'DSL.ATM': 'DestinationAddress',
        'DSL.PTM': 'Name',
        Dongle: 'Type',
      },
      descriptionMap = {
        Ethernet: 'wired_iface',
        WiFi: 'wireless_iface',
        'DSL.ATM': 'ATM PVC',
        'DSL.PTM': 'ptmIface',
        Dongle: 'wireless_connection',
      };
    return {
      getAllTypes: getAllTypes,
      getATMLinkType: getATMLinkType,
      hasType: hasType,
      getMediaTypesByContype: getMediaTypesByContype,
      identifyUseTypes: identifyUseTypes,
      getInterface: getInterface,
      buildInterface: buildInterface,
      buildInterfaces: buildInterfaces,
    };
  }
  function wanHelperConnection(device) {
    function getAllTypes() {
      return _.chain(types)
        .map(function(type) {
          return subtypesMap[type] ? subtypesMap[type] : type;
        })
        .flatten()
        .value();
    }
    function getSubTypes(type) {
      return subtypesMap[type] ? subtypesMap[type] : [];
    }
    function isAdditionalType(actualType, ifacetype) {
      if (ifacetype && _.contains(['DSL.ATM', 'DSL.PTM'], ifacetype)) return !1;
      var type = identifyType(actualType);
      return _.has(additionalMap, type);
    }
    function getAdditionalTypes(actualType) {
      var type = identifyType(actualType);
      return additionalMap[type] || [];
    }
    function getAdditionalSubTypes(actualType) {
      var result = [],
        type = identifyType(actualType);
      return (
        _.each(additionalMap[type], function(elem) {
          result = result.concat(getSubTypes(elem));
        }),
        result
      );
    }
    function identifyType(actualType) {
      function identifySubType(actualType) {
        return _.findKey(subtypesMap, function(types) {
          return _.contains(types, actualType);
        });
      }
      var type = identifySubType(actualType);
      return type ? type : actualType;
    }
    function identifyActualType(connection, type) {
      function identifySubType(connection, type) {
        return 'ipv4oe' == type
          ? 'Static' == connection.AddressingType
            ? 'statip'
            : 'dynip'
          : 'ipv6oe' == type
            ? 'Static' == connection.Origin
              ? 'statipv6'
              : 'dynipv6'
            : 'pptp' == type
              ? 'PPTP' == connection.ActualType
                ? 'pptp'
                : 'l2tp'
              : '-';
      }
      return subtypesMap[type] ? identifySubType(connection, type) : type;
    }
    function identifyVersions(type) {
      var versions = [];
      return (
        _.each(versionMap, function(types, version) {
          _.contains(types, type) && versions.push(version);
        }),
        versions
      );
    }
    function getDataModelName(type) {
      return device.wan.getDataModelName(type);
    }
    function getTemplate(actualType) {
      return angular.copy(template.connection[actualType]());
    }
    function getStateInfo(actualType) {
      function getPath(type) {
        switch (type) {
          case 'pppoe':
          case 'pppoa':
          case 'pptp':
          case 'l2tp':
          case 'pppoev6':
          case 'pppoeDual':
            return '.ppp';
          default:
            return '.' + type;
        }
      }
      return {
        path: getPath(actualType),
        type: identifyType(actualType),
        actualType: actualType,
      };
    }
    function getConnection(type, inx) {
      if (_.isUndefined(device.wan[type]) || !device.wan[type].list)
        return null;
      var list = device.wan[type].list();
      if (!list) return null;
      var conn = list[inx];
      return conn;
    }
    function getStatus(connection) {
      return connection.Status
        ? connection.Status
        : connection.Enable
          ? 'Unconfigured'
          : 'Disabled';
    }
    function getStatusDetail(connection) {
      switch (connection.PPPState) {
        case -1:
        case 0:
          return 'Unknown';
        case 1:
          return 'PPPServerNotAvailable';
        case 2:
          return 'PPPPeerNegotiationFailed';
        case 3:
          return 'PPPPeerNotResponding';
        case 4:
          return 'PPPAuthFailed';
        case 6:
          return 'PPPNotResponse';
        default:
          return '';
      }
    }
    function generateConnectionName(contype) {
      var name = nameMap[contype] || contype;
      return name.split(' ').join('_') + '_' + Math.round(100 * Math.random());
    }
    function getAllSupportedGeneralTypes() {
      var allTypes = supported.connections();
      return _.chain(allTypes)
        .map(function(type) {
          return identifyType(type);
        })
        .uniq()
        .value();
    }
    var template = device.wan.template(),
      supported = device.wan.supported(),
      types = [
        'ipv4oe',
        'ipv6oe',
        'ipv4oa',
        'pppoe',
        'pppoa',
        'pptp',
        'pppoev6',
        'pppoeDual',
        'lte',
        '3g',
        'bridge',
      ],
      subtypesMap = {
        ipv4oe: ['dynip', 'statip'],
        ipv6oe: ['dynipv6', 'statipv6'],
        pptp: ['pptp', 'l2tp'],
      },
      versionMap = {
        v4: [
          'ipv4oe',
          'ipv4oa',
          'pppoe',
          'pppoa',
          'pptp',
          'pppoeDual',
          'lte',
          '3g',
          'bridge',
        ],
        v6: ['ipv6oe', 'pppoev6', 'pppoeDual'],
      },
      nameMap = {
        dynip: 'Dynamic IPv4',
        statip: 'Static IPv4',
        ipoeDual: 'IPoE Dual Stack',
        dynipv6: 'Dynamic IPv6',
        statipv6: 'Static IPv6',
        pppoe: 'PPPoE',
        pppoev6: 'PPPoE IPv6',
        pppoeDual: 'PPPoE Dual Stack',
        pppoa: 'PPPoA',
        pptp: 'PPTP',
        l2tp: 'L2TP',
        lte: 'LTE',
        '3g': '3G',
        bridge: 'Bridge',
      },
      additionalMap = { pptp: ['ipv4oe'], pppoe: ['ipv4oe'] };
    return {
      getAllTypes: getAllTypes,
      getSubTypes: getSubTypes,
      isAdditionalType: isAdditionalType,
      getAdditionalTypes: getAdditionalTypes,
      getAdditionalSubTypes: getAdditionalSubTypes,
      identifyType: identifyType,
      identifyActualType: identifyActualType,
      identifyVersions: identifyVersions,
      getDataModelName: getDataModelName,
      getTemplate: getTemplate,
      getStateInfo: getStateInfo,
      getConnection: getConnection,
      getStatus: getStatus,
      getStatusDetail: getStatusDetail,
      generateConnectionName: generateConnectionName,
      getAllSupportedGeneralTypes: getAllSupportedGeneralTypes,
    };
  }
  function wanHelperFlags(device) {
    function getAllInfo() {
      return typesInfo;
    }
    function unavailableFlag(flag, connection, type, inx) {
      if ('IGMP' != flag) return !1;
      if (!connection.Media) return !1;
      var list = device.wan[type].list();
      return _.some(list, function(conn, index) {
        return (
          device.wan.media.isUniqMedia(connection, conn) && conn.Flags[flag]
        );
      });
    }
    var typesInfo = [
      { name: 'NAT', description: 'wanNat' },
      { name: 'Firewall', description: 'wanFirewall' },
      { name: 'IGMP', description: 'wanIgmp' },
      { name: 'RIP', description: 'wanRip' },
      { name: 'Ping', description: 'wanPing' },
      { name: 'RTSP', description: 'wanRtsp' },
      { name: 'AltRoutingTable', description: 'wanAltrt' },
      { name: 'MLD', description: 'wanMLD' },
    ];
    return { getAllInfo: getAllInfo, unavailableFlag: unavailableFlag };
  }
  angular
    .module('app')
    .factory('wanHelper', [
      'wanHelperMedia',
      'wanHelperConnection',
      'wanHelperFlags',
      wanHelper,
    ]),
    angular.module('app').factory('wanHelperMedia', ['device', wanHelperMedia]),
    angular
      .module('app')
      .factory('wanHelperConnection', ['device', wanHelperConnection]),
    angular.module('app').factory('wanHelperFlags', ['device', wanHelperFlags]);
})();
