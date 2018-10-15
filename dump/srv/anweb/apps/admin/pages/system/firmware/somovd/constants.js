'use strict';
!(function() {
  angular.module('app').constant('sysFirmwareConstants', {
    SUPPORT_REMOTE_FIRMWARE_UPGRADE: !0,
    AUTOUPDATE_RPC: 178,
    DEVICE_INFO_RPC: 67,
    NEW_CONFIG: 'undefined' != typeof BR2_NEW_CONFIG,
    DEVICE_LOCAL_FIRMWARE_UPLOAD_TIME: parseInt('45000'),
    DEVICE_LOCAL_FIRMWARE_UPDATE_TIME: parseInt('90000'),
    REBOOT_TIME: '90000',
    RESET_TIME: '95000',
    HQ_ADMIN_ON: 'undefined' != typeof BR2_PACKAGE_ANWEB_HQ_ADMIN_APP,
  });
})();
