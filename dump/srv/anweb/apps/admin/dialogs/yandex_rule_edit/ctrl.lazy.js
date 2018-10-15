'use strict';
!(function() {
  function yandexRuleDialogController($scope, device) {
    ($scope.model = $scope.ngDialogData.rule),
      ($scope.ydModesAvailable = device.yandexDns.settings.getAvailableModes()),
      ($scope.saveRule = function() {
        $scope.yandex_rule_edit.$invalid ||
          $scope.closeThisDialog($scope.model);
      }),
      ($scope.removeRule = function() {
        ($scope.model.isDeleted = !0), $scope.closeThisDialog($scope.model);
      }),
      ($scope.validateHostname = function(hostname) {
        function isHostname(hostname) {
          var re = /^([a-zA-Z0-9]{1})+([a-zA-Z0-9-])+([a-zA-Z0-9]{1})+$/;
          return re.test(hostname);
        }
        return hostname && !isHostname(hostname) ? 'invalid_hostname' : null;
      });
  }
  angular
    .module('app')
    .controllerProvider.register(
      'yandexRuleDialogController',
      yandexRuleDialogController
    ),
    (yandexRuleDialogController.$inject = ['$scope', 'device']);
})();
