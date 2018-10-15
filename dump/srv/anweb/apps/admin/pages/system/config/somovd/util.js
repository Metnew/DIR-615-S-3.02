'use strict';
!(function() {
  function systemUtil(
    $timeout,
    devinfo,
    device,
    funcs,
    somovd,
    translate,
    langList,
    authDigest,
    authDigestCredentialsStorage,
    authDigestRealmStorage,
    authDigestHelper,
    cookie
  ) {
    function getInitParams() {
      return somovd.read(112).then(function(response) {
        var output = { lang: {}, mode: {}, user: {} },
          modeInfo = response.data;
        return (
          (output.mode.name = modeInfo ? modeInfo.device_mode : ''),
          (output.mode.hasHwModeSwitch =
            modeInfo && modeInfo.devmode_hw_switch_support),
          (output.lang.value = translate.getLang()),
          (output.lang.list = langList || ['eng', 'rus']),
          (output.user.name = cookie.get('user_login') || 'admin'),
          Promise.resolve(output)
        );
      });
    }
    function save() {
      return device.system.save();
    }
    function reset() {
      return device.system.reset();
    }
    function reboot() {
      return device.system.reboot();
    }
    function backup() {
      device.system.backup(function() {
        var url = '/config_load';
        setAuthCookie(url, 'GET'), (document.location.href = url);
      });
    }
    function restorePrepare(url) {
      setAuthCookie(url, 'POST');
    }
    function changeLang(lang) {
      function success(response) {
        return funcs.is.RPCSuccess(response)
          ? Promise.resolve()
          : void Promise.reject();
      }
      return somovd.write(67, { lang: lang }).then(success);
    }
    function changePassword(user, password) {
      function success(response) {
        if (funcs.is.allRPCSuccess(response)) {
          var credentials = { username: user, password: password },
            authHeader = authDigestCredentialsStorage.get(
              authDigestRealmStorage.getCurrent()
            );
          return (
            authDigest.setCredentials(credentials, authHeader),
            Promise.resolve()
          );
        }
        return Promise.reject(
          response.status == RPC_INVALID_VALUES
            ? 'password_invalid_value'
            : 'password_not_changed'
        );
      }
      var CONFIG_ID_SET_PASS = 69,
        RPC_INVALID_VALUES = 52;
      return somovd
        .write(CONFIG_ID_SET_PASS, { login: user, pass: password })
        .then(success);
    }
    function setAuthCookie(url, method) {
      var header = authDigestHelper.generateHeader({
        url: url,
        method: method,
      });
      cookie.set('Authorization', header, 3, 'sec');
    }
    return {
      factoryNeedReboot: !1,
      getInitParams: getInitParams,
      save: save,
      reset: reset,
      reboot: reboot,
      backup: backup,
      restorePrepare: restorePrepare,
      changeLang: changeLang,
      changePassword: changePassword,
    };
  }
  angular
    .module('app')
    .service('systemUtil', [
      '$timeout',
      'devinfo',
      'device',
      'funcs',
      'somovd',
      'translate',
      'langList',
      'authDigest',
      'authDigestCredentialsStorage',
      'authDigestRealmStorage',
      'authDigestHelper',
      'cookie',
      systemUtil,
    ]);
})();
