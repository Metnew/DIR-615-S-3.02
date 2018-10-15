'use strict';
angular.module('app').controllerProvider.register('RemoteAccessCtrl', [
  '$scope',
  'somovd',
  'funcs',
  'ngDialog',
  'raccessConfig',
  'translate',
  'snackbars',
  function($scope, somovd, funcs, ngDialog, config, translate, snackbars) {
    function init() {
      function initCallback(data) {
        ($scope.busyPorts = getBusyPorts(data.rq[0].data.vserver)),
          ($scope.rules = data.rq[1].data.httpaccess
            ? data.rq[1].data.httpaccess
            : data.rq[1].data),
          ($scope.ifaces = getInterfaces(data.rq[3].data.iface_names, 0, 1)),
          ($scope.ipv6Avail = funcs.is.RPCSuccess(data.rq[4])),
          changePort('TELNET', data.rq[2].data.telnet.port),
          ($scope.isActivate = !0),
          $scope.$emit('pageload');
      }
      ($scope.isActivate = !1),
        somovd.read([10, 16, 152, 1, 132], initCallback);
    }
    function openDialog(pos, rule, isNew) {
      ngDialog
        .open({
          template: 'dialogs/raccess_form/dialog.tpl.html',
          className: 'raccess_dialog',
          controller: 'RemoteAccessDialogCtrl',
          resolve: funcs.getLazyResolve(
            'dialogs/raccess_form/ctrl.lazy.js',
            'RemoteAccessDialogCtrl'
          ),
          data: { pos: pos, rule: rule, isNew: isNew },
          scope: $scope,
        })
        .closePromise.then(function(data) {
          'saved' === data.value && init();
        });
    }
    function getInterfaces(interfaces) {
      var result = [{ name: 'wan_auto', value: 'auto' }],
        interfaces = prepareInterfaces(interfaces);
      return (
        _.each(interfaces, function(conn) {
          result.push({ name: conn.name || conn.iface, value: conn.iface });
        }),
        result
      );
    }
    function prepareInterfaces(tree) {
      var result = [];
      return (
        _.each(tree, function(iface, ifname) {
          iface.is_wan &&
            ((iface.ifname = ifname),
            _.each(iface.services, function(service, ifname) {
              (service.L2 = iface),
                (service.ifname = ifname),
                'auto' != service.type && result.push(service),
                _.each(service.tunnels, function(tunnel, ifname) {
                  (tunnel.L3 = service),
                    (tunnel.L2 = iface),
                    (tunnel.ifname = ifname),
                    result.push(tunnel);
                });
            }));
        }),
        result
      );
    }
    function changePort(name, port) {
      _.each($scope.protocols, function(elem, index) {
        elem.name == name &&
          ($scope.protocols[index].value = port && port.toString());
      });
    }
    function getBusyPorts(vservers) {
      var result = [];
      return (
        vservers.forEach(function(vserver) {
          return 'udp' !== vserver.proto
            ? vserver.ports_end
              ? void (result = _.union(
                  result,
                  _.range(+vserver.ports_begin, +vserver.ports_end + 1)
                ))
              : result.push(+vserver.ports_begin)
            : void 0;
        }),
        result
          .sort(function(a, b) {
            return a - b;
          })
          .map(function(port) {
            return port.toString();
          })
      );
    }
    ($scope.defined = config.defined),
      ($scope.protocols = config.protocols),
      ($scope.systemPorts = config.system_ports),
      init(),
      ($scope.add = function() {
        openDialog(-1, { iface: 'auto' }, !0);
      }),
      ($scope.edit = function(key, item) {
        openDialog(item, key, !1);
      }),
      ($scope.remove = function(items, keys) {
        function getRemoveList() {
          return keys
            .sort()
            .reverse()
            .map(keysMapper);
        }
        function keysMapper(key) {
          return { id: 16, pos: key, data: {} };
        }
        function cb(response) {
          return (
            init(),
            funcs.is.allRPCSuccess(response)
              ? void snackbars.add('rpc_remove_success')
              : void snackbars.add('rpc_remove_error')
          );
        }
        somovd.remove(getRemoveList(), cb);
      }),
      ($scope.getCaption = function(rule) {
        var protocol = $scope.getPortName(rule.dport),
          network = [];
        return (
          network.push(rule.ips),
          rule.ipv6 || network.push(funcs.ipv4.mask['short'](rule.source_mask)),
          protocol + ' (' + network.join('/') + ')'
        );
      }),
      ($scope.getPortName = function(port) {
        var result = _.find($scope.protocols, function(elem) {
          return elem.value == port;
        });
        return result ? result.name : '';
      }),
      ($scope.getShort = function(rule) {
        return translate('raccess_port') + ': ' + (rule.sport || '-');
      }),
      ($scope.getInterfaceName = function(iface) {
        var result = _.find($scope.ifaces, function(elem) {
          return elem.value == iface;
        });
        return result ? translate(result.name) : '';
      }),
      ($scope.isEmptyRules = function() {
        return $scope.rules && 0 == $scope.rules.length;
      });
  },
]);
