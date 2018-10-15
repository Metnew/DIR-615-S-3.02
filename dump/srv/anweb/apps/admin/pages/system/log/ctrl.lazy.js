'use strict';
!(function() {
  function SysLogCtrl(
    $scope,
    $state,
    $timeout,
    util,
    ngDialog,
    funcs,
    translate,
    snackbars
  ) {
    function init() {
      initSettings();
    }
    function initSettings() {
      function success(response) {
        (syslog.settings = util.getSettings()),
          syslog.usbSupported() && updateUsbStorage();
        var syslogTab = $state.params.tab
          ? $state.params.tab
          : _.first(syslog.tabs.list).state;
        changeTabs(syslogTab),
          (__backup = angular.copy(syslog.settings)),
          (syslog.isActivate = !0),
          (syslog.isNeedPull = !1);
      }
      function error(error) {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      util
        .pullSettings()
        .then(success)
        ['catch'](error)
        ['finally']($scope.$emit.bind($scope, 'pageload'));
    }
    function updateUsbStorage() {
      function handler(input) {
        (syslog.usbStorage = input),
          (syslog.settings.Log2USB.InvalidPath = numberOfStorage()
            ? syslog.settings.Log2USB.InvalidPath
            : !1),
          (syslog.isNeedPull = numberOfStorage() ? syslog.isNeedPull : !0),
          syslog.isNeedPull && numberOfStorage() && initSettings();
      }
      util.updateUsbStorage(handler, $scope);
    }
    function updateLog() {
      function success(list) {
        (syslog.log = list),
          $timeout(function() {
            var log = document.getElementById('log');
            log.scrollTop = log.scrollHeight;
          });
      }
      (syslog.logLoading = !0),
        util
          .updateLog()
          .then(success)
          ['finally'](function(e) {
            return (syslog.logLoading = !1);
          });
    }
    function unmountUsb(id) {
      var overlay = $scope.overlay.circular,
        overlayId = overlay.start();
      util
        .unmountUsb(id)
        .then(snackbars.add.bind(snackbars, 'unmountSuccess'))
        ['catch'](snackbars.add.bind(snackbars, 'unmountErrorDesc'))
        ['finally'](overlay.stop.bind(overlay, overlayId));
    }
    function apply() {
      function success() {
        (syslog.settings.Log2USB.InvalidPath = !1),
          snackbars.add('apply_success'),
          init();
      }
      function error(error) {
        error && 'invalid_usb_path' == error.name
          ? (numberOfStorage() &&
              (alert(translate(error.msg)),
              (syslog.settings.Log2USB.InvalidPath = !0)),
            init())
          : $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      if (!$scope.form.$invalid && wasModified()) {
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start();
        util
          .apply(syslog.settings)
          .then(success)
          ['catch'](error)
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }
    }
    function changeTabs(state) {
      (syslog.tabs.state = state),
        'log' == state && syslog.updateLog(),
        $state.go('.', { tab: state }, { notify: !1 });
    }
    function isRemoteConfig() {
      return (
        syslog.settings &&
        syslog.settings.Enable &&
        ('Remote' == syslog.settings.Destination ||
          'Both' == syslog.settings.Destination)
      );
    }
    function getDestinationList() {
      var destination = [
        { name: 'syslogLocal', value: 'Local' },
        { name: 'syslogRemote', value: 'Remote' },
        { name: 'syslogBoth', value: 'Both' },
      ];
      return _.filter(destination, function(e) {
        return _.contains(util.getDestinationList(), e.value);
      });
    }
    function getDestinationInfo(destination) {
      switch (destination) {
        case 'Local':
          return 'syslogLocalInfo';
        case 'Remote':
          return 'syslogRemoteInfo';
        case 'Both':
          return 'syslogBothInfo';
      }
    }
    function getLevels() {
      var levels = [
        { name: 'syslogNotEfficient', value: 0 },
        { name: 'syslogAlertMessages', value: 1 },
        { name: 'syslogCriticalEvents', value: 2 },
        { name: 'syslogErrorMessages', value: 3 },
        { name: 'syslogDifferentWarnings', value: 4 },
        { name: 'syslogImportantNotifications', value: 5 },
        { name: 'syslogInfoMessages', value: 6 },
        { name: 'syslogDebuggingMessages', value: 7 },
      ];
      return _.filter(levels, function(e) {
        return _.contains(util.getLevels(), e.value);
      });
    }
    function numberOfStorage() {
      return syslog.usbStorage ? _.size(syslog.usbStorage) : 0;
    }
    function checkRotateSize() {
      0 == syslog.settings.Log2USB.RotateSize &&
        (syslog.settings.Log2USB.RotateNumber = 1);
    }
    function openFileBrowser(path) {
      numberOfStorage() &&
        ngDialog
          .open({
            template: 'dialogs/filebrowser/dialog.tpl.html',
            controller: 'DialogFileBrowserCtrl',
            resolve: funcs.getLazyResolve(
              'dialogs/filebrowser/ctrl.lazy.js',
              'DialogFileBrowserCtrl'
            ),
            data: { title: '', path: path },
            scope: $scope,
          })
          .closePromise.then(function(data) {
            data.value &&
              syslog.settings.Log2USB &&
              (syslog.settings.Log2USB.Directory = data.value);
          });
    }
    function wasModified() {
      return syslog.isActivate
        ? !funcs.deepEqual(__backup, syslog.settings)
        : !1;
    }
    $scope.syslog = {
      isActivate: !1,
      isNeedPull: !0,
      log: null,
      settings: null,
      usbStorage: null,
      logLoading: !1,
      tabs: {
        list: [
          { name: 'sysLogLog', state: 'log' },
          { name: 'sysLogSettings', state: 'settings' },
        ],
        state: null,
        change: changeTabs,
      },
      apply: apply,
      updateLog: updateLog,
      unmountUsb: unmountUsb,
      isRemoteConfig: isRemoteConfig,
      getDestinationList: getDestinationList,
      getDestinationInfo: getDestinationInfo,
      getLevels: getLevels,
      usbSupported: util.usbSupported,
      storageFilebrowserSupported: util.storageFilebrowserSupported,
      numberOfStorage: numberOfStorage,
      openFileBrowser: openFileBrowser,
      wasModified: wasModified,
      checkRotateSize: checkRotateSize,
      needExt: util.needExt,
    };
    var syslog = $scope.syslog,
      __backup = null;
    init();
  }
  angular
    .module('app')
    .controllerProvider.register('SysLogCtrl', [
      '$scope',
      '$state',
      '$timeout',
      'sysLogUtil',
      'ngDialog',
      'funcs',
      'translate',
      'snackbars',
      SysLogCtrl,
    ]);
})();
