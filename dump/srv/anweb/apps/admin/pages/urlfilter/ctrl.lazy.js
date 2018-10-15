'use strict';
!(function() {
  function UrlFilterCtrl(
    $scope,
    $state,
    $location,
    constants,
    translate,
    util,
    funcs,
    devinfo,
    ngDialog
  ) {
    function activate() {
      function success() {
        (helper = util.makeHelper()),
          (urlfilter.config = helper.getConfig()),
          (urlfilter.list = helper.getList()),
          (urlfilter.clientsList = helper.getClientsList()),
          (urlfilter.focus = !1),
          (__backupList = angular.copy(urlfilter.list)),
          constants.RLX_819X_DNS_FILTER
            ? devinfo.once('client').then(function(result) {
                (urlfilter.client = result.client),
                  (urlfilter.isActivate = !0),
                  $scope.$emit('pageload');
              }, error)
            : ((urlfilter.isActivate = !0), $scope.$emit('pageload')),
          overlayId &&
            ($scope.overlay.circular.stop(overlayId), (overlayId = null));
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      util
        .pull()
        .then(success)
        ['catch'](error);
    }
    function apply() {
      function error(response) {
        $scope.overlay.circular.stop(overlayId),
          (overlayId = null),
          $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      if ($scope.form.$valid && wasModified()) {
        overlayId = $scope.overlay.circular.start();
        var settings = util.needPrepareSettings()
          ? helper.prepareSettings(funcs.deepClone(urlfilter))
          : funcs.deepClone(urlfilter);
        util
          .push(settings)
          .then(activate)
          ['catch'](error);
      }
    }
    function defaultRule() {
      var rule = {};
      return (
        (rule.url = ''), constants.BROADCOM_MODEM && (rule.port = 80), rule
      );
    }
    function addRule() {
      var rule = defaultRule();
      ($scope.urlfilter.focus = !0), updateRule('add', rule);
    }
    function setRule(rule, inx) {
      updateRule('set', rule, inx);
    }
    function removeRule(inx) {
      updateRule('remove', null, inx);
    }
    function updateRule(action, rule, inx) {
      switch (
        (rule && (rule = angular.fromJson(angular.toJson(rule))), action)
      ) {
        case 'add':
          helper.addRule(rule);
          break;
        case 'set':
          helper.setRule(rule, inx);
          break;
        case 'remove':
          helper.removeRule(inx);
      }
      urlfilter.list = helper.getList();
    }
    function getTypesList() {
      var result = [];
      return (
        result.push({ name: 'urlfilterTypeExlude', value: 'Exclude' }),
        constants.RALINK_MODEM ||
          constants.BROADCOM ||
          result.push({ name: 'urlfilterTypeInclude', value: 'Include' }),
        result
      );
    }
    function getClientModeList() {
      var result = [
        { name: 'urlfilterClientModeBlack', value: 'Black' },
        { name: 'urlfilterClientModeWhite', value: 'White' },
      ];
      return result;
    }
    function getHTTPSWarning() {
      return (
        translate('urlfilter_list_https_warning_1') +
        ' (' +
        translate('urlfilter_list_https_warning_2') +
        ' <a ui-sref="firewall.ipfilter.info">' +
        translate('navFirewall') +
        '/' +
        translate('navFirewallIPFilter') +
        '</a>)'
      );
    }
    function validationUrl(url, index) {
      function containsProtocol(url) {
        return /^(ht|f)tp(s?)\:/.test(url);
      }
      function containsSubAddress(url) {
        return url.split('/').length > 1;
      }
      function isUniq(url, without) {
        return _.every(urlfilter.list, function(elem, index) {
          return elem.__removed ? !0 : without == index ? !0 : elem.url != url;
        });
      }
      return url
        ? containsProtocol(url)
          ? 'error_urllist_rule_url_contains_protocol'
          : constants.BROADCOM && containsSubAddress(url)
            ? 'error_urllist_rule_url_contains_subadress'
            : isUniq(url, index)
              ? null
              : 'error_urllist_rule_is_not_uniq'
        : null;
    }
    function supportedParam(param) {
      return _.has(urlfilter.config, param);
    }
    function wasModified() {
      return helper ? helper.wasModified(urlfilter.config) : !1;
    }
    function onAddClient() {
      showDialog({
        rule: {},
        client: urlfilter.client,
        clientsList: urlfilter.clientsList,
      });
    }
    function onEditClient(item, inx) {
      showDialog({
        rule: item,
        inx: inx,
        client: urlfilter.client,
        clientsList: urlfilter.clientsList,
      });
    }
    function showDialog(options) {
      function startDialog(options) {
        return ngDialog.open({
          template: 'dialogs/urlfilter_client_form/dialog.tpl.html',
          controller: 'UrlFilterClientFormDialogCtrl',
          scope: $scope,
          data: options,
        });
      }
      function closeDialog(result) {
        result &&
          result.value &&
          (void 0 != result.value.id
            ? ('save' == result.value.action &&
                (urlfilter.clientsList[result.value.id] = result.value.rule),
              'remove' == result.value.action &&
                (delete urlfilter.clientsList[result.value.id],
                (urlfilter.clientsList = _.compact(urlfilter.clientsList))))
            : urlfilter.clientsList.push(result.value.rule),
          helper.updateClientsList(urlfilter.clientsList));
      }
      startDialog(options).closePromise.then(closeDialog);
    }
    function onDeleteClient(item, inx) {
      _.each(inx, function(num) {
        delete urlfilter.clientsList[num];
      }),
        (urlfilter.clientsList = _.compact(urlfilter.clientsList)),
        helper.updateClientsList(urlfilter.clientsList);
    }
    $scope.urlfilter = {
      isActivate: !1,
      isBroadcom: constants.BROADCOM,
      isBroadcomModem: constants.BROADCOM_MODEM,
      isRLX819XFilter: constants.RLX_819X_DNS_FILTER,
      config: null,
      list: null,
      apply: apply,
      addRule: addRule,
      setRule: setRule,
      removeRule: removeRule,
      getTypesList: getTypesList,
      getClientModeList: getClientModeList,
      getHTTPSWarning: getHTTPSWarning,
      validationUrl: validationUrl,
      supportedParam: supportedParam,
      wasModified: wasModified,
      clientsList: [],
      onAddClient: onAddClient,
      onEditClient: onEditClient,
      onDeleteClient: onDeleteClient,
    };
    var helper,
      urlfilter = $scope.urlfilter,
      __backupList = null,
      overlayId = null;
    activate();
  }
  angular
    .module('app')
    .controllerProvider.register('UrlFilterCtrl', [
      '$scope',
      '$state',
      '$location',
      'urlfilterConstants',
      'translate',
      'urlfilterUtil',
      'funcs',
      'devinfo',
      'ngDialog',
      UrlFilterCtrl,
    ]);
})();
