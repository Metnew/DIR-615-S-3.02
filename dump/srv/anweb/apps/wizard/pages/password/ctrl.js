'use strict';
angular.module('wizard').controller('wizardPasswordCtrl', [
  '$scope',
  'dataShare',
  '$timeout',
  'stepManager',
  'device',
  'profiles',
  '$rootScope',
  'authService',
  function(
    $scope,
    dataShare,
    $timeout,
    stepManager,
    device,
    profiles,
    $rootScope,
    authService
  ) {
    function apply(finish) {
      var native = {
          Config: {
            SystemPassword: {
              Login: $scope._data.username,
              Password: $scope._data.password,
            },
          },
        },
        somovd = device.profile.nativeToSomovd(native);
      (somovd.DisableFork = !0), profiles.apply(somovd, finish);
    }
    $scope.applyed = !1;
    var value = dataShare.setIfEmpty('password:value', '');
    ($scope._data = {
      username: 'admin',
      password: value,
      password_confirm: value,
    }),
      console.log('_data', $scope._data),
      ($scope.confirmValidator = function(value) {
        return $scope._data.password != value
          ? 'wizard_password_not_identical'
          : null;
      }),
      ($scope.passwValidator = function(value) {
        return $scope.applyed && 'admin' == value
          ? 'wizard_passwd_deferr'
          : null;
      }),
      ($scope.next = function() {
        ($scope.applyed = !0),
          $timeout(function() {
            $scope.$emit('goToErrorForm', !0),
              $scope.passwordForm.$valid &&
                ($rootScope.showOverlay(!0),
                $rootScope.showAvailOverlay(!1),
                apply(function() {
                  dataShare.set('password:username', $scope._data.username),
                    dataShare.set('password:value', $scope._data.password),
                    authService.login($scope._data)['finally'](function() {
                      $rootScope.setAutoAuth(
                        $scope._data.username,
                        $scope._data.password
                      ),
                        stepManager.action('next').then(function() {
                          $rootScope.showOverlay(!1),
                            $rootScope.showAvailOverlay(!0);
                        });
                    });
                }));
          });
      });
  },
]);
