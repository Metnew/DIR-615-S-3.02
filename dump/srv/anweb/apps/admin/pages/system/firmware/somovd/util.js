'use strict';
!(function() {
  function sysFirmwareUtil(
    $rootScope,
    $timeout,
    fwUpdateService,
    constants,
    device,
    funcs,
    somovd,
    translate
  ) {
    function init() {
      return somovd.read(
        [constants.AUTOUPDATE_RPC, constants.DEVICE_INFO_RPC],
        function(response) {
          if (!funcs.is.allRPCSuccess(response)) return Promise.reject();
          var rq = response.rq;
          return (
            (config = funcs.fetchBranch(
              converter.somovdToNative(rq[0].data),
              constants.paths.remoteUpdate
            )),
            (needUpdate = rq[0].data.need_update),
            (status = rq[0].data.status),
            (version = rq[1].data.fw_version),
            Promise.resolve()
          );
        }
      );
    }
    function apply(input, check) {
      var input = __prepareConfig(input);
      return (
        check && (input.check_updates = !0),
        somovd.write(constants.AUTOUPDATE_RPC, input, function(response) {
          return funcs.is.RPCSuccess(response)
            ? ((config = funcs.fetchBranch(
                converter.somovdToNative(response.data),
                constants.paths.remoteUpdate
              )),
              (status = response.data.status),
              (needUpdate = response.data.need_update),
              Promise.resolve())
            : Promise.reject();
        })
      );
    }
    function remoteUpdate() {
      return new Promise(function(resolve, reject) {
        device.system.remoteUpdate(
          function() {
            $rootScope.$emit('device.action.started', {
              action: 'fwupdate.remote',
            }),
              resolve();
          },
          function() {
            reject();
          }
        );
      });
    }
    function getConfig() {
      return config;
    }
    function getStatus() {
      var messages = {
        update_available: {
          text: translate('autoupdNewVersion') + ' (' + config.Version + ')',
          color: 'green',
        },
        device_is_not_supported: {
          text: translate('autoupdFileAbsent'),
          color: 'red',
        },
        latest_fw_version: {
          text: translate('newVersionUnavailable'),
          color: 'gray',
        },
        update_not_checked: { text: '', color: '' },
        other: { text: translate('autoupdUnknownError'), color: 'red' },
      };
      return status in messages || (status = 'other'), messages[status];
    }
    function localFwUploadBegin() {
      function fwUpgradeTimeout() {
        fwUpdateService.getStatus().then(fwUpgradeCheckStatus);
      }
      function fwUpgradeCheckStatus(res) {
        var input = res && res.data ? res.data : {};
        return input.error ? (__errorMsg(), fwUpdateService.cancel()) : void 0;
      }
      fwUpdateService.uploadBegin(),
        $timeout(fwUpgradeTimeout, constants.DEVICE_LOCAL_FIRMWARE_UPLOAD_TIME);
    }
    function localfwUploadEnd(res) {
      function fwUpgradeBegin() {
        fwUpdateService
          .getInfo()
          .then(fwUpgradeCheckInfo)
          .then(fwUpgradeEnd);
      }
      function fwUpgradeEnd(res) {
        return res && res.data && !res.data.status
          ? (__errorMsg(), fwUpdateService.cancel())
          : void 0;
      }
      function fwUpgradeCheckInfo(res) {
        function isOldSystem(input) {
          return !_.has(input, 'status') && -1 == input.status;
        }
        var input = res && res.data ? res.data : {};
        if (isOldSystem(input)) return fwUpdateService.upgrade();
        var checkVersion = fwUpdateService.checkVersion(input);
        switch (checkVersion) {
          case 'need_backup':
            return (
              alert(translate('firmware_update_force_reset_config')),
              fwUpdateService.backup().then(function() {
                return confirm(translate('firmware_update_continue'))
                  ? fwUpdateService.upgrade()
                  : fwUpdateService.cancel();
              })
            );
          case 'maybe_backup':
            return confirm(translate('firmware_update_maybe_reset_config'))
              ? fwUpdateService.backup().then(function() {
                  return confirm(translate('firmware_update_continue'))
                    ? fwUpdateService.upgrade()
                    : fwUpdateService.cancel();
                })
              : confirm(translate('firmware_update_continue'))
                ? fwUpdateService.upgrade()
                : fwUpdateService.cancel();
          default:
            return fwUpdateService.upgrade();
        }
      }
      constants.NEW_CONFIG
        ? fwUpdateService.uploadEnd(res).then(fwUpgradeBegin, __errorMsg)
        : fwUpgradeEnd(res);
    }
    function remoteEnable() {
      return !constants.HQ_ADMIN_ON;
    }
    function getVersion() {
      return version;
    }
    function isNeedUpdate() {
      return needUpdate;
    }
    function isSupportedRemoteUpgrade() {
      return constants.SUPPORT_REMOTE_FIRMWARE_UPGRADE;
    }
    function __prepareConfig(config) {
      var input = funcs.setValue(
        constants.paths.remoteUpdate.replace(/\.$/, ''),
        config,
        {}
      );
      return (
        (input = converter.nativeToSomovd(input)),
        _.pick(input, 'enable', 'server', 'period')
      );
    }
    function __errorMsg() {
      alert(translate('invalid_firmware'));
    }
    var config = null,
      status = null,
      version = null,
      needUpdate = !1,
      converter = device.firmware.converter;
    return (
      (constants = _.extend(constants, device.firmware.constants)),
      {
        init: init,
        apply: apply,
        remoteUpdate: remoteUpdate,
        getConfig: getConfig,
        getStatus: getStatus,
        getVersion: getVersion,
        localFwUploadBegin: localFwUploadBegin,
        localfwUploadEnd: localfwUploadEnd,
        isNeedUpdate: isNeedUpdate,
        isSupportedRemoteUpgrade: isSupportedRemoteUpgrade,
        remoteEnable: remoteEnable,
      }
    );
  }
  angular
    .module('app')
    .service('sysFirmwareUtil', [
      '$rootScope',
      '$timeout',
      'sysFirmwareUpdateService',
      'sysFirmwareConstants',
      'device',
      'funcs',
      'somovd',
      'translate',
      sysFirmwareUtil,
    ]);
})();
