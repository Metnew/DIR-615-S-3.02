'use strict';
!(function() {
  function sysLogUtil(constants, funcs, device, devinfo, somovd) {
    function pullSettings() {
      return somovd.read(constants.SYSLOG_CONF_RPC).then(function(response) {
        if (
          response.status == constants.INVALID_USB_PATH ||
          funcs.is.RPCSuccess(response)
        ) {
          var data = response.data;
          return (
            (data.isInvalidPath =
              response.status == constants.INVALID_USB_PATH ? !0 : !1),
            (config = converterSyslog.somovdToNative(data)),
            (attrs = converterSyslog.attrsToNative()),
            Promise.resolve()
          );
        }
        return Promise.reject();
      });
    }
    function apply(config) {
      var writeData = converterSyslog.nativeToSomovd(config);
      return somovd
        .write(constants.SYSLOG_CONF_RPC, writeData, -1)
        .then(function(response) {
          if (response.status == constants.INVALID_USB_PATH) {
            var error = {
              name: 'invalid_usb_path',
              msg: 'syslog_invalid_usb_path_win_note',
            };
            return Promise.reject(error);
          }
          return funcs.is.RPCSuccess(response)
            ? Promise.resolve()
            : Promise.reject();
        });
    }
    function updateUsbStorage(subscribeFunc, $scope) {
      function initCallback(res) {
        prepareData(res),
          devinfo.subscribe('' + constants.USB_VOLUME_RPC, prepareData, $scope),
          $scope.$emit('pageload');
      }
      function prepareData(res) {
        if (res && res[constants.USB_VOLUME_RPC]) {
          var data = converterUsb.somovdToNative(
            res[constants.USB_VOLUME_RPC].usb_storage
          );
          subscribeFunc(data);
        }
      }
      devinfo.once('' + constants.USB_VOLUME_RPC).then(initCallback);
    }
    function getLevels() {
      return attrs.Levels;
    }
    function getDestinationList() {
      return attrs.Destination;
    }
    function getSettings() {
      return config ? config : {};
    }
    function unmountUsb(id) {
      return somovd
        .write(constants.USB_UMOUNT_RPC, { name: 'usball' }, -1)
        .then(function(response) {
          return funcs.is.RPCSuccess(response)
            ? Promise.resolve()
            : void Promise.reject();
        });
    }
    function updateLog() {
      return somovd.read(constants.SYSLOG_READ_RPC).then(function(response) {
        return funcs.is.RPCSuccess(response) &&
          response.data &&
          response.data.list
          ? Promise.resolve(response.data.list)
          : Promise.reject();
      });
    }
    function usbSupported() {
      return constants.STORAGE_SUPPORT;
    }
    function storageFilebrowserSupported() {
      return constants.STORAGE_FILEBROWSER_SUPPORT;
    }
    function needExt() {
      return !1;
    }
    var config = {},
      attrs = null,
      converterSyslog = device.systemLog.converterSyslog,
      converterUsb = device.systemLog.converterUsbInfo;
    return {
      pullSettings: pullSettings,
      apply: apply,
      updateUsbStorage: updateUsbStorage,
      unmountUsb: unmountUsb,
      updateLog: updateLog,
      usbSupported: usbSupported,
      storageFilebrowserSupported: storageFilebrowserSupported,
      needExt: needExt,
      getLevels: getLevels,
      getDestinationList: getDestinationList,
      getSettings: getSettings,
    };
  }
  angular
    .module('app')
    .service('sysLogUtil', [
      'sysLogConstants',
      'funcs',
      'device',
      'devinfo',
      'somovd',
      sysLogUtil,
    ]);
})();
