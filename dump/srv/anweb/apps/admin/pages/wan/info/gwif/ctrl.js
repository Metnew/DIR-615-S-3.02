'use strict';
!(function() {
  function WanInfoGwifCtrl($scope, translate, helper) {
    function make(raws) {
      function filterRaws(raws) {
        return _.filter(raws, function(raw) {
          return (
            raw.data &&
            1 != raw.data.AutomaticalConnection &&
            'bridge' != raw.type
          );
        });
      }
      function setGwifs(raws) {
        _.each(gwif.versions, function(version) {
          var gateway = getGwif(raws, version);
          gwif.list.push(gateway);
        });
      }
      clean();
      var raws = filterRaws(raws);
      setGwifs(raws);
    }
    function clean() {
      gwif.list.length = 0;
    }
    function has() {
      return _.some(gwif.list, function(elem) {
        return elem.has();
      });
    }
    function getLabel() {
      var versions = getUseVersion();
      return versions.length > 1
        ? translate('wanDefaultGatewayCaption')
        : 'v4' == versions[0]
          ? translate('wanGwifv4Label')
          : 'v6' == versions[0]
            ? translate('wanGwifv6Label')
            : '';
    }
    function checkStyle(name) {
      var versions = getUseVersion(),
        curStyle = versions.length > 1 ? 'table' : 'single';
      return name == curStyle;
    }
    function getUseVersion() {
      return _.chain(gwif.list)
        .filter(function(elem) {
          return elem.has();
        })
        .map(function(elem) {
          return elem.version;
        })
        .value();
    }
    function getGwif(conns, version) {
      function update() {
        wan.setDefaultGateway(this.version, this.value), info.update();
      }
      function has() {
        return this.list.length > 0;
      }
      function isSelect() {
        return this.value ? !0 : !1;
      }
      function error() {
        return this.isSelect() ? null : 'wanGwifNotSet';
      }
      function getList(conns, version) {
        function filterConns(elem) {
          var versions = helper.connection.identifyVersions(elem.type);
          return _.contains(versions, version);
        }
        function transformConns(elem) {
          var conn = elem.data,
            type = elem.type,
            inx = elem.instance;
          return {
            label: conn.Name,
            value:
              'Device.WAN.' +
              helper.connection.getDataModelName(type) +
              '.Connection.' +
              inx +
              '.',
          };
        }
        return _.chain(conns)
          .filter(filterConns)
          .map(transformConns)
          .value();
      }
      function getGwifValue(list, version) {
        var path = wan.getDefaultGateway(version);
        if (!path) return '';
        var obj = _.find(list, function(elem) {
          return elem.value == path;
        });
        return obj ? obj.value : '';
      }
      var list = getList(conns, version),
        value = getGwifValue(list, version);
      return {
        version: version,
        title: 'IP' + version,
        list: list,
        value: value,
        update: update,
        has: has,
        isSelect: isSelect,
        error: error,
      };
    }
    var device = $scope.device,
      wan = device.wan;
    $scope.wan.info.gwif = {
      list: [],
      versions: ['v4', 'v6'],
      clean: clean,
      make: make,
      has: has,
      getLabel: getLabel,
      checkStyle: checkStyle,
    };
    var info = $scope.wan.info,
      gwif = $scope.wan.info.gwif;
    info.isActivate && make(info.raws),
      $scope.$on('wan.info.activate', function($event, raws) {
        make(raws);
      }),
      $scope.$on('wan.info.update', function($event, raws) {
        make(raws);
      });
  }
  angular
    .module('app')
    .controller('WanInfoGwifCtrl', [
      '$scope',
      'translate',
      'wanHelper',
      WanInfoGwifCtrl,
    ]);
})();
