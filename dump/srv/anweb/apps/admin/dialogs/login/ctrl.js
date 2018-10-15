'use strict';
function LoginDialogCtrl($scope, nwPasswordService) {
  var body = angular.element(document.getElementsByTagName('body')),
    bodyClass = 'login_dialog_opened';
  $scope.fm = {
    username: '',
    password: '',
    tryCountRemain: $scope.ngDialogData.tryCountRemain,
    clientTryCount: $scope.ngDialogData.clientTryCount,
    banTimeRemain: $scope.ngDialogData.banTimeRemain,
    notAuthorized: $scope.ngDialogData.notAuthorized,
  };
  var banTimeRemain = $scope.ngDialogData.banTimeRemain;
  banTimeRemain
    ? (($scope.fm.banTimeRemainStr = new Date(1e3 * banTimeRemain)
        .toUTCString()
        .match(/\d\d:\d\d:\d\d/)[0]),
      ($scope.fm.errorMessage =
        'try-count-limit' == $scope.ngDialogData.banReason
          ? 'dlgLoginMaxCountExc'
          : 'dlgLoginMaxUsersExc'))
    : ($scope.fm.errorMessage =
        $scope.ngDialogData.clientTryCount > 0 ? 'dlgLoginWrongAttempt' : ''),
    ($scope.login = function() {
      var errorMessage = '',
        username = $scope.fm.username,
        password = $scope.fm.password;
      (username && password) ||
        (errorMessage = username
          ? 'dlgLoginPasswordReq'
          : 'dlgLoginUsernameReq'),
        errorMessage
          ? ($scope.fm.errorMessage = errorMessage)
          : $scope.closeThisDialog({
              username: $scope.fm.username,
              password: $scope.fm.password,
            });
    }),
    ($scope.clear = function() {
      ($scope.fm.username = ''), ($scope.fm.password = '');
    }),
    $scope.$on('ngDialog.opened', function($event, $dialog) {
      body.addClass(bodyClass);
    }),
    $scope.$on('ngDialog.closing', function($event, $dialog) {
      body.removeClass(bodyClass);
    });
}
