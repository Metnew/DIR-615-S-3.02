'use strict';
!(function() {
  var maxInstance = 1;
  angular.module(regdep('nw-overlay'), []).directive('nwOverlay', [
    '$document',
    function($document) {
      var document = $document[0];
      return {
        restrict: 'A',
        link: function($scope, element, attrs) {
          var instanceId = maxInstance++,
            id = 'nw-overlay-' + instanceId;
          element.on(
            'transitionend webkitTransitionEnd oTransitionEnd',
            function(e) {
              var $overlay = angular.element(document.querySelector('#' + id));
              $overlay.hasClass('transparent')
                ? ($overlay.removeClass('transparent'),
                  $overlay.addClass('opaque'))
                : ($overlay.removeClass('opaque'),
                  $overlay.addClass('transparent'));
            }
          ),
            $scope.$watch(attrs.nwOverlay, function(value) {
              if (value) {
                element.addClass('nw-overlay-target'),
                  element.append(
                    '<div id=' + id + ' class="nw-overlay opaque"></div>'
                  );
                var $overlay = angular.element(
                  document.querySelector('#' + id)
                );
                setTimeout(function() {
                  $overlay.removeClass('opaque'),
                    $overlay.addClass('transparent');
                }, 1e3);
              } else angular.element(document.querySelector('#' + id)).remove();
            });
        },
      };
    },
  ]);
})();
