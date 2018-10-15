'use strict';
!(function() {
  function nwClientListUtil($q, funcs, devinfo) {
    function pull(source) {
      function success(data) {
        if (((isLoading = !1), !data)) return error();
        var clients = [],
          wifi = [];
        data[187] && (clients = data[187]),
          data[64] &&
            (wifi = _.chain(data[64])
              .map(function(el) {
                return (
                  (el.mac = el.mac && el.mac.toLowerCase()),
                  (el.name = 'WLAN'),
                  el
                );
              })
              .filter(function(el) {
                return !_.some(clients, function(cl) {
                  return cl.mac == el.mac;
                });
              })
              .value()),
          deferred.resolve({ clients: _.union(clients, wifi) });
      }
      function error() {
        (isLoading = !1), deferred.reject();
      }
      var areaList = { all: '187', wifi: '64' },
        source = source && source.split(' '),
        area = _.chain(source)
          .map(function(el) {
            return areaList[el];
          })
          .compact()
          .value()
          .join('|');
      area || (area = areaList.all);
      var deferred = $q.defer();
      return isLoading
        ? promise
        : ((isLoading = !0),
          (promise = deferred.promise),
          devinfo.init({ need_auth: !0 }),
          devinfo.once(area).then(success, error),
          deferred.promise);
    }
    function formClientsInfo(clients, clientType) {
      return _.chain(clients)
        .sortBy(function(el) {
          return is.ipv4(el.ip) ? -1 : 1;
        })
        .uniq(!1, function(el) {
          return 'mac' == clientType ? el.mac : el.ip;
        })
        .map(function(elem) {
          var obj = {};
          switch (clientType) {
            case 'mac':
              (obj.value = elem.mac),
                (obj.title = elem.mac),
                (obj.subtitle = elem.ip);
              break;
            default:
              (obj.value = elem.ip),
                (obj.title = elem.ip),
                (obj.subtitle = elem.mac);
          }
          return (
            elem.hostname &&
              (obj.subtitle = elem.hostname + ' / ' + obj.subtitle),
            obj
          );
        })
        .value();
    }
    function prepareClientsList(
      clients,
      version,
      direction,
      exclude,
      filterFn
    ) {
      function isWifiClient(elem) {
        return 'WLAN' === elem.name;
      }
      function excludeRule(rule) {
        function compare(rule, compareRule) {
          return _.every(rule, function(value, name) {
            return compareRule[name] == value;
          });
        }
        return _.some(exclude, function(elem) {
          return compare(elem, rule);
        });
      }
      return _.filter(clients, function(elem) {
        return excludeRule(elem)
          ? !1
          : filterFn && !filterFn(elem)
            ? !1
            : ('wifi' != direction || isWifiClient(elem)) &&
              ('ipv4' != version || is.ipv4(elem.ip)) &&
              ('ipv6' != version || is.ipv6(elem.ip))
              ? !0
              : !1;
      });
    }
    var promise,
      is = funcs.is,
      isLoading = !1;
    return {
      pull: pull,
      formClientsInfo: formClientsInfo,
      prepareClientsList: prepareClientsList,
    };
  }
  var nw = angular.module('nw-client-list');
  nw.service('nwClientListUtil', ['$q', 'funcs', 'devinfo', nwClientListUtil]);
})();
