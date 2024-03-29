'use strict';
angular.module('trouble').controller('errorPPPAuthCtrl', [
  '$scope',
  '$http',
  'troubleCheck',
  'overlay-core',
  'device',
  'devinfo',
  '$timeout',
  function($scope, $http, troubleCheck, overlay, device, devinfo, $timeout) {
    function startReboot() {
      device.system.reboot(!0),
        $timeout(function() {
          function notice(data) {
            data && (devinfo.unsubscribe('notice', notice), nextCheck());
          }
          devinfo.subscribe('notice', notice);
        }, 5e3);
    }
    function nextCheck() {
      $scope.onCheckBtnClick(), overlay.simple.stop({ action: 'apply.ppp' });
    }
    function update_gwif_connection(data, version) {
      return $http({
        url: '/dcc_update_gwif_connection',
        method: 'POST',
        data: { data: data, version: version },
      });
    }
    function isNeedReboot(notice) {
      return 'NeedSaveAndReboot' == notice || 'NeedReboot' == notice;
    }
    var data = troubleCheck.getData(),
      conn = data.ipv4gw ? data.ipv4gw : data.ipv6gw,
      version = conn && 'pppoev6' == conn.contype ? 'v6' : 'v4';
    ($scope.formData = {
      Username: conn ? conn.username : null,
      Password: conn ? conn.password : null,
    }),
      $scope.$on('apply', function() {
        if (
          $scope.form.$valid &&
          $scope.formData.Username &&
          $scope.formData.Password
        ) {
          overlay.simple.start({ action: 'apply.ppp' });
          var data;
          (data = _.contains(['pptp', 'l2tp'], conn.contype)
            ? {
                type: conn.contype,
                username: $scope.formData.Username,
                password: $scope.formData.Password,
              }
            : device.profile.wan[conn.contype].nativeToSomovd($scope.formData)),
            update_gwif_connection(data, version)['finally'](function() {
              devinfo.once('notice').then(function(data) {
                isNeedReboot(data.systemNotice) ? startReboot() : nextCheck();
              });
            });
        }
      });
  },
]);
