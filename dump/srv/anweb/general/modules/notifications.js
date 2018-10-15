'use strict';
!(function() {
  function NotificationsProvider() {
    var $container = null;
    (this.setContainer = function(container) {
      $container = container;
    }),
      (this.getContainer = function() {
        return $container;
      }),
      (this.$get = createNotificationsServiceFactory(this.getContainer));
  }
  function createNotificationsServiceFactory(_getContainer) {
    function NotificationsServiceFactory($timeout, $rootScope, $compile) {
      function add(notification) {
        function attachOnClose(action) {
          return function() {
            _.isFunction(action) && action(),
              onNotificationClose(closableNotification);
          };
        }
        if (!notificationInQueueAlready(notification)) {
          var closableNotification = _.extend({}, notification, {
            close: attachOnClose(notification.close, closableNotification),
          });
          _.each(closableNotification.actions, function(action) {
            action.handler = attachOnClose(action.handler);
          }),
            config.queue.push(closableNotification),
            inShowing() || nextNotification();
        }
      }
      function notificationInQueueAlready(notification) {
        if (!notification.name) return !1;
        if (
          config.currentNotification &&
          config.currentNotification.name == notification.name
        )
          return !0;
        var exists = _.findWhere(config.queue, { name: notification.name });
        return exists ? !0 : !1;
      }
      function onNotificationClose(notification) {
        removeFromDom(notification), start();
      }
      function removeFromDom(notification) {
        config.getContainer().empty();
      }
      function addToDom(notification) {
        var template =
          '<div class="nw-popup-notification nw-popup-notification--hidden" nw-notification="notification"></div>';
        config.$scope.notification = notification;
        var $elem = $compile(template)(config.$scope);
        $timeout(function() {
          return $elem.removeClass('nw-popup-notification--hidden');
        }, 0),
          config.getContainer().append($elem);
      }
      function nextNotification() {
        return _.size(config.queue)
          ? ((config.currentNotification = config.queue.shift()),
            addToDom(config.currentNotification),
            void stop())
          : void (config.currentNotification = null);
      }
      function start() {
        config.refreshCanceler = $timeout(nextNotification, config.refreshTime);
      }
      function stop() {
        config.refreshCanceler && $timeout.cancel(config.refreshCanceler),
          (config.refreshCanceler = null);
      }
      function inShowing() {
        return !config.refreshCanceler;
      }
      var config = {
        queue: [],
        currentNotification: null,
        refreshTime: 1e3,
        refreshCanceler: null,
        getContainer: function() {
          return angular.element(_getContainer());
        },
        $scope: $rootScope.$new(),
      };
      return start(), { add: add };
    }
    return (
      (NotificationsServiceFactory.$inject = [
        '$timeout',
        '$rootScope',
        '$compile',
      ]),
      NotificationsServiceFactory
    );
  }
  angular
    .module(regdep('notifications'), [])
    .provider('notifications', NotificationsProvider),
    (NotificationsProvider.$inject = []);
})();
