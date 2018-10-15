'use strict';
!(function() {
  function sysFirmwareUpdateService(
    $rootScope,
    $http,
    $timeout,
    $q,
    device,
    authDigestHelper,
    cookie
  ) {
    function uploadBegin() {
      $rootScope.$emit('device.action.started', { action: 'fwupdate.local' });
    }
    function uploadEnd(res) {
      var deferred = $q.defer();
      return (
        res && res.data && !res.data.status
          ? ($rootScope.$emit('device.action.failed', {
              action: 'fwupdate.local',
            }),
            deferred.reject())
          : deferred.resolve(),
        deferred.promise
      );
    }
    function getStatus() {
      return fwupdateEndPoint('status');
    }
    function getInfo() {
      return fwupdateEndPoint('getinfo');
    }
    function upgrade() {
      return fwupdateEndPoint('upgrade');
    }
    function backup() {
      var deferred = $q.defer();
      return (
        $rootScope.$emit('device.action.suspend', { action: 'fwupdate.local' }),
        device.system.backup(
          function() {
            var url = '/config_load',
              header = authDigestHelper.generateHeader({
                url: url,
                method: 'GET',
              });
            cookie.set('Authorization', header, 3, 'sec'),
              (document.location.href = url),
              $timeout(function() {
                $rootScope.$emit('device.action.resume', {
                  action: 'fwupdate.local',
                }),
                  deferred.resolve();
              }, 7e3);
          },
          function() {
            deferred.reject();
          }
        ),
        deferred.promise
      );
    }
    function cancel() {
      return fwupdateEndPoint('cancel').then(function() {
        $rootScope.$emit('device.action.succeed', { action: 'fwupdate.local' });
      });
    }
    function checkVersion(input) {
      var newVersion = input.data.new_version,
        currentVersion = input.data.current_version;
      if (newVersion == currentVersion) return '';
      var vNew = newVersion.split('.'),
        vCurrent = currentVersion.split('.');
      return parseInt(vNew[0]) != parseInt(vCurrent[0])
        ? 'need_backup'
        : parseInt(vNew[1]) < parseInt(vCurrent[1])
          ? 'maybe_backup'
          : '';
    }
    function fwupdateEndPoint(action) {
      var url = '/fwupdate?action=' + action + '&_=' + _.random(1e4, 99999);
      return $http.get(url);
    }
    var output = {
      uploadBegin: uploadBegin,
      uploadEnd: uploadEnd,
      getStatus: getStatus,
      getInfo: getInfo,
      upgrade: upgrade,
      backup: backup,
      cancel: cancel,
      checkVersion: checkVersion,
    };
    return output;
  }
  angular
    .module('app')
    .service('sysFirmwareUpdateService', [
      '$rootScope',
      '$http',
      '$timeout',
      '$q',
      'device',
      'authDigestHelper',
      'cookie',
      sysFirmwareUpdateService,
    ]);
})();
