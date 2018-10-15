'use strict';
angular.module('app').controllerProvider.register('MiscCtrl', [
  '$scope',
  'miscUtil',
  'funcs',
  'snackbars',
  'miscConstants',
  'navigationFilter',
  function($scope, util, funcs, snackbars, constants, filter) {
    function init() {
      function success() {
        ($scope.settings = util.getConfig()),
          (__backupIgmp = angular.copy($scope.settings.igmp)),
          (__backupIgmpFn = angular.copy($scope.settings.igmpFn)),
          (__backupMld = angular.copy($scope.settings.mld)),
          (__backupMldFn = angular.copy($scope.settings.mldFn)),
          (__backupNetfilter = angular.copy($scope.settings.netfilter)),
          (__backupPassThrough = angular.copy($scope.settings.passThrough)),
          (__backupRlxIptvQos = angular.copy($scope.settings.rlxIptvQos)),
          constants.MLD && $scope.$watch('settings.mldFn.name', mldHandler),
          constants.IGMP && $scope.$watch('settings.igmpFn.name', igmpHandler),
          $scope.$emit('pageload');
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      util
        .pull()
        .then(success)
        ['catch'](error)
        ['finally'](function() {
          overlayId &&
            ($scope.overlay.circular.stop(overlayId), (overlayId = null));
        });
    }
    function igmpHandler(fn) {
      var fns = {
        IGMPv2: function() {
          ($scope.settings.igmp.enable = !0),
            ($scope.settings.igmp.version = 2);
        },
        IGMPv3: function() {
          ($scope.settings.igmp.enable = !0),
            ($scope.settings.igmp.version = 3);
        },
        off: function() {
          $scope.settings.igmp.enable = !1;
        },
      };
      fn in fns && fns[fn]();
    }
    function mldHandler(fn) {
      var fns = {
        MLDv1v2: function() {
          ($scope.settings.mld.enabled = !0), ($scope.settings.mld.version = 0);
        },
        MLDv1: function() {
          ($scope.settings.mld.enabled = !0), ($scope.settings.mld.version = 1);
        },
        MLDv2: function() {
          ($scope.settings.mld.enabled = !0), ($scope.settings.mld.version = 2);
        },
        off: function() {
          $scope.settings.mld.enabled = !1;
        },
      };
      fn in fns && fns[fn]();
    }
    var rules = filter.rules();
    $scope.settings = {};
    var __backupIgmpFn = null,
      __backupIgmp = null,
      __backupMldFn = null,
      __backupMld = null,
      __backupRlxIptvQos = null,
      __backupNetfilter = null,
      __backupPassThrough = null,
      overlayId = null;
    init(),
      ($scope.constants = constants),
      ($scope.wasModified = function() {
        return (
          (__backupIgmp &&
            !_.isEqual(__backupIgmp, angular.copy($scope.settings.igmp))) ||
          (__backupIgmpFn &&
            !_.isEqual(__backupIgmpFn, angular.copy($scope.settings.igmpFn))) ||
          (__backupMld &&
            !_.isEqual(__backupMld, angular.copy($scope.settings.mld))) ||
          (__backupMldFn &&
            !_.isEqual(__backupMldFn, angular.copy($scope.settings.mldFn))) ||
          (__backupNetfilter &&
            !_.isEqual(
              __backupNetfilter,
              angular.copy($scope.settings.netfilter)
            )) ||
          (__backupPassThrough &&
            !_.isEqual(
              __backupPassThrough,
              angular.copy($scope.settings.passThrough)
            )) ||
          (__backupRlxIptvQos &&
            !_.isEqual(
              __backupRlxIptvQos,
              angular.copy($scope.settings.rlxIptvQos)
            ))
        );
      }),
      ($scope.supportZeroSrcAddr = function() {
        return _.isBoolean($scope.settings.igmp.zeroSrcAddr);
      }),
      ($scope.supportRlxIptvQos = function() {
        return !!$scope.settings.rlxIptvQos && !rules.HideRlxIptvQos;
      }),
      ($scope.igmpOptions = ['IGMPv2', 'IGMPv3', 'off']),
      ($scope.mldOptions = ['off', 'MLDv1v2', 'MLDv1', 'MLDv2']),
      ($scope.passThroughs = {
        pptp: 'wanPptpPassThrough',
        l2tp: 'wanL2tpPassThrough',
        ipsec: 'wanIpsecPassThrough',
      }),
      ($scope.setIface = function() {
        !constants.PPPOE_PASS_THROUGH_OVER_IFACE ||
          ($scope.settings.passThrough.pppoe_over_iface &&
            '' != $scope.settings.passThrough.pppoe_over_iface) ||
          ($scope.settings.passThrough.pppoe_over_iface =
            $scope.ifaces[0].iface);
      }),
      ($scope.isDisabledSubmit = function() {
        return $scope.miscForm.$pristine;
      }),
      ($scope.save = function() {
        function success() {
          snackbars.add('rpc_write_success'), init();
        }
        function error(response) {
          $scope.overlay.circular.stop(overlayId),
            (overlayId = null),
            snackbars.add('rpc_write_error');
        }
        (overlayId = $scope.overlay.circular.start()),
          util
            .apply($scope.settings)
            .then(success)
            ['catch'](error);
      });
  },
]);
