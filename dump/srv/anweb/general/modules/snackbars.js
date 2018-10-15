'use strict';
angular.module(regdep('snackbars'), []).factory('snackbars', [
  '$rootScope',
  '$compile',
  '$document',
  '$timeout',
  function($rootScope, $compile, $document, $timeout) {
    function add(text, time, action) {
      var msg = { text: text, time: time, action: action };
      messages.push(msg), kick();
    }
    function createAction(fn, button) {
      function isValidActionParams(fn, button) {
        return _.isFunction(fn) && _.isString(button);
      }
      return isValidActionParams(fn, button)
        ? { fn: fn, button: button }
        : null;
    }
    function kick() {
      isWorking || next();
    }
    function next() {
      return (
        (isWorking = !0),
        isStopped
          ? void 0
          : (hide(),
            $timeout.cancel(hidePromise),
            messages.length
              ? void $timeout(switchMessage(messages.shift()))
              : void (isWorking = !1))
      );
    }
    function switchMessage(nextMsg) {
      function switchByTime() {
        var netxMsgTime = parseInt(nextMsg.time, 10),
          fullShowTime = (netxMsgTime || defaultTime) + switchTime,
          queueShowTime = minimumShowTime + switchTime;
        return (
          $timeout(changeMessageAndShow, hideTime),
          messages.length
            ? void (hidePromise = $timeout(
                next,
                netxMsgTime ? fullShowTime : queueShowTime
              ))
            : ((hidePromise = $timeout(hide, fullShowTime)),
              void (isWorking = !1))
        );
      }
      function changeMessageAndShow() {
        ($scope.msg = nextMsg), show();
      }
      return switchByTime;
    }
    function show() {
      $scope.hidden = !1;
    }
    function hide() {
      $scope.hidden = !0;
    }
    function stop() {
      (isStopped = !0), $timeout.cancel(hidePromise);
    }
    function start() {
      (isStopped = !1), $timeout(next, continueTime);
    }
    function addToDOM() {
      var template =
          '<div class="snackbar_wrapper"><div class="snackbar" ng-mouseover="stop()" ng-mouseleave="start()" ng-class="{hide: hidden, show: !hidden}"><div class="msg" ng-bind="msg.text | translate"></div><button class="action flat"ng-bind="msg.action.button | translate"ng-click="msg.action.fn()"ng-if="msg.action"></button></div></div>',
        $body = angular.element($document[0].body),
        $elem = $compile(template)($scope);
      $body.append($elem);
    }
    var defaultTime = 3e3,
      minimumShowTime = 1e3,
      switchTime = 600,
      hideTime = switchTime / 2,
      continueTime = 1e3,
      messages = [],
      snackbars = { add: add, createAction: createAction },
      $scope = $rootScope.$new(),
      hidePromise = null,
      isWorking = !1,
      isStopped = !1;
    return (
      addToDOM(),
      hide(),
      ($scope.stop = stop),
      ($scope.start = start),
      snackbars
    );
  },
]);
