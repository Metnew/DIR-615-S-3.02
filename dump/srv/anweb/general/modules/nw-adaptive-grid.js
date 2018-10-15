'use strict';
angular
  .module(regdep('nw-adaptive-grid'), [])
  .directive('nwAdaptiveGrid', function(translate) {
    return {
      restrict: 'A',
      scope: { model: '=nwAdaptiveGrid' },
      link: function($scope, $element, $attr) {
        function updateModel(newValue) {
          var span_padding = 10,
            width_span = ($element[0].offsetWidth,
            $element[0].children[0].offsetWidth),
            border = $element[0].offsetWidth - $element[0].clientWidth,
            path = 140,
            path_span = 114,
            koef = Math.floor(width_span / path_span) - 1,
            k = Math.floor((width_span - koef * span_padding) / path_span) + 1;
          switch (k) {
            case 1:
              $element.toggleClass('one_cell');
              break;
            case 2:
              $element.toggleClass('two_cells');
              break;
            case 3:
              $element.toggleClass('three_cells');
              break;
            case 4:
              $element.toggleClass('four_cells');
              break;
            case 5:
              $element.toggleClass('five_cells');
              break;
            case 6:
              $element.toggleClass('six_cells');
              break;
            case 7:
              $element.toggleClass('seven_cells');
          }
          $element.css(
            'width',
            path * k - border - 2 * span_padding + 3 * (k - 1) + 'px'
          );
          var parent_width = $element[0].offsetParent.clientWidth,
            padding = angular.element(
              document.querySelector('.checkbox-field')
            )[0].offsetLeft,
            parent_width_avail = parent_width - 2 * padding,
            max_cells = Math.floor(parent_width_avail / path),
            max_cell_width =
              path * max_cells -
              border -
              2 * span_padding +
              3 * (max_cells - 1),
            elem_mbssid = angular.element(document.querySelector('#mbssid'));
          elem_mbssid.css('width', parent_width - 2 * padding + 'px'),
            $element[0].offsetWidth > parent_width - 2 * padding &&
              $element.css('width', max_cell_width + 'px');
        }
        $scope.$watch('model', updateModel);
      },
    };
  });
