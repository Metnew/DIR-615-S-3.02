'use strict';
!(function() {
  function MacFilterCtrl(
    $scope,
    $state,
    funcs,
    translate,
    ngDialog,
    snackbars,
    util
  ) {
    function activate(overlayId) {
      function success() {
        (helper = util.makeHelper()),
          (macfilter.config = util.getConfig()),
          (macfilter.attrs = util.getAttrs()),
          (macfilter.isActivate = !0);
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      function finallyCb() {
        overlayId && overlay.stop(overlayId), $scope.$emit('pageload');
      }
      util
        .pull()
        .then(success)
        ['catch'](error)
        ['finally'](finallyCb);
    }
    function add() {
      showDialog({});
    }
    function edit(item, index) {
      showDialog({ rule: item, index: index });
    }
    function remove(items, indexes) {
      var changedConfig = helper.changeConfig(macfilter.config, {
        removeIndexes: indexes,
      });
      if (helper.accessWillLost(changedConfig)) {
        if (!confirm(translate('macfilterWarningAccessLoss'))) return;
      } else if (!confirm(translate('macfilterRemoveRulesWarningAnswer')))
        return;
      applyConfig(changedConfig);
    }
    function changeBaseAction() {
      var changedConfig = helper.changeConfig(macfilter.config);
      return helper.accessWillLost(changedConfig) &&
        !confirm(translate('macfilterWarningAccessLoss'))
        ? void (macfilter.config.BaseRule.Action =
            'DROP' == macfilter.config.BaseRule.Action ? 'ACCEPT' : 'DROP')
        : void applyConfig(changedConfig);
    }
    function showDialog(options) {
      function startDialog(options) {
        return ngDialog.open({
          template: 'dialogs/macfilter_form/dialog.tpl.html',
          controller: 'MacFilterFormDialogCtrl',
          scope: $scope,
          data: options,
        });
      }
      function closeDialog(result) {
        result && result.value && applyConfig(result.value.changed);
      }
      startDialog(options).closePromise.then(closeDialog);
    }
    function applyConfig(config) {
      function success() {
        snackbars.add('apply_success'), activate(overlayId);
      }
      function error() {
        overlay.stop(overlayId),
          $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      var overlayId = overlay.start();
      util
        .applyConfig(config)
        .then(success)
        ['catch'](error);
    }
    function getState(enable, nowrap) {
      var result = '';
      return _.isUndefined(enable)
        ? renable
        : (enable
            ? ((result += translate('macfilterStateEnabled')),
              nowrap ||
                (result = "<span class='status_enable'>" + result + '</span>'))
            : ((result += translate('macfilterStateDisabled')),
              nowrap ||
                (result =
                  "<span class='status_disable'>" + result + '</span>')),
          result);
    }
    function getMiniCaption(item) {
      return item.MACAddress.toUpperCase();
    }
    function getMiniInfo(item) {
      var result = [];
      return (
        item.Enable &&
          result.push(
            translate('macfilterState') + ': ' + getState(item.Enable, !0)
          ),
        item.Action &&
          result.push(
            translate('macfilterAction') + ': ' + getActionName(item.Action)
          ),
        result.join('<br>')
      );
    }
    function getActionName(value) {
      var result = _.find(getActionList(), function(e) {
        return e.value == value;
      });
      return result ? translate(result.name) : '';
    }
    function getActionList() {
      return [
        { name: 'macfilterActionAccept', value: 'ACCEPT' },
        { name: 'macfilterActionDrop', value: 'DROP' },
      ];
    }
    function isSupported(param) {
      var rule = macfilter.config.Rules ? macfilter.config.Rules[0] : {};
      return _.has(rule, param);
    }
    $scope.macfilter = {
      config: null,
      attrs: null,
      isActivate: !1,
      add: add,
      edit: edit,
      remove: remove,
      changeBaseAction: changeBaseAction,
      getState: getState,
      getMiniCaption: getMiniCaption,
      getMiniInfo: getMiniInfo,
      getActionList: getActionList,
      getActionName: getActionName,
      isSupported: isSupported,
    };
    var helper,
      macfilter = $scope.macfilter,
      overlay = $scope.overlay.circular;
    activate();
  }
  angular
    .module('app')
    .controllerProvider.register('MacFilterCtrl', [
      '$scope',
      '$state',
      'funcs',
      'translate',
      'ngDialog',
      'snackbars',
      'macFilterUtil',
      MacFilterCtrl,
    ]);
})();
