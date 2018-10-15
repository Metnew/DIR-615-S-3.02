'use strict';
angular.module('app').controllerProvider.register('DnsCtrl', [
  '$scope',
  'snackbars',
  'cookie',
  'ngDialog',
  'funcs',
  'translate',
  'navigationFilter',
  'dnsConstants',
  function(
    $scope,
    snackbars,
    cookie,
    ngDialog,
    funcs,
    translate,
    navigationFilter,
    constants
  ) {
    function activate() {
      function checkIface(protocol) {
        var dns = $scope.dns[protocol],
          ifaces = $scope.ifaces[protocol],
          ifnames = Object.keys(ifaces),
          hasIface = dns.Ifname && dns.Ifname in ifaces,
          ifacesExist = ifnames.length;
        !hasIface && ifacesExist && (dns.Ifname = ifnames[0]);
      }
      dns.pull(function() {
        ($scope.isAPMode = isAPMode),
          ($scope.data = dns.data()),
          ($scope.dns = {
            V4: $scope.data.V4,
            V6: $scope.data.V6,
            Hosts: $scope.data.Hosts,
          }),
          ($scope.ifaces = $scope.data.Ifaces),
          ($scope.availIPv6 = $scope.data.AvailIPv6),
          ($scope.availDefroute = $scope.data.AvailDefroute),
          $scope.availIPv6 &&
            ($scope.protocols.V6 = {
              name: 'ipv6',
              example: '2001:4860:4860::8888',
            }),
          Object.keys($scope.protocols).forEach(checkIface),
          ifnameChange('V4', $scope.dns.V4.Ifname),
          $scope.availIPv6 && ifnameChange('V6', $scope.dns.V6.Ifname),
          (__backupDns = funcs.deepClone($scope.dns)),
          $scope.$watch('dns.V4.Ifname', ifnameChange.bind(null, 'V4')),
          $scope.$watch('dns.V6.Ifname', ifnameChange.bind(null, 'V6')),
          $scope.$emit('pageload');
      });
    }
    function dnsCount() {
      return _.reduceRight(
        ['V4', 'V6'],
        function(count, proto) {
          return $scope.dns[proto]
            ? count + _.size($scope.dns[proto].Servers)
            : count;
        },
        0
      );
    }
    function openDialogHosts(host, inx) {
      ngDialog
        .open({
          template: 'dialogs/dns_hosts/dialog.tpl.html',
          controller: 'DnsHostsDialogCtrl',
          resolve: funcs.getLazyResolve(
            'dialogs/dns_hosts/ctrl.lazy.js',
            'DnsHostsDialogCtrl'
          ),
          data: {
            host: host,
            allHostnames: _.pluck($scope.dns.Hosts, 'hostname'),
            allIps: _.pluck($scope.dns.Hosts, 'ip'),
          },
          scope: $scope,
        })
        .closePromise.then(function(data) {
          data.value &&
            'save' == data.value.status &&
            data.value.host &&
            (host && $scope.dns.Hosts[inx]
              ? ($scope.dns.Hosts[inx] = data.value.host)
              : $scope.dns.Hosts.push(data.value.host));
        });
    }
    function ifnameChange(protocol, ifname) {
      var ifaces = $scope.ifaces[protocol];
      ifname &&
        ifname in ifaces &&
        ($scope.dns[protocol].Contag = ifaces[ifname].Contag);
    }
    ($scope.constants = constants), ($scope.rules = navigationFilter.rules());
    var device = $scope.device,
      dns = device.dns,
      MAX_DNS_COUNT = 3,
      isAPMode = 'ap' === cookie.get('device_mode'),
      __backupDns = null;
    ($scope.protocols = { V4: { name: 'ipv4', example: '8.8.8.8' } }),
      activate(),
      ($scope.add = function(protocol) {
        if (dnsCount() >= MAX_DNS_COUNT)
          return void alert(translate('dnsMaxCountMessage'));
        var keys = Object.keys($scope.dns[protocol].Servers),
          key = Math.max.apply(null, keys.concat(0)) + 1;
        ($scope.dns[protocol].focus = !0),
          ($scope.dns[protocol].Servers[key] = '');
      }),
      ($scope.removeServer = function(protocol, inx) {
        delete $scope.dns[protocol].Servers[inx];
      }),
      ($scope.save = function() {
        function pushCb(err) {
          return err
            ? void snackbars.add('rpc_write_error')
            : (snackbars.add('rpc_write_success'), void activate());
        }
        isAPMode &&
          ($scope.data.V4 && ($scope.data.V4.Manual = !0),
          $scope.data.V6 && ($scope.data.V6.Manual = !0)),
          dns.push(pushCb);
      }),
      ($scope.isDisabledSubmit = function() {
        return (
          (!dns.isChanged('V4') &&
            !dns.isChanged('V6') &&
            $scope.dns &&
            _.isEqual($scope.dns.Hosts, __initModel.dns.Hosts)) ||
          $scope.dnsForm.$invalid
        );
      }),
      ($scope.wasModified = function() {
        return __backupDns && !_.isEqual(__backupDns, angular.copy($scope.dns));
      }),
      ($scope.isDisabledButtonAdd = function() {
        return dnsCount() >= MAX_DNS_COUNT;
      }),
      ($scope.hosts = {
        add: function() {
          openDialogHosts();
        },
        edit: function(host, inx) {
          openDialogHosts(host, inx);
        },
        remove: function(hosts, inxs) {
          var inxs = inxs.sort(function(a, b) {
            return b - a;
          });
          for (var i in inxs) $scope.dns.Hosts.splice(inxs[i], 1);
        },
        isEmpty: function() {
          return !($scope.dns && $scope.dns.Hosts && $scope.dns.Hosts.length);
        },
      });
  },
]);
