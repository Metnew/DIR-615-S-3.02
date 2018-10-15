"use strict";
angular.module("app.config", []).constant("pageList", {
    wizardLang: {
        html: ["/apps/wizard/pages/lang/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardLangCtrl"
    },
    wizardInfo: {
        html: ["/apps/wizard/pages/info/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardInfoCtrl"
    },
    wizardTRStatus: {
        html: ["/apps/wizard/pages/trstatus/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardTRStatusCtrl"
    },
    wizardGeo: {
        html: ["/apps/wizard/pages/geo/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardGeoCtrl"
    },
    wizardSearch: {
        html: ["/apps/wizard/pages/search/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardSearchCtrl"
    },
    wizardSearchFail: {
        html: ["/apps/wizard/pages/search_fail/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardSearchFailCtrl"
    },
    wizardProvList: {
        html: ["/apps/wizard/pages/provlist/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardProvListCtrl"
    },
    wizardServiceList: {
        html: ["/apps/wizard/pages/servicelist/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardServiceListCtrl"
    },
    wizardSummary: {
        html: ["/apps/wizard/pages/summary/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardSummaryCtrl"
    },
    wizardStatus: {
        html: ["/apps/wizard/pages/status/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardStatusCtrl"
    },
    wizardRebootStatus: {
        html: ["/apps/wizard/pages/reboot_status/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardRebootStatusCtrl"
    },
    wizardQuestion: {
        html: ["/apps/wizard/pages/question/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardQuestionCtrl"
    },
    wizardNotDefault: {
        html: ["/apps/wizard/pages/notdefault/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardNotDefaultCtrl"
    },
    wizardCheckCable: {
        html: ["/apps/wizard/pages/checkcable/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardCheckCableCtrl"
    },
    wizardReset: {
        html: ["/apps/wizard/pages/reset/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardResetCtrl"
    },
    wizardStartWizard: {
        html: ["/apps/wizard/pages/startwizard/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardStartWizardCtrl"
    },
    wizardWiFiWarn: {
        html: ["/apps/wizard/pages/wifiwarn/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardWiFiWarnCtrl"
    },
    wizardAuth: {
        html: ["/apps/wizard/pages/auth/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardAuthCtrl"
    },
    wizardManual: {
        html: ["/apps/wizard/pages/manual/page.tpl.html", "/apps/wizard/pages/manual/iface_step/page.tpl.html", "/apps/wizard/pages/manual/usb_modem_step/page.tpl.html", "/apps/wizard/pages/manual/internet_step/page.tpl.html", "/apps/wizard/pages/manual/password_step/page.tpl.html", "/apps/wizard/pages/manual/lan_step/page.tpl.html", "/apps/wizard/pages/manual/iptv_step/page.tpl.html", "/apps/wizard/pages/manual/voip_step/page.tpl.html", "/apps/wizard/pages/manual/wifi_client_step/page.tpl.html", "/general/templates/wifi/client/clientTable.tpl.html", "/apps/wizard/pages/manual/wifi_step/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardManualCtrl"
    },
    wizardFinish: {
        html: ["/apps/wizard/pages/finish/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardFinishCtrl"
    },
    wizardSkipWizard: {
        html: ["/apps/wizard/pages/skipwizard/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardSkipWizard"
    },
    wizardPassword: {
        html: ["/apps/wizard/pages/password/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardPasswordCtrl"
    },
    wizardDefaults: {
        html: ["/apps/wizard/pages/defaults/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardDefaultsCtrl"
    },
    wizardStartState: {
        html: ["/apps/wizard/pages/startstate/page.tpl.html"],
        lazyDeps: [],
        ctrl: "wizardStartStateCtrl"
    }
});