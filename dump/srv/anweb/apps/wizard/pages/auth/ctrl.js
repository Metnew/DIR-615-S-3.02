'use strict';
angular.module('wizard').controller('wizardAuthCtrl', [
  '$scope',
  '$rootScope',
  '$timeout',
  function($scope, $rootScope, $timeout) {
    $scope.titleKey = 'dlgLoginTitle';
    var defered = null;
    ($rootScope.gAutoAuthSkipErr = !0),
      ($scope.hideError = !1),
      ($scope.fm = {
        errorMessage: '',
        banTimeRemain: 0,
        banTimeRemainStr: '',
        tryCountRemain: 0,
        username: '',
        password: '',
      }),
      ($scope.auth = function() {
        ($scope.fm.applyed = !0),
          $timeout(function() {
            $scope.$broadcast('goToErrorForm', !0),
              $scope.fm.username &&
                $scope.fm.password &&
                (($rootScope.gShowAuthDialog = !1),
                $rootScope.gFirstData &&
                  ($rootScope.gFirstData.Password = $scope.fm.password),
                defered.resolve({
                  username: $scope.fm.username,
                  password: $scope.fm.password,
                }),
                $rootScope.$broadcast('Authed'));
          });
      }),
      ($scope.clear = function() {
        ($scope.fm.applyed = !1),
          ($scope.fm.username = ''),
          ($scope.fm.password = '');
      }),
      $rootScope.$on('NeedAuth', function(event, args) {
        ($rootScope.gShowAuthDialog = !0),
          (defered = args.defered),
          ($scope.fm.tryCountRemain = args.params.tryCountRemain),
          ($scope.fm.banTimeRemain = args.params.banTimeRemain),
          ($scope.fm.banReason = args.params.banReason),
          ($scope.fm.clientTryCount = args.params.clientTryCount),
          ($scope.hideError = $rootScope.gAutoAuthSkipErr ? !0 : !1);
        var banTimeRemain = $scope.fm.banTimeRemain;
        banTimeRemain
          ? (($scope.fm.banTimeRemainStr = new Date(1e3 * banTimeRemain)
              .toUTCString()
              .match(/\d\d:\d\d:\d\d/)[0]),
            ($scope.fm.errorMessage =
              'try-count-limit' == $scope.fm.banReason
                ? 'dlgLoginMaxCountExc'
                : 'dlgLoginMaxUsersExc'))
          : ($scope.fm.errorMessage =
              $scope.fm.clientTryCount > 0 ? 'dlgLoginWrongAttempt' : ''),
          ($rootScope.gAutoAuthSkipErr = !1);
      });
  },
]);
