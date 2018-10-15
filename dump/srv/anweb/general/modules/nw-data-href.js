'use strict';
angular.module(regdep('nw-data-href'), []).directive('nwDataHref', [
  'base64',
  function(base64) {
    return {
      restrict: 'AEC',
      scope: { nwDataHref: '=' },
      link: function($scope, $element, $attr) {
        $scope.$watch('nwDataHref', function(val) {
          if (_.isString(val))
            if (_.isFunction(window.navigator.msSaveBlob))
              $element[0].onclick = function() {
                window.navigator.msSaveBlob(
                  new Blob([val]),
                  $element.attr('download')
                );
              };
            else {
              var data =
                'data:application/octet-stream;base64,' + base64.encode(val);
              $element.attr('href', data);
            }
        });
      },
    };
  },
]);
