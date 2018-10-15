'use strict';
angular.module('app').controller('NoticeCtrl', [
  '$rootScope',
  '$scope',
  '$state',
  '$timeout',
  '$window',
  'translate',
  'notice',
  'device',
  'somovd',
  'funcs',
  function(
    $rootScope,
    $scope,
    $state,
    $timeout,
    $window,
    translate,
    notice,
    device,
    somovd,
    funcs
  ) {
    function update() {
      function isNew(name) {
        return _.every($scope.notifications, function(elem) {
          return elem.name != name;
        });
      }
      function cleanNotice(names) {
        for (var index = $scope.notifications.length - 1; index >= 0; index--) {
          var name = $scope.notifications[index].name;
          _.contains(names, name) || $scope.notifications.splice(index, 1);
        }
      }
      function addToList(name, view, index) {
        var item = { name: name, view: view };
        return _.isUndefined(index)
          ? void $scope.notifications.push(item)
          : void $scope.notifications.splice(index, 0, item);
      }
      var list = notice.getList(),
        names = _.pluck(list, 'name');
      cleanNotice(names),
        _.each(list, function(elem, index) {
          var name = elem.name,
            content = (elem.params, elem.view);
          elem.view && isNew(name) && addToList(name, content, index);
        });
    }
    ($scope.notifications = []),
      notice.subscribe(update),
      $scope.$emit('pageload');
  },
]);
