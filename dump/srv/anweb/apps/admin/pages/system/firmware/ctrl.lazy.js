"use strict";
! function () {
    function SysFirmwareCtrl($scope, util, translate) {
        function init() {
            function success() {
                firmware.config = util.getConfig(), firmware.status = util.getStatus(), firmware.curVersion = util.getVersion(), __backup = angular.copy(firmware.config)
            }

            function error() {
                $state.go("error", {
                    code: "pullError",
                    message: "pullErrorDesc"
                })
            }
            util.init().then(success)["catch"](error)["finally"]($scope.$emit.bind($scope, "pageload"))
        }

        function remoteApplySettings(check) {
            return $scope.firmwareSettings.$invalid ? void 0 : util.apply(firmware.config, check).then(function () {
                firmware.config = util.getConfig(), firmware.status = util.getStatus(), __backup = angular.copy(firmware.config)
            })
        }

        function remoteCheckUpdates() {
            return $scope.firmwareSettings.$invalid ? void 0 : remoteApplySettings(!0)
        }

        function remoteUpdate() {
            function error() {
                alert(translate("invalid_remote_firmware")), location.reload()
            }
            confirm(translate("fwupdate_confirm")) && util.remoteUpdate().then(function () {})["catch"](error)
        }

        function isShowPeriod() {
            var config = firmware.config;
            return config && config.enable && !_.isUndefined(config.period)
        }

        function wasModified() {
            return __backup && !_.isEqual(__backup, firmware.config)
        }
        $scope.firmware = {
            config: null,
            status: null,
            curVersion: "",
            local: {
                fwUploadURL: "/fwupload",
                fwUploadBegin: util.localFwUploadBegin,
                fwUploadEnd: util.localfwUploadEnd
            },
            remote: {
                applySettings: remoteApplySettings,
                checkUpdates: remoteCheckUpdates,
                update: remoteUpdate,
                isShowPeriod: isShowPeriod,
                isSupported: util.isSupportedRemoteUpgrade,
                isNeedUpdate: util.isNeedUpdate
            },
            wasModified: wasModified
        };
        var firmware = $scope.firmware,
            __backup = null;
        init()
    }
    angular.module("app").controllerProvider.register("SysFirmwareCtrl", ["$scope", "sysFirmwareUtil", "translate", SysFirmwareCtrl])
}();