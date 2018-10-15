'use strict';
function _defineProperty(obj, key, value) {
  return (
    key in obj
      ? Object.defineProperty(obj, key, {
          value: value,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (obj[key] = value),
    obj
  );
}
!(function() {
  function nwControlList($q) {
    function compile($element, $attrs) {
      function hasAttr(name) {
        return _.has($attrs, params[name]);
      }
      var params = { selected: 'nwControlListSelected' },
        $item = $element.children();
      hasAttr('selected') && $item.attr('nw-control-list-item-selected', '');
    }
    function controller($scope, $element, $attrs) {
      function isReadyBodyCb(ngRepeat) {
        $scope.$parent.$watch(
          ngRepeat.items,
          function(newValue, oldValue) {
            (_.isUndefined(self.items) || newValue !== oldValue) &&
              (self.items = newValue),
              self.selected.length &&
                newValue !== oldValue &&
                self.selected.splice(0);
          },
          !0
        );
      }
      function hasSelected(item, key) {
        return findSelectedIndex(item, key) + 1;
      }
      function addSelectedItem(item, key) {
        self.selected.push({ item: item, key: key });
      }
      function removeSelectedItem(item, key) {
        var index = findSelectedIndex(item, key);
        self.selected.splice(index, 1);
      }
      function findSelectedIndex(item, key) {
        for (var items = self.selected, inx = 0; inx < items.length; inx++) {
          if (items[inx].key == key) return inx;
          if (_.isEqual(angular.copy(items[inx].item), angular.copy(item)))
            return inx;
        }
        return -1;
      }
      var self = this;
      this.items,
        (this.selected = $scope.selectedList ? $scope.selectedList : []),
        (this.isReadyBody = $q.defer()),
        this.isReadyBody.promise.then(isReadyBodyCb),
        (this.hasSelected = hasSelected),
        (this.addSelectedItem = addSelectedItem),
        (this.removeSelectedItem = removeSelectedItem),
        $scope.$watch(
          'nwControlList.selected',
          function(newValue) {
            _.isUndefined(newValue) ||
              _.isUndefined($scope.selectedList) ||
              ($scope.selectedList = newValue);
          },
          !0
        );
    }
    return {
      restrict: 'A',
      scope: { selectedList: '=nwControlListSelectedList' },
      compile: compile,
      controller: controller,
      controllerAs: 'nwControlList',
    };
  }
  function nwControlListItem(nwControlListService, $compile) {
    function compile($element, $attrs) {
      function postLink($scope, $element, $attrs, $nwControlList) {
        function toggleSelectItem($event, item, key) {
          $event.stopPropagation(),
            isDisabledItem(item, key) ||
              ($nwControlList.hasSelected(item)
                ? $nwControlList.removeSelectedItem(item, key)
                : $nwControlList.addSelectedItem(item, key));
        }
        function isSelectedItem(item, key) {
          return $nwControlList.hasSelected(item, key);
        }
        function isDisabledItem(item, key) {
          var _$scope$$eval;
          return $scope.$eval(
            $attrs[params.disabled],
            ((_$scope$$eval = {}),
            _defineProperty(_$scope$$eval, ngRepeat.key, key),
            _defineProperty(_$scope$$eval, ngRepeat.item, item),
            _$scope$$eval)
          );
        }
        var ngRepeat = nwControlListService.parse.ngRepeat($attrs.ngRepeat);
        ($scope.toggleSelectItem = toggleSelectItem),
          ($scope.isSelectedItem = isSelectedItem),
          ($scope.isDisabledItem = isDisabledItem),
          $scope.$last && $nwControlList.isReadyBody.resolve(ngRepeat);
      }
      function hasAttr(name) {
        return _.has($attrs, params[name]);
      }
      var ngRepeat = nwControlListService.parse.ngRepeat($attrs.ngRepeat),
        item = ngRepeat.item,
        key = ngRepeat.key,
        $container = {
          $primary: angular.element(
            "<div class='nw-control-list_item_primary'></div>"
          ),
          $content: angular.element(
            "<div class='nw-control-list_item_content'></div>"
          ),
        };
      return (
        hasAttr('title') &&
          $container.$content.append(
            '<div class="nw-control-list_item_title" nw-bind-html-compile=' +
              $attrs[params.title] +
              '></div>'
          ),
        hasAttr('subtitle') &&
          $container.$content.append(
            '<div class="nw-control-list_item_subtitle" nw-bind-html-compile=' +
              $attrs[params.subtitle] +
              '></div>'
          ),
        $element.addClass('nw-control-list_item'),
        hasAttr('selected') &&
          ($element.attr(
            'ng-click',
            'toggleSelectItem($event, ' + item + ', ' + key + ')'
          ),
          $element.attr(
            'ng-class',
            "{'nw-control-list_item--selected' : isSelectedItem(" +
              item +
              ', ' +
              key +
              ')}'
          )),
        $element.append($container.$primary),
        $element.append($container.$content),
        postLink
      );
    }
    var params = {
      selected: 'nwControlListItemSelected',
      title: 'nwControlListItemTitle',
      subtitle: 'nwControlListItemSubtitle',
      disabled: 'nwControlListItemDisabled',
    };
    return {
      restrict: 'A',
      require: '^^nwControlList',
      compile: compile,
      priority: 1001,
    };
  }
  function nwControlListItemSelected(nwControlListService) {
    function template($element, $attrs) {
      var $primary = angular.element(
          $element[0].querySelector('.nw-control-list_item_primary')
        ),
        ngRepeat = nwControlListService.parse.ngRepeat($attrs.ngRepeat),
        item = ngRepeat.item,
        key = ngRepeat.key,
        $checkbox = angular.element('<div nw-control-list-checkbox></div>');
      $checkbox.attr('nw-checked', 'isSelectedItem(' + item + ', ' + key + ')'),
        $checkbox.attr(
          'nw-disabled',
          'isDisabledItem(' + item + ', ' + key + ')'
        ),
        $primary.append($checkbox);
    }
    return { restrict: 'A', require: '^^nwControlList', template: template };
  }
  function nwControlListCheckbox() {
    function link($scope, $element, $attrs) {
      var $switch = angular.element($element.find('i'));
      $scope.$watch('nwChecked', function(value) {
        value
          ? $switch.addClass('nw-control-list-checkbox_switch--checked')
          : $switch.removeClass('nw-control-list-checkbox_switch--checked');
      }),
        $scope.$watch('nwDisabled', function(value) {
          _.isUndefined(value) ||
            (value
              ? ($element.addClass('nw-control-list-checkbox_field--disabled'),
                $switch.addClass('nw-control-list-checkbox_switch--disabled'))
              : ($element.removeClass(
                  'nw-control-list-checkbox_field--disabled'
                ),
                $switch.removeClass(
                  'nw-control-list-checkbox_switch--disabled'
                )));
        });
    }
    return {
      restrict: 'A',
      replace: !0,
      scope: { nwChecked: '=nwChecked', nwDisabled: '=nwDisabled' },
      template:
        '<div class="nw-control-list-checkbox_field"><i class="nw-control-list-checkbox_switch"></i></div>',
      link: link,
    };
  }
  function nwControlListService() {
    function Repeat(ngRepeat) {
      for (
        this._tokens = this.parse(ngRepeat).split(' '),
          this._iterator = 0,
          this.isNext('in')
            ? ((this.key = '$index'), (this.item = this.current()))
            : ((this.key = this.current()), (this.item = this.getNext())),
          this.delim = this.getNext(),
          this.items = this.getNext();
        this.hasNext() && -1 === ['|', 'track'].indexOf(this.getNext());

      )
        this.items += this.current();
    }
    function AttrFunction(attr) {
      (this._args = this.parse(attr)),
        (this._iterator = 0),
        this.hasCurrent() && (this.first = this.current()),
        this.hasNext() && (this.second = this.getNext());
    }
    var cache = {};
    (Repeat.prototype.parse = function(ngRepeat) {
      var delimiterChars = /[(,)]/g;
      return ngRepeat.replace(delimiterChars, '');
    }),
      (Repeat.prototype.current = function() {
        return this._tokens[this._iterator];
      }),
      (Repeat.prototype.isNext = function(name) {
        return this._tokens[this._iterator + 1] === name;
      }),
      (Repeat.prototype.getNext = function() {
        return this._tokens[++this._iterator];
      }),
      (Repeat.prototype.getValue = function() {
        return this._tokens.join(' ');
      }),
      (Repeat.prototype.hasNext = function() {
        return this._iterator < this._tokens.length - 1;
      }),
      (AttrFunction.prototype.parse = function(attr) {
        var reg = /\((.*)\)/,
          matches = attr.match(reg);
        return matches && matches.length && matches[1]
          ? matches[1].replace(/\s/g, '').split(',')
          : [];
      }),
      (AttrFunction.prototype.hasCurrent = function() {
        return this._iterator < this._args.length;
      }),
      (AttrFunction.prototype.current = function() {
        return this._args[this._iterator];
      }),
      (AttrFunction.prototype.getNext = function() {
        return this._args[++this._iterator];
      }),
      (AttrFunction.prototype.hasNext = function() {
        return this._iterator < this._args.length - 1;
      });
    var parse = (function() {
      function ngRepeat(attr) {
        return cache.hasOwnProperty(attr)
          ? cache[attr]
          : (cache[attr] = new Repeat(attr));
      }
      function attrFunction(attr) {
        return cache.hasOwnProperty(attr)
          ? cache[attr]
          : (cache[attr] = new AttrFunction(attr));
      }
      return { ngRepeat: ngRepeat, attrFunction: attrFunction };
    })();
    return { parse: parse };
  }
  var nw = angular.module(regdep('nw-control-list'), []);
  nw.directive('nwControlList', ['$q', nwControlList]),
    nw.directive('nwControlListItem', [
      'nwControlListService',
      '$compile',
      nwControlListItem,
    ]),
    nw.directive('nwControlListItemSelected', [
      'nwControlListService',
      nwControlListItemSelected,
    ]),
    nw.directive('nwControlListCheckbox', [nwControlListCheckbox]),
    nw.factory('nwControlListService', nwControlListService);
})();
