'use strict';
angular
  .module('unsavedChanges', ['lazyModel', 'translate'])
  .provider('unsavedWarningsConfig', function() {
    var _this = this,
      logEnabled = !1,
      useTranslateService = !0,
      routeEvent = ['$locationChangeStart', '$stateChangeStart'],
      navigateMessage = 'You will lose unsaved changes if you leave this page',
      reloadMessage = 'You will lose unsaved changes if you reload this page';
    Object.defineProperty(_this, 'navigateMessage', {
      get: function() {
        return navigateMessage;
      },
      set: function(value) {
        navigateMessage = value;
      },
    }),
      Object.defineProperty(_this, 'reloadMessage', {
        get: function() {
          return reloadMessage;
        },
        set: function(value) {
          reloadMessage = value;
        },
      }),
      Object.defineProperty(_this, 'useTranslateService', {
        get: function() {
          return useTranslateService;
        },
        set: function(value) {
          useTranslateService = !!value;
        },
      }),
      Object.defineProperty(_this, 'routeEvent', {
        get: function() {
          return routeEvent;
        },
        set: function(value) {
          'string' == typeof value && (value = [value]), (routeEvent = value);
        },
      }),
      Object.defineProperty(_this, 'logEnabled', {
        get: function() {
          return logEnabled;
        },
        set: function(value) {
          logEnabled = !!value;
        },
      }),
      (this.$get = [
        '$injector',
        function($injector) {
          function translateIfAble(message) {
            return $injector.has('$translate') && useTranslateService
              ? $injector.get('$translate')(message)
              : !1;
          }
          var publicInterface = {
            log: function() {
              if (console.log && logEnabled && arguments.length) {
                var newarr = [].slice.call(arguments);
                'object' == typeof console.log
                  ? log.apply.call(console.log, console, newarr)
                  : console.log.apply(console, newarr);
              }
            },
          };
          return (
            Object.defineProperty(publicInterface, 'useTranslateService', {
              get: function() {
                return useTranslateService;
              },
            }),
            Object.defineProperty(publicInterface, 'reloadMessage', {
              get: function() {
                return translateIfAble(reloadMessage) || reloadMessage;
              },
            }),
            Object.defineProperty(publicInterface, 'navigateMessage', {
              get: function() {
                return translateIfAble(navigateMessage) || navigateMessage;
              },
            }),
            Object.defineProperty(publicInterface, 'routeEvent', {
              get: function() {
                return routeEvent;
              },
            }),
            Object.defineProperty(publicInterface, 'logEnabled', {
              get: function() {
                return logEnabled;
              },
            }),
            publicInterface
          );
        },
      ]);
  })
  .service('unsavedWarningSharedService', [
    '$rootScope',
    'unsavedWarningsConfig',
    '$injector',
    'translate',
    'history',
    function($rootScope, unsavedWarningsConfig, $injector, translate, history) {
      function allFormsClean() {
        return (
          (areAllFormsClean = !0),
          angular.forEach(allForms, function(item, idx) {
            unsavedWarningsConfig.log(
              'Form : ' + item.$name + ' dirty : ' + item.$dirty
            ),
              item.$dirty && (areAllFormsClean = !1);
          }),
          areAllFormsClean
        );
      }
      function tearDown() {
        unsavedWarningsConfig.log('No more forms, tearing down'),
          angular.forEach(removeFunctions, function(fn) {
            fn();
          }),
          (window.onbeforeunload = null);
      }
      function setup() {
        function isOnlyChangeUrlParams(current, next) {
          var arrCurrent = current.split('?'),
            arrNext = next.split('?');
          return arrCurrent[0] == arrNext[0];
        }
        function isExceptionState(current, next) {
          var reWanAdd = /network.wan.connection.add.+/;
          return current &&
            next &&
            reWanAdd.test(current.name) &&
            reWanAdd.test(next.name)
            ? !0
            : !1;
        }
        function confirmAction(event) {
          confirm(translate(messages.navigate))
            ? _this.setStopWatch(!0)
            : (event.preventDefault(),
              history.setCleanLastHistory(!1),
              $rootScope.$emit('stateChangeBreak'));
        }
        unsavedWarningsConfig.log('Setting up'),
          (window.onbeforeunload = _this.confirmExit);
        var eventsToWatchFor = unsavedWarningsConfig.routeEvent;
        angular.forEach(eventsToWatchFor, function(aEvent) {
          var removeFn = $rootScope.$on(aEvent, function(event) {
            if ('$locationChangeStart' == event.name) {
              var nextUrl = arguments[1],
                currentUrl = arguments[2];
              if (isOnlyChangeUrlParams(currentUrl, nextUrl)) return;
            }
            if ('$stateChangeStart' == event.name) {
              var next = arguments[1],
                current = arguments[3];
              if (isExceptionState(current, next)) return;
            }
            var backupStatus = _this.getBackup(),
              stopWatch = _this.getStopWatch();
            (_.isNull(backupStatus) && allFormsClean()) ||
              backupStatus ||
              stopWatch ||
              confirmAction(event);
          });
          removeFunctions.push(removeFn);
        });
      }
      var _this = this,
        allForms = [],
        areAllFormsClean = !0,
        removeFunctions = [angular.noop],
        isBackupForm = null,
        isStopWatch = null;
      this.allForms = function() {
        return allForms;
      };
      var messages = {
        navigate: unsavedWarningsConfig.navigateMessage,
        reload: unsavedWarningsConfig.reloadMessage,
      };
      (this.init = function(form) {
        0 === allForms.length && setup(),
          unsavedWarningsConfig.log('Registering form', form),
          allForms.push(form);
      }),
        (this.removeForm = function(form) {
          var idx = allForms.indexOf(form);
          -1 !== idx &&
            (allForms.splice(idx, 1),
            unsavedWarningsConfig.log('Removing form from watch list', form),
            0 === allForms.length && tearDown());
        }),
        (this.confirmExit = function() {
          var backupStatus = _this.getBackup();
          if (_.isNull(backupStatus)) {
            if (!allFormsClean()) return translate(messages.reload);
          } else if (!backupStatus || (!backupStatus && !allFormsClean()))
            return translate(messages.reload);
          tearDown();
        }),
        (this.setBackup = function(status) {
          isBackupForm = status;
        }),
        (this.getBackup = function() {
          return isBackupForm;
        }),
        (this.setStopWatch = function(value) {
          isStopWatch = value;
        }),
        (this.getStopWatch = function() {
          return isStopWatch;
        }),
        $rootScope.$on('unsavedStop', function(event, value) {
          _this.setStopWatch(value);
        });
    },
  ])
  .directive('unsavedWarningClear', [
    'unsavedWarningSharedService',
    function(unsavedWarningSharedService) {
      return {
        scope: !0,
        require: '^form',
        priority: 3e3,
        link: function(scope, element, attrs, formCtrl) {
          element.bind('click', function(event) {
            unsavedWarningSharedService.setBackup(null),
              unsavedWarningSharedService.setStopWatch(null),
              formCtrl.$setPristine();
          });
        },
      };
    },
  ])
  .directive('unsavedBackupStatus', [
    'unsavedWarningSharedService',
    function(unsavedWarningSharedService) {
      return {
        link: function(scope, element, attrs, formCtrl) {
          attrs.$observe('unsavedBackupStatus', function(key) {
            key &&
              unsavedWarningSharedService.setBackup('true' == key ? !0 : !1);
          });
        },
      };
    },
  ])
  .directive('unsavedCleanForm', [
    'unsavedWarningSharedService',
    function(unsavedWarningSharedService) {
      return {
        scope: !0,
        require: '^form',
        link: function(scope, element, attrs, formCtrl) {
          element.bind('click', function(event) {
            formCtrl.$setPristine();
          });
        },
      };
    },
  ])
  .directive('unsavedWarningForm', [
    'unsavedWarningSharedService',
    function(unsavedWarningSharedService) {
      return {
        require: 'form',
        link: function(scope, formElement, attrs, formCtrl) {
          unsavedWarningSharedService.init(formCtrl),
            formElement.bind('submit', function(event) {
              formCtrl.$valid &&
                (formCtrl.$setPristine(),
                unsavedWarningSharedService.setBackup(null),
                unsavedWarningSharedService.setStopWatch(null));
            }),
            scope.$on('$destroy', function() {
              unsavedWarningSharedService.removeForm(formCtrl),
                unsavedWarningSharedService.setBackup(null),
                unsavedWarningSharedService.setStopWatch(null);
            }),
            scope.$on('unsavewWarningStopWatch', function() {
              unsavedWarningSharedService.removeForm(formCtrl),
                unsavedWarningSharedService.setBackup(null),
                unsavedWarningSharedService.setStopWatch(null);
            });
        },
      };
    },
  ]),
  angular.module('lazyModel', []).directive('lazyModel', [
    '$parse',
    '$compile',
    function($parse, $compile) {
      return {
        restrict: 'A',
        priority: 500,
        terminal: !0,
        require: '^form',
        scope: !0,
        compile: function(elem, attr) {
          var ngModelGet = $parse(attr.lazyModel),
            ngModelSet = ngModelGet.assign;
          return (
            elem.attr('ng-model', 'buffer'),
            elem.removeAttr('lazy-model'),
            {
              pre: function(scope, elem) {
                (scope.buffer = ngModelGet(scope.$parent)),
                  $compile(elem)(scope);
              },
              post: function(scope, elem, attr, formCtrl) {
                for (var form = elem.parent(); 'FORM' !== form[0].tagName; )
                  form = form.parent();
                form.bind('submit', function() {
                  formCtrl.$valid &&
                    scope.$apply(function() {
                      ngModelSet(scope.$parent, scope.buffer);
                    });
                }),
                  form.bind('reset', function(e) {
                    e.preventDefault(),
                      scope.$apply(function() {
                        scope.buffer = ngModelGet(scope.$parent);
                      });
                  });
              },
            }
          );
        },
      };
    },
  ]);
