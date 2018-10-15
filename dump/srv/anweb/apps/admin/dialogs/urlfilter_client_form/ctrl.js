'use strict';
function UrlFilterClientFormDialogCtrl($scope, translate) {
  function activate() {
    ($scope.dialog.header = translate('client')),
      _.isUndefined(index)
        ? (($scope.dialog.action = 'add'),
          ($scope.dialog.rule = $scope.dialog.rule = { note: '', mac: '' }))
        : (($scope.dialog.action = 'edit'),
          ($scope.dialog.rule = rule),
          (__backupRule = angular.copy($scope.dialog.rule)));
  }
  function save() {
    if ($scope.form.$valid) {
      var changes = { rule: $scope.dialog.rule, id: index, action: 'save' };
      $scope.closeThisDialog(changes);
    }
  }
  function remove() {
    var changes = { rule: $scope.dialog.rule, id: index, action: 'remove' };
    $scope.closeThisDialog(changes);
  }
  function close() {
    $scope.closeThisDialog(null);
  }
  function isDisabledSave() {
    return (
      ('edit' == $scope.dialog.action && !wasModified()) || isNotUniqRule()
    );
  }
  function isNotUniqRule() {
    var useRules = getUseRules();
    return _.some(useRules, function(rule) {
      return rule.mac.toUpperCase() == $scope.dialog.rule.mac.toUpperCase();
    });
  }
  function getUseMac(withoutIndex) {
    var result = _.map(clientsList, function(elem, index) {
      return index != withoutIndex ? elem.mac : void 0;
    });
    return _.compact(result);
  }
  function getUseRules() {
    var useMac = getUseMac(index);
    return _.map(useMac, function(elem) {
      return { mac: elem };
    });
  }
  function wasModified() {
    return __backupRule && !_.isEqual(__backupRule, $scope.dialog.rule);
  }
  var rule = $scope.ngDialogData.rule,
    index = $scope.ngDialogData.inx,
    clientsList = ($scope.ngDialogData.client, $scope.ngDialogData.clientsList);
  $scope.dialog = {
    header: '',
    action: null,
    rule: null,
    save: save,
    remove: remove,
    close: close,
    getUseRules: getUseRules,
    isDisabledSave: isDisabledSave,
    isNotUniqRule: isNotUniqRule,
    wasModified: wasModified,
  };
  var __backupRule = null;
  activate();
}
UrlFilterClientFormDialogCtrl.$inject = ['$scope', 'translate', 'device'];
