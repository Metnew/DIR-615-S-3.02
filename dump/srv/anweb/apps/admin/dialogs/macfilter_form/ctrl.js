'use strict';
function MacFilterFormDialogCtrl($scope, funcs, translate, util) {
  function activate() {
    ($scope.dialog.config = util.getConfig()),
      ($scope.dialog.attrs = util.getAttrs()),
      (helper = util.makeHelper()),
      _.isUndefined(index)
        ? (($scope.dialog.action = 'add'),
          ($scope.dialog.header = translate('macfilterAddRule')),
          ($scope.dialog.rule = helper.getDefaultRule(
            $scope.dialog.config,
            $scope.dialog.attrs
          )))
        : (($scope.dialog.action = 'edit'),
          ($scope.dialog.header = translate('macfilterEditRule')),
          ($scope.dialog.rule = rule),
          (__backupRule = angular.copy($scope.dialog.rule)));
  }
  function save() {
    if ($scope.form.$valid) {
      var changedConfig = helper.changeConfig($scope.dialog.config, {
        editRules: { rule: $scope.dialog.rule, index: index },
      });
      (!helper.accessWillLost(changedConfig) ||
        confirm(translate('macfilterWarningAccessLoss'))) &&
        $scope.closeThisDialog({ changed: changedConfig });
    }
  }
  function remove() {
    var changedConfig = helper.changeConfig($scope.dialog.config, {
      removeIndexes: [index],
    });
    (!helper.accessWillLost(changedConfig) ||
      confirm(translate('macfilterWarningAccessLoss'))) &&
      $scope.closeThisDialog({ changed: changedConfig });
  }
  function close() {
    $scope.closeThisDialog(null);
  }
  function getActionList() {
    return [
      { name: 'macfilterActionAccept', value: 'ACCEPT' },
      { name: 'macfilterActionDrop', value: 'DROP' },
    ];
  }
  function getUsedMacList() {
    return helper.getUsedMacList($scope.dialog.config, index);
  }
  function isNotUniqRule() {
    return helper.isNotUniqRule(
      $scope.dialog.config,
      $scope.dialog.rule,
      index
    );
  }
  function isSupported(param) {
    return _.has($scope.dialog.rule, param);
  }
  function isDisabledSave() {
    return (
      ('edit' == $scope.dialog.action && !wasModified()) || isNotUniqRule()
    );
  }
  function wasModified() {
    return __backupRule && !_.isEqual(__backupRule, $scope.dialog.rule);
  }
  var rule = $scope.ngDialogData.rule,
    index = $scope.ngDialogData.index;
  $scope.dialog = {
    header: '',
    action: null,
    rule: null,
    config: null,
    save: save,
    remove: remove,
    close: close,
    getActionList: getActionList,
    getUsedMacList: getUsedMacList,
    isSupported: isSupported,
    isDisabledSave: isDisabledSave,
    isNotUniqRule: isNotUniqRule,
    wasModified: wasModified,
  };
  var helper,
    __backupRule = null;
  activate();
}
MacFilterFormDialogCtrl.$inject = [
  '$scope',
  'funcs',
  'translate',
  'macFilterUtil',
];
