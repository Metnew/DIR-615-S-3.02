"use strict";
! function () {
    angular.module("wizard").constant("supportInfoConfig", {
        fields: [{
            name: "model",
            langkey: "wizard_smr_model",
            areas: ["version"],
            handler: function (data) {
                return data.modelName
            }
        }, {
            name: "version",
            langkey: "wizard_smr_version",
            areas: ["version"],
            handler: function (data) {
                return data.version
            }
        }, {
            name: "softwareVersion",
            langkey: "wizard_smr_software_version",
            areas: ["version"],
            handler: function (data) {
                return data.version
            }
        }, {
            name: "hwRevision",
            langkey: "wizard_hw_revision",
            areas: ["version"],
            handler: function (data) {
                return data.hwRevision
            }
        }, {
            name: "serial",
            langkey: "wizard_smr_serial",
            areas: ["version"],
            handler: function (data) {
                return data.serialNumber
            }
        }, {
            name: "mac",
            langkey: "Mac",
            areas: ["net"],
            handler: function (data) {
                return data.ipv4gw ? data.ipv4gw.mac : data.ipv6gw ? data.ipv6gw.mac : void 0
            }
        }, {
            name: "pppUsername",
            langkey: "wizard_pppoe_username",
            areas: ["net"],
            handler: function (data) {
                return data.ipv4gw && "pppoe" == data.ipv4gw.contype ? data.ipv4gw.username : void 0
            }
        }]
    })
}();