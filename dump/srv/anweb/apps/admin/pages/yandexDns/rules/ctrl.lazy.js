'use strict';
!(function() {
  function yandexDnsRulesController(
    $scope,
    ngDialog,
    translate,
    device,
    funcs
  ) {
    function refreshData() {
      yandexRulesInfo.pull().then(activate);
    }
    function activate(response) {
      ($scope.yandexDns = mapToModel()),
        ($scope.loading = !1),
        $scope.$emit('pageload');
    }
    function getModeName(mode) {
      return translate(yandexModes[mode]);
    }
    function ruleMap(rule) {
      return rule
        ? _.extend(_.pick(rule, 'ip', 'mac', 'hostname', 'mode'), {
            modeName: getModeName(rule.mode),
          })
        : null;
    }
    function clientMap(client) {
      return _.extend({}, client, { rule: ruleMap(client.rule) });
    }
    function mapToModel() {
      var rules = _.map(yandexRulesInfo.getRules(), ruleMap),
        clients = _.map(yandexRulesInfo.getClients(), clientMap),
        settings = yandexRulesInfo.getSettings();
      return {
        default: settings['default'],
        enabled: settings.enabled,
        clients: clients,
        rules: rules,
      };
    }
    function createRule() {
      var rule = { isNew: !0, mode: $scope.yandexDns['default'] };
      editRule(rule);
    }
    function editRuleForClient(client) {
      var rule = client.rule || {
        ip: client.ip,
        mac: client.mac,
        mode: $scope.yandexDns['default'],
        isNew: !0,
      };
      editRule(rule);
    }
    function editRule(rule) {
      var dlg = ngDialog.open({
        template: 'dialogs/yandex_rule_edit/dialog.tpl.html',
        controller: 'yandexRuleDialogController',
        resolve: funcs.getLazyResolve(
          'dialogs/yandex_rule_edit/ctrl.lazy.js',
          'yandexRuleDialogController'
        ),
        preCloseCallback: function(dlgRule) {
          var duplicate =
            !!dlgRule &&
            dlgRule.isNew &&
            _.some($scope.yandexDns.rules, function(r) {
              return r.mac == dlgRule.mac && r.ip == dlgRule.ip;
            });
          return duplicate
            ? (alert(translate('yandex_dns_rule_exists_2')), !1)
            : !0;
        },
        data: { rule: rule },
      });
      dlg.closePromise.then(function(result) {
        if (result && result.value && !_.isString(result.value)) {
          var mappedRule = ruleMap(result.value),
            rules = $scope.yandexDns.rules;
          if (result.value.isDeleted) return void removeRules([mappedRule]);
          if (rule.isNew) rules.push(mappedRule);
          else {
            var existsRule = _.findWhere(rules, { mac: mappedRule.mac });
            _.extend(existsRule, mappedRule);
          }
          updateViewModel(rules);
        }
      });
    }
    function updateViewModel(rules) {
      yandexRulesInfo.setRules(rules), ($scope.yandexDns = mapToModel());
    }
    function removeRules(deletedRules) {
      var rules = _.reject($scope.yandexDns.rules, function(rule) {
        return !!_.findWhere(deletedRules, { ip: rule.ip, mac: rule.mac });
      });
      updateViewModel(rules);
    }
    function saveRules() {
      return yandexRulesInfo.push();
    }
    function getDefaultModeString() {
      return (
        translate('by_default') +
        ' (' +
        getModeName($scope.yandexDns['default']) +
        ')'
      );
    }
    function saveEnabled() {
      return yandexRulesInfo.wasModified();
    }
    function isNotEmpty(value) {
      return value && '' != value;
    }
    var yandexRulesInfo = device.yandexDns.rules,
      yandexModes = {};
    _.each(device.yandexDns.settings.getAvailableModes(), function(item) {
      yandexModes[item.value] = item.label;
    }),
      _.extend($scope, {
        createRule: createRule,
        editRule: editRule,
        editRuleForClient: editRuleForClient,
        removeRules: removeRules,
        getDefaultModeString: getDefaultModeString,
        saveRules: saveRules,
        yandexDns: {},
        loading: !0,
        saveEnabled: saveEnabled,
        isNotEmpty: isNotEmpty,
      }),
      refreshData();
  }
  angular
    .module('app')
    .controllerProvider.register(
      'yandexDnsRulesController',
      yandexDnsRulesController
    ),
    (yandexDnsRulesController.$inject = [
      '$scope',
      'ngDialog',
      'translate',
      'device',
      'funcs',
    ]);
})();
