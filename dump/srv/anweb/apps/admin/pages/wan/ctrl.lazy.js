'use strict';
!(function() {
  function WanCoreCtrl(
    $scope,
    $rootScope,
    $state,
    $q,
    translate,
    ngDialog,
    devinfo,
    mode,
    defineConstants
  ) {
    function fetch(force) {
      function success() {
        mode.isSupport()
          ? mode.init().then(deferred.resolve)
          : deferred.resolve();
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' }),
          deferred.reject();
      }
      function needPull(force) {
        if (force) return !0;
        var data = wan.data();
        return !data || _.isEmpty(data);
      }
      var deferred = $q.defer();
      return (
        needPull(force) ? pull().then(success, error) : success(),
        deferred.promise
      );
    }
    function cut(items) {
      function showWarning(items) {
        function startDialog(options) {
          return ngDialog.open({
            template: 'dialogs/confirm/dialog.tpl.html',
            controller: 'ConfirmDialogCtrl',
            className: 'dialog_confirm',
            data: options,
          });
        }
        function closeDialog(result) {
          var deferred = $q.defer();
          return (
            result.value ? deferred.resolve(items) : deferred.reject(),
            deferred.promise
          );
        }
        function getContent(items, warnings) {
          function getDefaultGatewayMsg(content, warnings) {
            var connectionsNames = [];
            if (
              (_.each(warnings, function(elem) {
                'default_gateway' == elem.warning &&
                  connectionsNames.push(elem.connection.Name);
              }),
              !connectionsNames.length)
            )
              return '';
            if (connectionsNames.length > 1)
              var startMsg = 'wanDefaultGatewayWarningConnections',
                connsMsg =
                  '(<strong>' + connectionsNames.join(', ') + '</strong>)',
                endMsg = 'wanDefaultGatewayWarningConnections2';
            else
              var startMsg = 'wanDefaultGatewayWarningConnection',
                connsMsg =
                  '<strong>' + connectionsNames.join(', ') + '</strong>',
                endMsg = 'wanDefaultGatewayWarningConnection2';
            return (
              '<div class="dialog_content_text dialog_content_text--left">' +
              translate(startMsg) +
              ' ' +
              connsMsg +
              ' ' +
              translate(endMsg) +
              '.</div>'
            );
          }
          function getHigherConnectionMsg(content, warnings) {
            var connectionsNames = [],
              higherConnectionsNames = [];
            if (
              (_.each(warnings, function(elem) {
                'has_higher_level' == elem.warning &&
                  (connectionsNames.push(elem.connection.Name),
                  higherConnectionsNames.push(elem.higher.Name));
              }),
              !connectionsNames.length)
            )
              return '';
            var startMsg = 'wanHigherConnectionWarning1',
              connsMsg =
                '<strong>' + higherConnectionsNames.join(', ') + '</strong>',
              middleMsg = 'wanHigherConnectionWarning2',
              higherConnsMsg =
                '<strong>' + connectionsNames.join(', ') + '</strong>',
              endMsg = 'wanHigherConnectionWarning3';
            return (
              '<div class="dialog_content_text dialog_content_text--left">' +
              translate(startMsg) +
              ' ' +
              connsMsg +
              ' ' +
              translate(middleMsg) +
              ' ' +
              higherConnsMsg +
              ' ' +
              translate(endMsg) +
              '.</div>'
            );
          }
          function getEndMsg(content, items) {
            var endMsg =
              items.length > 1
                ? 'deleteWanConnectionsWarningAnswer'
                : 'deleteWanConnectionWarningAnswer';
            return (
              '<div class="dialog_content_text dialog_content_text--left">' +
              translate(endMsg) +
              '</div>'
            );
          }
          var content = '';
          return (
            (content += getDefaultGatewayMsg(content, warnings)),
            (content += getHigherConnectionMsg(content, warnings)),
            (content += getEndMsg(content, items))
          );
        }
        var warnings = device.wan.checkRemoveWarning(items),
          content = getContent(items, warnings);
        return startDialog({ content: content }).closePromise.then(closeDialog);
      }
      function cutConnections(items) {
        return (
          _.each(items, function(item) {
            var type = item.type,
              inx = item.inx;
            device.wan[type].cut(inx);
          }),
          $q.when()
        );
      }
      return (
        _.isArray(items) || (items = [items]),
        showWarning(items).then(cutConnections)
      );
    }
    function save() {
      function success() {
        deferred.resolve();
      }
      function error() {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' }),
          deferred.reject();
      }
      var deferred = $q.defer();
      return push().then(success, error), deferred.promise;
    }
    function update() {
      return save().then(function() {
        return fetch(!0);
      });
    }
    function pull() {
      var deferred = $q.defer();
      return (
        wan.pull(function(error) {
          return error ? void deferred.reject('pull') : void deferred.resolve();
        }),
        deferred.promise
      );
    }
    function push() {
      var deferred = $q.defer();
      return (
        wan.push(function(error) {
          return error ? void deferred.reject('push') : void deferred.resolve();
        }),
        deferred.promise
      );
    }
    var device = $scope.device,
      wan = (device.wan.supported, $scope.device.wan);
    ($scope.wanCore = {
      fetch: fetch,
      cut: cut,
      save: save,
      update: update,
      mode: mode,
    }),
      ($scope.wanCore.isActivate = !0);
    $scope.wanCore;
  }
  angular
    .module('app')
    .controllerProvider.register('WanCoreCtrl', [
      '$scope',
      '$rootScope',
      '$state',
      '$q',
      'translate',
      'ngDialog',
      'devinfo',
      'wanMode',
      'wanDefineConstants',
      WanCoreCtrl,
    ]);
})();
