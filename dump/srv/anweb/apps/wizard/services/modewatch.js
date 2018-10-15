"use strict";
! function () {
    var wizard = angular.module("wizard");
    wizard.run(["$rootScope", "$q", "somovd", "checkDeviceModeChange", "ngDialog", "funcs", function ($rootScope, $q, somovd, checkDeviceModeChange, ngDialog, funcs) {
        var dialogID = null;
        checkDeviceModeChange.start(), $rootScope.$on("deviceModeChanged", function () {
            ngDialog.isOpen(dialogID) || (dialogID = ngDialog.open({
                template: "dialogs/check_device_mode_change/dialog.tpl.html",
                className: "check_device_mode_change_dialog",
                closeByDocument: !1,
                closeByEscape: !1,
                controller: "CheckDeviceModeChangeDialogCtrl",
                showClose: !1
            }).id)
        }), $rootScope.$on("deviceModeRestored", function () {
            ngDialog.isOpen(dialogID) && ngDialog.close(dialogID)
        })
    }])
}();