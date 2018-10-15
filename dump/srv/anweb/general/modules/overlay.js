'use strict';
!(function() {
  function overlayCore(simple, progress, notAvailable) {
    return { simple: simple, progress: progress, notAvailable: notAvailable };
  }
  function overlayHelper($document) {
    function blockFunction($event) {
      return (
        $event.preventDefault(),
        $event.stopPropagation(),
        $event.stopImmediatePropagation(),
        !1
      );
    }
    function isActivate() {
      return stackAction.length > 0;
    }
    function hasAction(action) {
      return _.contains(stackAction, action);
    }
    function blockMainPage(action) {
      isActivate() ||
        ($mainPage.bind(keyEvents, blockFunction),
        $document.bind(scrollEvents, blockFunction),
        $rootHtmlElement.addClass('disable_scroll')),
        hasAction(action) ||
          (($dialogPage = angular.element($body[0].querySelector('.ngdialog'))),
          $dialogPage &&
            ($dialogPage.bind(keyEvents, blockFunction),
            (dialogsBlock[action] = dialogsBlock[action] || []),
            (dialogsBlock[action] = dialogsBlock[action].concat($dialogPage))),
          stackAction.push(action));
    }
    function unblockMainPage(action) {
      (stackAction = _.without(stackAction, action)),
        isActivate() ||
          ($mainPage.unbind(keyEvents, blockFunction),
          $document.unbind(scrollEvents, blockFunction),
          $rootHtmlElement.removeClass('disable_scroll')),
        dialogsBlock[action] &&
          (_.each(dialogsBlock[action], function(dialog) {
            dialog.unbind(keyEvents, blockFunction);
          }),
          delete dialogsBlock[action]);
    }
    var $rootHtmlElement = angular.element($document[0].documentElement),
      $body = angular.element($document[0].body),
      $mainPage = angular.element($body.children()[0]),
      $dialogPage = null,
      keyEvents = 'keydown keyup keypress',
      scrollEvents = 'touchmove',
      stackAction = [],
      dialogsBlock = {};
    return { blockMainPage: blockMainPage, unblockMainPage: unblockMainPage };
  }
  function overlaySimple($rootScope, $compile, $document, helper) {
    function start(params) {
      stackEvents.push(params.event), helper.blockMainPage('overlay-simple');
    }
    function stop(params) {
      params.force
        ? (stackEvents.length = 0)
        : (stackEvents = _.without(stackEvents, params.event)),
        0 == stackEvents.length && helper.unblockMainPage('overlay-simple');
    }
    var template =
        '<div class="overlay-simple" ng-class="getOverlayClass()"><nw-progress-circular ng-if="!overlayIsHidden()"></nw-progress-circular></div>',
      elemScope = $rootScope.$new();
    elemScope.dots = _.range(8);
    var stackEvents = [];
    (elemScope.overlayIsHidden = function() {
      return !stackEvents.length;
    }),
      (elemScope.getOverlayClass = function() {
        return elemScope.overlayIsHidden()
          ? 'overlay-simple--hide'
          : 'overlay-simple--show';
      });
    var $body = angular.element($document[0].body),
      $elem = $compile(template)(elemScope);
    return $body.append($elem), { start: start, stop: stop };
  }
  function overlayProgress(
    $rootScope,
    $compile,
    $document,
    $timeout,
    translate,
    helper
  ) {
    function start(params) {
      params.duration &&
        ((elemScope.isShow = !0),
        (elemScope.step = {
          duration: params.duration,
          callback: function(status) {
            'finished' == status && stop(),
              params.callback && params.callback(status);
          },
          pause: params.pause || !1,
        }),
        (elemScope.title = params.title ? translate(params.title) : ''),
        helper.blockMainPage('overlay-progress'));
    }
    function stop() {
      (elemScope.isShow = !1),
        (elemScope.step = null),
        helper.unblockMainPage('overlay-progress');
    }
    var template =
        '<div class="overlay-progress" ng-class="getOverlayClass()"><div class="overlay-progress__content"><div class="overlay-progress__logo"></div><div class="overlay-title" ng-if="title.length > 1" ng-bind="title | translate"></div> <nw-auto-progress-bar ng-if="isShow" pb-duration="step.duration" pb-callback="step.callback(status)" pb-pause="step.pause"></nw-auto-progress-bar></div></div>',
      $body = angular.element($document[0].body),
      elemScope = $rootScope.$new();
    (elemScope.isShow = !1),
      (elemScope.step = null),
      (elemScope.getOverlayClass = function() {
        return elemScope.isShow
          ? 'overlay-progress--show'
          : 'overlay-progress--hide';
      });
    var $elem = $compile(template)(elemScope);
    return $body.append($elem), { start: start, stop: stop };
  }
  function overlayNotAvailable(
    $rootScope,
    $compile,
    $document,
    translate,
    helper
  ) {
    function setStates(mode, count) {
      function getBoxState(mode, count) {
        switch (mode) {
          case 'basic':
            switch (count) {
              case 1:
                return 'first';
              case 2:
                return 'second';
              default:
                return 'main';
            }
          case 'static':
            return 'static';
          default:
            return 'none';
        }
      }
      function getTextBoxState(mode, count) {
        switch (mode) {
          case 'basic':
            return count > 2 ? 'show' : 'hide';
          case 'static':
            return 'show';
          default:
            return 'hide';
        }
      }
      function getIconState(mode, count) {
        return 'basic' == mode
          ? 1 == count || 2 == count
            ? 'warning'
            : 'error'
          : 'warning';
      }
      (elemScope.state = 'show'),
        (elemScope.box = getBoxState(mode, count)),
        (elemScope.textBox = getTextBoxState(mode, count)),
        (elemScope.iconBox = 'show'),
        (elemScope.iconState = getIconState(mode, count));
    }
    function clearStates() {
      (elemScope.state = 'hide'),
        (elemScope.box = 'none'),
        (elemScope.textBox = 'hide'),
        (elemScope.iconBox = 'hide'),
        elemScope.iconState || (elemScope.iconState = 'warning');
    }
    function start(mode, count) {
      setStates(mode, count), helper.blockMainPage('overlay-not-available');
    }
    function stop() {
      clearStates(), helper.unblockMainPage('overlay-not-available');
    }
    var template =
        '<div class="overlay-not-available" ng-class="getOverlayClass()"><div class="overlay-not-available-text" ng-class="getOverlayTextBoxClass()"><div class="overlay-not-available-text__title-container"><svg svg-icon="warning_circle" class="overlay-not-available-text__title-icon"></svg><div class="overlay-not-available-text__title-text" ng-bind="\'deviceIsNotAvailableTitle\' | translate"></div></div><div class="overlay-not-available-text__subtitle" ng-bind="\'deviceIsNotAvailableSubtitle\' | translate"> </div><ul class="overlay-not-available-text__reason" ><li ng-bind="\'deviceIsNotAvailableReasonLAN\' | translate"></li><li ng-bind="\'deviceIsNotAvailableReasonWiFi\' | translate"></li></ul><div class="overlay-not-available-text__attention" ng-bind="getTextBoxAttention()"> </div></div><div class="overlay-not-available-icon" ng-class="getOverlayIconBoxClass()"><svg svg-icon="device-error" ng-show="showIcon(\'error\')" class="overlay-not-available-icon__device"></svg><svg svg-icon="device-warn"  ng-show="showIcon(\'warning\')" class="overlay-not-available-icon__device"></svg><div class="tooltip top">{{\'deviceIsNotAvailableTitle\' | translate}}</div>',
      elemScope = $rootScope.$new();
    clearStates(),
      (elemScope.getOverlayClass = function() {
        return (
          'overlay-not-available--' +
          elemScope.state +
          ' overlay-not-available--' +
          elemScope.box
        );
      }),
      (elemScope.getOverlayTextBoxClass = function() {
        return 'overlay-not-available-text--' + elemScope.textBox;
      }),
      (elemScope.getOverlayIconBoxClass = function() {
        return 'overlay-not-available-icon--' + elemScope.iconBox;
      }),
      (elemScope.showIcon = function(name) {
        return elemScope.iconState === name;
      }),
      (elemScope.getTextBoxAttention = function() {
        return translate(
          'static' == elemScope.box
            ? 'deviceIsNotAvailableAttentionStatic'
            : 'deviceIsNotAvailableAttention'
        );
      });
    var $body = angular.element($document[0].body),
      $elem = $compile(template)(elemScope);
    return $body.append($elem), { start: start, stop: stop };
  }
  var overlayModule = angular.module(regdep('overlay'), []);
  overlayModule.service('overlay-core', [
    'overlay-simple',
    'overlay-progress',
    'overlay-not-available',
    overlayCore,
  ]),
    overlayModule.service('overlay-helper', ['$document', overlayHelper]),
    overlayModule.service('overlay-simple', [
      '$rootScope',
      '$compile',
      '$document',
      'overlay-helper',
      overlaySimple,
    ]),
    overlayModule.service('overlay-progress', [
      '$rootScope',
      '$compile',
      '$document',
      '$timeout',
      'translate',
      'overlay-helper',
      overlayProgress,
    ]),
    overlayModule.service('overlay-not-available', [
      '$rootScope',
      '$compile',
      '$document',
      'translate',
      'overlay-helper',
      overlayNotAvailable,
    ]);
})();
