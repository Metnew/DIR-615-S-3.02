'use strict';
function _typeof(obj) {
  return obj && 'undefined' != typeof Symbol && obj.constructor === Symbol
    ? 'symbol'
    : typeof obj;
}
angular.module('app').controllerProvider.register('UpnpCtrl', [
  '$scope',
  'somovd',
  function($scope, somovd) {
    function init() {
      function initCallback(data) {
        ($scope.upnp = data.rq[0].data.upnp),
          isError(data.rq[1]) || ($scope.igdList = data.rq[1].data),
          $scope.$emit('pageload');
      }
      somovd.read([66, 194], initCallback);
    }
    function isError(data) {
      return (
        'object' !==
          ('undefined' == typeof data ? 'undefined' : _typeof(data)) ||
        !('status' in data) ||
        data.status >= 50 ||
        0 === data.status
      );
    }
    ($scope.showTable = !0),
      init(),
      ($scope.getCaption = function(item) {
        return item.descr + ' (' + item.protocol + ')';
      }),
      ($scope.getShort = function(item) {
        return item.addr + ' (' + item.port + ':' + item.ext_port + ')';
      }),
      ($scope.upnpChange = function() {
        function changeCb(data) {
          isError(data) && alert('Something wrong');
        }
        somovd.write(66, { enable: $scope.upnp.enable }, changeCb);
      });
  },
]);
