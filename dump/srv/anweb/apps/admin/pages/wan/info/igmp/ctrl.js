'use strict';
!(function() {
  function WanInfoIgmpCtrl($scope, helper, funcs, devinfo) {
    function make(raws) {
      function getOptions(raws, type) {
        var initOptions = [{ label: 'wanIgmpDisable', value: null }],
          rawsOptions = getRawsOptions(raws, type);
        return _.union(initOptions, rawsOptions);
      }
      function getRawsOptions(raws, type) {
        return _.chain(raws)
          .filter(function(raw) {
            return raw.type == type;
          })
          .map(function(raw) {
            return { label: raw.data.Name, value: raw.instance };
          })
          .value();
      }
      clean(),
        (igmp.options = getOptions(raws, 'ipv4oe')),
        (igmp.value = device.wan.getIgmpInstance()),
        (mld.options = getOptions(raws, 'ipv6oe')),
        (mld.value = device.wan.getMLDInstance());
    }
    function clean() {
      (igmp.options.length = 0), (mld.options.length = 0);
    }
    var device = $scope.device,
      supported = device.wan.supported(),
      constants = (device.wan, { MLD: 257 });
    ($scope.wan.info.igmp = {
      options: [],
      update: function() {
        device.wan.setIgmpInstance(igmp.value), info.update();
      },
      has: function() {
        return igmp.options.length > 1;
      },
    }),
      ($scope.wan.info.mld = {
        enabled: !1,
        options: [],
        update: function() {
          device.wan.setMLDInstance(mld.value), info.update();
        },
        has: function() {
          return this.enabled && mld.options.length > 1;
        },
      });
    var info = $scope.wan.info,
      igmp = $scope.wan.info.igmp,
      mld = $scope.wan.info.mld;
    info.isActivate && make(info.raws),
      $scope.$on('wan.info.activate', function($event, raws) {
        make(raws);
      }),
      $scope.$on('wan.info.update', function($event, raws) {
        make(raws);
      }),
      supported.mld() &&
        devinfo.once('' + constants.MLD).then(function(data) {
          data &&
            ($scope.wan.info.mld.enabled = data['' + constants.MLD].enabled);
        });
  }
  angular
    .module('app')
    .controller('WanInfoIgmpCtrl', [
      '$scope',
      'wanHelper',
      'funcs',
      'devinfo',
      WanInfoIgmpCtrl,
    ]);
})();
