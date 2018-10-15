'use strict';
!(function() {
  function SysConfigCtrl(
    $scope,
    $state,
    $q,
    $timeout,
    devinfo,
    util,
    translate,
    snackbars
  ) {
    function init() {
      function success(result) {
        (config.mode = result.mode),
          (config.user.name = result.user ? result.user.name : ''),
          (config.lang.list = result.lang.list),
          (config.lang.value = result.lang.value);
      }
      function error(err) {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      util
        .getInitParams()
        .then(success)
        ['catch'](error)
        ['finally']($scope.$emit.bind($scope, 'pageload'));
    }
    function reset() {
      function __reset() {
        var overlayId = overlay.start();
        return util
          .reset()
          .then(snackbars.add.bind(snackbars, translate('configFactoryOk')))
          .then(rebootAction)
          ['catch'](
            snackbars.add.bind(snackbars, translate('configFactoryError'))
          )
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }
      function rebootAction() {
        return util.factoryNeedReboot
          ? reboot({ mode: 'factory' })
          : Promise.resolve();
      }
      function getFactoryConfirmMsg() {
        if (config.mode && config.mode.name && config.mode.hasHwModeSwitch)
          var msg = 'configFactoryQuestion_' + config.mode.name;
        else var msg = 'configFactoryQuestion';
        return translate(msg);
      }
      var confirmMsg = getFactoryConfirmMsg();
      return confirmPromise(confirmMsg).then(__reset);
    }
    function save() {
      var overlayId = overlay.start();
      util
        .save()
        .then(snackbars.add.bind(snackbars, translate('configSaveOK')))
        ['catch'](snackbars.add.bind(snackbars, translate('configSaveError')))
        ['finally'](overlay.stop.bind(overlay, overlayId));
    }
    function reboot(opts) {
      function error(msg) {
        (msg && 'not_confirm' == msg) ||
          snackbars.add(translate('configRebootError'));
      }
      var rebootMess;
      return (
        (opts = opts || {}),
        (rebootMess =
          'restore' == opts.mode
            ? 'configRestoreConfirm'
            : 'factory' == opts.mode
              ? 'save_and_reboot_confirm'
              : 'configRebootConfirm'),
        confirmPromise(translate(rebootMess))
          .then(util.reboot.bind(util))
          .then(snackbars.add.bind(snackbars, translate('configRebootOK')))
          ['catch'](error)
      );
    }
    function backup() {
      util.backup();
    }
    function restorePrepare() {
      util.restorePrepare(config.restore.url);
    }
    function restoreBegin() {
      (config.overlay = overlay.start()), ($scope.isupload = !1);
    }
    function restoreEnd(data) {
      overlay.stop(config.overlay),
        data && data.status
          ? reboot({ mode: 'restore' })
          : alert(translate('invalid_config'));
    }
    function changeLang(lang) {
      var overlayId = overlay.start();
      util
        .changeLang(lang)
        .then(translate.changeLanguage.bind(translate, lang))
        ['catch'](
          snackbars.add.bind(snackbars, translate('configChangeLangError'))
        )
        ['finally'](overlay.stop.bind(overlay, overlayId));
    }
    function changePassword(user, password) {
      function success(msg) {
        (config.user.password = ''),
          (config.user.confirm = ''),
          snackbars.add(translate('password_changed'));
      }
      function error(msg) {
        var msg = msg || 'password_not_changed';
        snackbars.add(translate(msg));
      }
      if ($scope.form_system_password.$valid) {
        var overlayId = overlay.start();
        util
          .changePassword(user, password)
          .then(success)
          ['catch'](error)
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }
    }
    function getConfigResetMessage() {
      if (config.mode && config.mode.name && config.mode.hasHwModeSwitch)
        var msg = 'configReset_' + config.mode.name;
      else var msg = 'configReset';
      return translate(msg);
    }
    function confirmPromise(msg) {
      var deferred = $q.defer();
      return (
        confirm(msg) ? deferred.resolve() : deferred.reject('not_confirm'),
        deferred.promise
      );
    }
    $scope.config = {
      save: save,
      reset: reset,
      reboot: reboot,
      backup: backup,
      restore: {
        url: '/config_restore',
        prepare: restorePrepare,
        begin: restoreBegin,
        end: restoreEnd,
        overlay: null,
      },
      user: {
        name: '',
        password: '',
        confirm: '',
        changePassword: changePassword,
      },
      mode: null,
      lang: { value: null, list: null, change: changeLang },
      getConfigResetMessage: getConfigResetMessage,
    };
    var config = $scope.config,
      overlay = $scope.overlay.circular;
    init();
  }
  angular
    .module('app')
    .controllerProvider.register('SysConfigCtrl', [
      '$scope',
      '$state',
      '$q',
      '$timeout',
      'devinfo',
      'systemUtil',
      'translate',
      'snackbars',
      SysConfigCtrl,
    ]);
})();
