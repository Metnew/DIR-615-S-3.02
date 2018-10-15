'use strict';
!(function() {
  function nwClientList($compile, funcs, util) {
    function link($scope, $element, $attrs, $ctrl) {
      function initDropList() {
        addDropList(),
          util
            .pull($element.attr('nw-client-list-source'))
            .then(function(result) {
              ($scope[key].clients = result.clients), updateClientsInfo();
            });
      }
      function addDropList() {
        $attrs.$set('nwClientList', 'false'),
          $element.attr('nw-drop-list', ''),
          $element.attr('nw-drop-list-options', key + '.info'),
          $compile($element)($scope);
      }
      function hasDropList() {
        return (
          _.has($attrs, 'nwDropList') && _.has($attrs, 'nwDropListOptions')
        );
      }
      function updateClientsInfo() {
        if ($scope[key].clients) {
          var clients = util.prepareClientsList(
            $scope[key].clients,
            $scope[key].version,
            $scope[key].direction,
            $scope[key].exclude
          );
          $scope[key].info = util.formClientsInfo(
            clients,
            $attrs.nwClientListType
          );
        }
      }
      if ('false' != $attrs.nwClientList) {
        clientListNumber++;
        var key = 'clientList_' + clientListNumber;
        ($scope[key] = {
          info: [],
          exclude: [],
          clients: null,
          version: null,
          direction: null,
        }),
          hasDropList() || initDropList(),
          $attrs.$observe('nwClientListVersion', function(value) {
            $scope[key].version != value &&
              (($scope[key].version = value), updateClientsInfo());
          }),
          $attrs.$observe('nwClientListDirection', function(value) {
            $scope[key].direction != value &&
              (($scope[key].direction = value), updateClientsInfo());
          }),
          $attrs.$observe('nwClientListExclude', function(value) {
            value &&
              (($scope[key].exclude = $scope.$eval(value)),
              updateClientsInfo());
          });
      }
    }
    funcs.is;
    return { restrict: 'A', require: 'ngModel', link: link };
  }
  var nw = angular.module(regdep('nw-client-list'), ['devinfo']);
  nw.directive('nwClientList', [
    '$compile',
    'funcs',
    'nwClientListUtil',
    nwClientList,
  ]);
  var clientListNumber = 0;
})();
