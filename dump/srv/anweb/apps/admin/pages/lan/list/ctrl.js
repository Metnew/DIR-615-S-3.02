'use strict';
!(function() {
  function lanListCtrl($scope, $state, $q, translate, device, helper) {
    function makeList() {
      function makeIPList(elem, version) {
        var ip = elem[version];
        return ip && ip.StaticIP && _.size(ip.StaticIP)
          ? _.map(ip.StaticIP, function(obj) {
              var result = obj.Address ? obj.Address : '-';
              return (
                (result += '/'),
                (result +=
                  obj.SubnetMask || obj.Prefix
                    ? obj.SubnetMask || obj.Prefix
                    : '-')
              );
            })
          : '-';
      }
      var list = device.lan['interface'].list();
      return _.chain(list)
        .map(function(elem, id) {
          var result = {};
          return (
            (result.__id = id),
            (result.__isNewInterface = elem.__isNewInterface),
            (result.name = elem.Name),
            info.supported.IPv4 && (result.ipv4 = makeIPList(elem, 'IPv4')),
            info.supported.IPv6 && (result.ipv6 = makeIPList(elem, 'IPv6')),
            result
          );
        })
        .filter(function(elem) {
          return !elem.__isNewInterface;
        })
        .value();
    }
    function add() {
      $state.go('network.lanInterface.add');
    }
    function edit(elem) {
      $state.go('network.lanInterface.edit', { inx: elem.__id });
    }
    function getShort(elem) {
      var result = [];
      return (
        elem.ipv4 && result.push('IPv4: ' + elem.ipv4),
        elem.ipv6 && result.push('IPv6: ' + elem.ipv6),
        result.join('<br>')
      );
    }
    function disableCreateNewInterface() {
      var list = device.lan['interface'].list();
      return _.every(list, function(elem) {
        return !elem.__isNewInterface;
      });
    }
    function hideCreateNewInterface() {
      return !info.supported.SUPPORT_MULTI_LAN;
    }
    $scope.lan.ifacesInfo = {
      supported: helper.supported.lan(),
      list: null,
      add: add,
      edit: edit,
      getShort: getShort,
      disableCreateNewInterface: disableCreateNewInterface,
      hideCreateNewInterface: hideCreateNewInterface,
    };
    var info = $scope.lan.ifacesInfo;
    info.list = makeList();
  }
  angular
    .module('app')
    .controller('lanListCtrl', [
      '$scope',
      '$state',
      '$q',
      'translate',
      'device',
      'lanHelper',
      lanListCtrl,
    ]);
})();
