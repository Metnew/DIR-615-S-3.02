'use strict';
!(function() {
  function nwMacClone($compile, transelate, pull) {
    function link($scope, $element, $attrs) {
      var $nwField = getNwFiled($element),
        template =
          '<div nw-mac-clone-core nw-mac-clone-core-value=' +
          $attrs.ngModel +
          '></div>',
        $cloneMac = angular.element($compile(template)($scope));
      $nwField && $nwField.after($cloneMac),
        $scope.$on('nwmac.clone', function($event, value) {
          value
            ? $element.attr('nw-input-disabled', 'disabled')
            : $element.removeAttr('nw-input-disabled');
        });
    }
    return { restrict: 'A', priority: 1e3, link: link };
  }
  function nwMacCloneCore(translate, pull) {
    function link($scope, $element, $attrs) {
      function activate(data) {
        function hasClientParam(data) {
          return data && data.mac && data.mac.client;
        }
        hasClientParam(data) &&
          ((clone.client = data.mac.client),
          (clone.isActivate = !0),
          (clone.state = isClientMac()),
          changeState(clone.state));
      }
      function getLabel() {
        var msg = '';
        return (
          isClientMac()
            ? (msg += translate('clientMACaddressUsed'))
            : ((msg += translate('cloneMACaddressMessage')),
              clone.client && (msg += ' (' + clone.client.toUpperCase() + ')')),
          msg
        );
      }
      function changeState(value) {
        $scope.$emit('nwmac.clone', value),
          value ? cloneMac() : cancelCloneMac();
      }
      function isShow() {
        return clone.isActivate && isCanClone();
      }
      function cloneMac() {
        ($scope.clone.backupMac = _.clone($scope.value)),
          ($scope.value = clone.client);
      }
      function cancelCloneMac() {
        _.isNull($scope.clone.backupMac) ||
          (($scope.value = _.clone($scope.clone.backupMac)),
          ($scope.clone.backupMac = null));
      }
      function isClientMac() {
        return !_.isNull(clone.client) && clone.client == $scope.value;
      }
      function isCanClone() {
        return !_.isNull(clone.client);
      }
      $scope.clone = {
        isActivate: !1,
        state: !1,
        client: null,
        backupMac: null,
        getLabel: getLabel,
        changeState: changeState,
        isShow: isShow,
      };
      var clone = $scope.clone;
      $scope.$watch('value', function(newValue, oldValue) {
        newValue != oldValue &&
          ((clone.state = isClientMac()),
          $scope.$emit('nwmac.clone', clone.state));
      }),
        pull().then(activate);
    }
    var template =
      '<div class="nw-mac-clone__container" ng-if="clone.isShow()"><div nw-labeled-switch nw-label="clone.getLabel()" nw-model="clone.state" nw-change="clone.changeState(clone.state)" nw-disabled="clone.isDisabled()" ></div></div>';
    return {
      restrict: 'A',
      template: template,
      scope: { value: '=nwMacCloneCoreValue' },
      link: link,
    };
  }
  function nwMacRestore($compile, transelate, pull) {
    function link($scope, $element, $attrs) {
      var $nwField = getNwFiled($element),
        template =
          '<div nw-mac-restore-core nw-mac-restore-core-value=' +
          $attrs.ngModel +
          ' nw-mac-restore-core-default-value = ' +
          $attrs.nwMacRestore +
          '></div>',
        $resoreMac = angular.element($compile(template)($scope));
      $nwField && $nwField.after($resoreMac);
    }
    return { restrict: 'A', priority: 999, link: link };
  }
  function nwMacRestoreCore(translate, pull) {
    function link($scope, $element, $attrs) {
      function activate(data) {
        function hasDeviceParam(data) {
          return data && data.mac && data.mac.device;
        }
        hasDeviceParam(data) &&
          ((restore.device = data.mac.device), (restore.isActivate = !0));
      }
      function setMac() {
        $scope.value = restore.device;
      }
      function isShow() {
        return restore.isActivate && isCanRestore();
      }
      function isDisabled() {
        return isDeviceMac();
      }
      function isCanRestore() {
        return (
          $scope.defaultValue && (restore.device = $scope.defaultValue),
          !_.isNull(restore.device)
        );
      }
      function isDeviceMac() {
        return !_.isNull(restore.device) && restore.device == $scope.value;
      }
      $scope.restore = {
        isActivate: !1,
        state: !1,
        device: null,
        setMac: setMac,
        isShow: isShow,
        isDisabled: isDisabled,
      };
      var restore = $scope.restore;
      pull().then(activate);
    }
    var template =
      '<div class="button_block center no_top_margin bottom_margin" ng-if="restore.isShow()"><button type="button" class="colored" ng-click="restore.setMac()" ng-bind="\'restoreMACaddressMessage\' | translate" ng-disabled="restore.isDisabled()" ></button></div>';
    return {
      restrict: 'A',
      template: template,
      scope: {
        value: '=nwMacRestoreCoreValue',
        defaultValue: '=nwMacRestoreCoreDefaultValue',
      },
      link: link,
    };
  }
  function nwMacPull($q, devinfo, $timeout) {
    function pull() {
      function init(data) {
        function hasClientMac(data) {
          return !_.isUndefined(data.client) && !_.isUndefined(data.client.mac);
        }
        function hasDeviceMac(data) {
          return !_.isUndefined(data.deviceMac);
        }
        (isLoading = !1),
          (cache.mac = {
            client: hasClientMac(data) ? data.client.mac : null,
            device: hasDeviceMac(data) ? data.deviceMac : null,
          }),
          deferred.resolve(cache);
      }
      var deferred = $q.defer();
      return isLoading
        ? promise
        : (_.isEmpty(cache)
            ? ((isLoading = !0),
              (promise = deferred.promise),
              devinfo.once('version|client').then(init))
            : deferred.resolve(cache),
          deferred.promise);
    }
    var promise,
      isLoading = !1,
      cache = {};
    return pull;
  }
  function getNwFiled($element) {
    for (
      var $nwField = $element.parent();
      $nwField && !$nwField.hasClass('nwfield_element');

    )
      $nwField = $nwField.parent();
    return $nwField;
  }
  var nw = angular.module(regdep('nw-mac'), []);
  nw.directive('nwMacClone', ['$compile', nwMacClone]),
    nw.directive('nwMacCloneCore', ['translate', 'nwMacPull', nwMacCloneCore]),
    nw.directive('nwMacRestore', ['$compile', nwMacRestore]),
    nw.directive('nwMacRestoreCore', [
      'translate',
      'nwMacPull',
      nwMacRestoreCore,
    ]),
    nw.factory('nwMacPull', ['$q', 'devinfo', '$timeout', nwMacPull]);
})();
