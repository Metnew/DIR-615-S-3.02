"use strict";
angular.module("wizard").service("voipHelper", ["somovd", "devinfo", function (somovd, devinfo) {
    function buildSIPTemplate(lineIndex, data) {
        var template = {
            VoiceService: {
                1: {
                    VoiceProfile: {
                        1: {
                            Line: {}
                        }
                    }
                }
            }
        };
        return template.VoiceService[1].VoiceProfile[1].SIP = data.BaseSIP, template.VoiceService[1].VoiceProfile[1].Line[lineIndex] = {
            SIP: data.LineSIP
        }, template
    }

    function applyLineAuth(line, data) {
        var template = buildSIPTemplate(line, data);
        return somovd.write(76, template)
    }

    function isLineUp(status) {
        return window.dbgSIPStatus ? !0 : _.contains(["Registering", "Talking", "Ringing"], status)
    }

    function getVoIPStatus(cb) {
        devinfo.once("voip").then(function (data) {
            cb(data && data.voip ? isLineUp(data.voip.lines[0]) : !0)
        })
    }

    function buildCustomSIP(profileID, phone, password, options) {
        var LineSIP = {},
            BaseSIP = {},
            server = "",
            username = "",
            domain = "",
            login_id = "";
        return BaseSIP.ProxyServer = server, BaseSIP.RegistrarServer = server, void 0 !== domain && (BaseSIP.X_DLINK_UseDomain = !!domain), BaseSIP.UserAgentDomain = domain, LineSIP.AuthUserName = username, LineSIP.X_DLINK_LoginID = login_id, LineSIP.AuthPassword = password, {
            BaseSIP: BaseSIP,
            LineSIP: LineSIP
        }
    }

    function phoneCustomValidator(value) {
        return !value || /^[\d]{10}$/.test(value) ? null : "wizard_phone_rst_err"
    }
    return {
        applyLineAuth: applyLineAuth,
        isLineUp: isLineUp,
        getVoIPStatus: getVoIPStatus,
        buildCustomSIP: buildCustomSIP,
        phoneCustomValidator: phoneCustomValidator
    }
}]);