'use strict';
!(function() {
  function lanFormCtrl(
    $rootScope,
    $scope,
    $state,
    $q,
    $timeout,
    ngDialog,
    translate,
    history,
    helper,
    unsavedWarningSharedService,
    devinfo,
    $location,
    $http
  ) {
    function activate(force, overlayId) {
      function __activate() {
        return (
          ($scope.lanForm.inx = $state.params.inx
            ? $state.params.inx
            : getInterfaceIndex()),
          $scope.lanForm.inx && lan['interface'].has($scope.lanForm.inx)
            ? (lan['interface'].init(),
              lan['interface'].change($scope.lanForm.inx),
              $timeout(function() {
                $scope.$broadcast('lan.update', $scope.lanForm.inx),
                  $scope.$broadcast('lan.ipversion', $scope.lanForm.ipVersion);
              }, 0),
              ($scope.lanForm.isPageLoad = !0),
              $scope.$emit('pageload', { title: 'LAN' }),
              void (overlayId && overlay.stop(overlayId)))
            : void goToStart()
        );
      }
      force || _.isEmpty(lan.data()) ? fetch().then(__activate) : __activate();
    }
    function fetch() {
      function success() {
        deferred.resolve();
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' }),
          deferred.reject();
      }
      var deferred = $q.defer();
      return pull().then(success, error), deferred.promise;
    }
    function pull() {
      var deferred = $q.defer();
      return (
        lan.pull(function(error) {
          return error ? void deferred.reject('pull') : void deferred.resolve();
        }, supported),
        deferred.promise
      );
    }
    function prepareApply() {
      return isNotification()
        ? void callNotification().then(apply)
        : void apply();
    }
    function apply() {
      ($scope.form.submitted = !0),
        $timeout(function() {
          function saveCb(flags) {
            function checkRootScopeOverlay() {
              if (
                'undefined' !=
                typeof $rootScope.overlay.progress.start(
                  helper.constraints.constants.REBOOT_TIME
                )
              ) {
                var ip = lan.data()[1].IPv4.StaticIP[1].Address,
                  newUrl =
                    $location.protocol() + '://' + ip + ':' + $location.port();
                $rootScope.overlay.progress
                  .start(helper.constraints.constants.REBOOT_TIME)
                  .then(function() {
                    window.location.href = newUrl;
                  }),
                  (devinfo.__setting.url = newUrl + '/devinfo'),
                  $rootScope.waitForReboot().then(function() {
                    $rootScope.overlay.progress.stop(),
                      (window.location.href = newUrl);
                  });
              }
            }
            return (
              (flags = flags || {}),
              ($scope.form.submitted = !1),
              flags.saveAndReboot &&
              confirm(translate('lanSaveAndRebootMessage'))
                ? (checkRootScopeOverlay(),
                  overlay.stop(overlayId),
                  $rootScope.$emit('unsavedStop', !0),
                  void device.system.reboot(!0))
                : void ($scope.lanForm.isMultiInterfaces
                    ? (overlay.stop(overlayId), goToStart())
                    : activate(!0, overlayId))
            );
          }
          if (
            (isValid() || unsavedWarningSharedService.setBackup(!1),
            isValid() && isChange())
          ) {
            var overlayId = overlay.start();
            save().then(saveCb);
          }
        });
    }
    function removeInterface() {
      function removeCb(flags) {
        return (
          (flags = flags || {}),
          $rootScope.$emit('unsavedStop', !0),
          history.setCleanLastHistory(!0),
          flags.saveAndReboot && confirm(translate('lanSaveAndRebootMessage'))
            ? (overlay.stop(overlayId), void device.system.reboot(!0))
            : void ($scope.lanForm.isMultiInterfaces
                ? (overlay.stop(overlayId), goToStart())
                : activate(!0, overlayId))
        );
      }
      var inx = $scope.lanForm.inx,
        overlayId = overlay.start();
      remove(inx).then(removeCb);
    }
    function save() {
      function success(flags) {
        deferred.resolve(flags);
      }
      function error() {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' }),
          deferred.reject();
      }
      var deferred = $q.defer();
      return (
        lan.push(function(err, flags) {
          return err ? void error() : void success(flags);
        }, supported),
        deferred.promise
      );
    }
    function remove(inx) {
      function success(flags) {
        deferred.resolve(flags);
      }
      function error() {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' }),
          deferred.reject();
      }
      var deferred = $q.defer();
      return (
        lan.remove(inx, function(err, flags) {
          return err ? void error() : void success(flags);
        }),
        deferred.promise
      );
    }
    function has(version) {
      return $scope.lanForm.supported[version];
    }
    function isShow(version) {
      return $scope.lanForm.ipVersion == version;
    }
    function isValid() {
      return $scope.form.$valid;
    }
    function isChange() {
      return lan.isChange();
    }
    function isNotification() {
      var notices = lan['interface'].getNotices();
      return notices.length;
    }
    function isNeedRemove() {
      if (!supported.SUPPORT_MULTI_LAN) return !1;
      if ('edit' != $scope.lanForm.action) return !1;
      var allListLen = _.size(lan['interface'].list()),
        newListLen = _.size(lan['interface'].listNew());
      return allListLen - newListLen > 1;
    }
    function callNotification() {
      function callNotice(notices, inx) {
        function end(inx) {
          notices.length == inx + 1
            ? success()
            : callNotice(notices, inx + 1).then(success, error);
        }
        function success() {
          deferred.resolve();
        }
        function error(msg) {
          deffered.reject(msg);
        }
        var deferred = $q.defer(),
          elem = notices[inx];
        switch (elem.name) {
          case 'dhcp_is_incorrect_pool':
            var params = elem.notice.params();
            params.ranges.length
              ? ngDialog
                  .open({
                    template:
                      'dialogs/dhcp_server_address_pool/dialog.tpl.html',
                    controller: 'DHCPServerAddressPoolDialogCtrl',
                    scope: $scope,
                    data: params,
                  })
                  .closePromise.then(function(data) {
                    data.value && elem.notice.correct(data.value), end(inx);
                  })
              : end(inx);
        }
        return deferred.promise;
      }
      function delay() {
        var deferred = $q.defer();
        return (
          $timeout(function() {
            deferred.resolve();
          }, 0),
          deferred.promise
        );
      }
      var notices = lan['interface'].getNotices();
      return callNotice(notices, 0).then(delay);
    }
    function getInterfaceIndex() {
      return 'add' == $scope.lanForm.action
        ? _.keys(lan['interface'].listNew())[0]
        : '1';
    }
    function goToStart() {
      $state.go('network.lan');
    }
    var device = $scope.device,
      lan = $scope.device.lan,
      supported = helper.supported.lan(),
      overlay = $rootScope.overlay.circular;
    ($scope.lanForm = {
      supported: helper.supported.lan(),
      has: has,
      isShow: isShow,
      isChange: isChange,
      isValid: isValid,
      isNotification: isNotification,
      isNeedRemove: isNeedRemove,
      callNotification: callNotification,
      prepareApply: prepareApply,
      removeInterface: removeInterface,
    }),
      ($scope.lanForm.isMultiInterfaces = /network.lanInterface/.test(
        $state.current.name
      )),
      ($scope.lanForm.action =
        'network.lanInterface.add' == $state.current.name ? 'add' : 'edit'),
      ($scope.lanForm.ipVersion = $state.params.ipversion
        ? $state.params.ipversion
        : 'IPv4'),
      ($scope.lanForm.isPageLoad = !1),
      $scope.$on('$destroy', function() {
        lan.clean(), lan['interface'].clean();
      }),
      $scope.$on('lan.interface.change', function($event, value) {
        ($scope.lanForm.inx = value),
          lan['interface'].change(value, !0),
          $scope.$broadcast('lan.interface.update', value);
      }),
      $scope.$on('lan.interface.ip.change', function($event, value) {
        ($scope.lanForm.ipVersion = value),
          $scope.$broadcast('lan.ipversion', value);
      }),
      activate();
  }
  angular
    .module('app')
    .controller('lanFormCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      '$q',
      '$timeout',
      'ngDialog',
      'translate',
      'history',
      'lanHelper',
      'unsavedWarningSharedService',
      'devinfo',
      '$location',
      '$http',
      lanFormCtrl,
    ]);
})();
