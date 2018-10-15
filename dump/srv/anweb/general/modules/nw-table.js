'use strict';
var sorttt;
!(function() {
  function nwTable($compile, $q, $timeout, nwTableService) {
    var compile = function($element, $attrs) {
        function hasAttr(name) {
          return !_.isUndefined($attrs[name]);
        }
        var $container = angular.element(
            '<div class="nw-table-empty-container" ng-if="' +
              $attrs.nwTableEmptyStatus +
              '"></div>'
          ),
          $titleEmpty = angular.element(
            '<div class="title" ng-bind="\'' +
              $attrs.nwTableEmptyTitle +
              '\' | translate"></div>'
          ),
          $buttonPanel = angular.element('<div class="buttons-panel"></div>');
        if ($attrs.nwTableEmptyButton)
          var buttons =
            '<button type="button" class="colored flat" ng-bind="\'' +
            $attrs.nwTableEmptyButton +
            '\' | translate"ng-click="' +
            $attrs.nwTableEmptyButtonClick +
            '"></button>';
        $attrs.nwTableEmptyButton2 &&
          (buttons +=
            '<button type="button" class="colored flat" ng-bind="\'' +
            $attrs.nwTableEmptyButton2 +
            '\' | translate"ng-click="' +
            $attrs.nwTableEmptyButton2Click +
            '"></button>'),
          $buttonPanel.append(buttons);
        var $subtitleEmpty = angular.element(
          '<div class="subtitle" ng-bind="\'' +
            $attrs.nwTableEmptySubtitle +
            '\' | translate"></div>'
        );
        $container.append($titleEmpty),
          $container.append($buttonPanel),
          $container.append($subtitleEmpty),
          $element.append($container);
        var $table = $element.find('table');
        $table.attr('ng-if', '!' + $attrs.nwTableEmptyStatus);
        var $head = $element.find('thead'),
          $body = $element.find('tbody'),
          $row = { $head: $head.find('tr'), $body: $body.find('tr') },
          $cell = { $head: $row.$head.find('th') };
        if (
          ($table.addClass('nw-mini-table'),
          $row.$head.attr('nw-table-head-row', ''),
          $row.$body.attr('nw-table-row', ''),
          (hasAttr('nwTableSelected') || hasAttr('nwTableOnEdit')) &&
            $row.$body.attr('nw-table-row-action', ''),
          hasAttr('nwTableSelected') &&
            ($row.$head.attr('nw-table-row-select-all', ''),
            $row.$body.attr('nw-table-row-select', '')),
          hasAttr('nwTableOnEdit') && $row.$body.attr('nw-table-row-click', ''),
          hasAttr('nwTableSorted'))
        ) {
          $row.$head.attr('nw-table-row-sorted', '');
          var $toggleMenu = angular.element('<div></div>');
          $toggleMenu.addClass('block_toggle_menu'),
            _.each($cell.$head, function(elem) {
              var $cell = angular.element(elem),
                itemMenu = angular.element(
                  "<div class='item_toggle_menu'></div>"
                ),
                param = $cell.attr('nw-table-sort-param');
              if ($cell.attr('ng-bind')) {
                var $thSpan = angular.element('<span></span>');
                $thSpan.attr('ng-bind', $cell.attr('ng-bind'));
                var $thSpan2 = angular.element(
                  "<span class='toggle_text'></span>"
                );
                $thSpan2.attr('ng-bind', $cell.attr('ng-bind')),
                  $cell.append($thSpan),
                  itemMenu.addClass('sortable'),
                  itemMenu.attr(
                    'ng-click',
                    'rearrangeColumn($event, "' + param + '")'
                  ),
                  itemMenu.attr('ng-class', 'getColumnClass("' + param + '")'),
                  itemMenu.append($thSpan2),
                  $cell.removeAttr('ng-bind');
              }
              var $arrow = angular.element(
                  '<span class="sortable-icon-box"><svg svg-icon="arrow"></svg></span>'
                ),
                $arrow2 = angular.element(
                  '<span class="sortable-icon-box"><svg svg-icon="arrow"></svg></span>'
                );
              $cell.append($arrow),
                itemMenu.append($arrow2),
                $toggleMenu.append(itemMenu);
            }),
            $row.$head.append($toggleMenu);
        }
        if (hasAttr('nwTableLimit')) {
          var $divLimit = angular.element("<div class='nwtable_limit'></div>"),
            $divTableFixedContainer = angular.element(
              "<div class='nwtable_fixed-container'></div>"
            );
          $divLimit.append($table),
            $divTableFixedContainer.append($divLimit),
            _.each($cell.$head, function(elem) {
              var $divFixed = angular.element(
                  "<div class='nwtable_fixed-cell'></div>"
                ),
                $cell = angular.element(elem);
              if ($cell.attr('ng-bind')) {
                var $thSpan = angular.element('<span></span>');
                $thSpan.attr('ng-bind', $cell.attr('ng-bind')),
                  $cell.append($thSpan),
                  $divFixed.attr('ng-bind', $cell.attr('ng-bind')),
                  $cell.append($divFixed),
                  $cell.removeAttr('ng-bind');
              } else $divFixed.append($cell.clone().contents()), $cell.append($divFixed);
            }),
            $row.$head.addClass('nwtable_fixed-header'),
            $element.append($divTableFixedContainer);
        }
        return postLink;
      },
      postLink = function($scope, $element, $attrs) {
        var toolbar = '<div nw-table-toolbar></div>';
        $element.prepend($compile(toolbar)($scope));
      },
      controller = function($scope, $element, $attrs) {
        function isReadyBodyCb(ngRepeat) {
          $scope.$parent.$watch(
            ngRepeat.items,
            function(newValue, oldValue) {
              (_.isUndefined(self.items) || newValue !== oldValue) &&
                (self.items = newValue),
                self.selected.length &&
                _.has($attrs, 'nwTableSelectedMatchedFunc')
                  ? (self.selected = _.filter(self.selected, function(item) {
                      return self.action.matched(item, newValue);
                    }))
                  : self.selected.length &&
                    newValue !== oldValue &&
                    self.selected.splice(0);
            },
            !0
          );
        }
        function findSelectedIndex(item, key) {
          for (var items = self.selected, inx = 0; inx < items.length; inx++) {
            if (items[inx].key == key) return inx;
            if (_.isEqual(items[inx].item, item)) return inx;
          }
          return -1;
        }
        var self = this;
        this.items,
          (this.selected = $scope.selectedRows = []),
          (this.showToggle = !1),
          ($scope.sortParamInit = $attrs.nwTableSortParamInit
            ? $attrs.nwTableSortParamInit
            : ''),
          ($scope.sortDirectionInit = $attrs.nwTableSortDirectionInit
            ? $attrs.nwTableSortDirectionInit
            : 'desc'),
          $scope.sortParam ||
            ($scope.sortParam = angular.copy($scope.sortParamInit)),
          $scope.sortDirection ||
            ($scope.sortDirection = angular.copy($scope.sortDirectionInit)),
          _.has($attrs, 'nwTableSorted') &&
            $timeout(function() {
              self.action.sorted($scope.sortParam, $scope.sortDirection);
            }),
          (this.isReadyBody = $q.defer()),
          this.isReadyBody.promise.then(isReadyBodyCb),
          (this.isAction = function(name) {
            function capitalizeFirstLetter(str) {
              return str.charAt(0).toUpperCase() + str.slice(1);
            }
            var attr = $attrs['nwTableOn' + capitalizeFirstLetter(name)];
            return _.isUndefined(attr) ? !1 : !0;
          }),
          (this.action = {
            add: function($event) {
              $event.preventDefault(), $scope.onAddDisable() || $scope.onAdd();
            },
            delete: function($event) {
              if (($event.preventDefault(), self.isSelected())) {
                var params = {},
                  args = nwTableService.parse.attrFunction(
                    $attrs.nwTableOnDelete
                  );
                args.first &&
                  (params[args.first] = _.pluck(self.selected, 'item')),
                  args.second &&
                    (params[args.second] = _.pluck(self.selected, 'key')),
                  $scope.onDelete(params);
              }
            },
            edit: function($event, item, key) {
              $event.preventDefault();
              var params = {},
                args = nwTableService.parse.attrFunction($attrs.nwTableOnEdit);
              args.first && (params[args.first] = item),
                args.second && (params[args.second] = key),
                $scope.onEdit(params);
            },
            customEvent: function($event) {
              $event.preventDefault(),
                $scope.onCustomEventDisable() || $scope.onCustomEvent();
            },
            secondCustomEvent: function($event) {
              $event.preventDefault(), $scope.onSecondCustomEvent();
            },
            customEventOnSelected: function($event) {
              if (
                ($event.preventDefault(),
                self.isSelected() && !$scope.onCustomEventOnSelectedDisable())
              ) {
                var params = {},
                  args = nwTableService.parse.attrFunction(
                    $attrs.nwTableOnCustomEventOnSelected
                  );
                args.first &&
                  (params[args.first] = _.pluck(self.selected, 'item')),
                  args.second &&
                    (params[args.second] = _.pluck(self.selected, 'key')),
                  $scope.onCustomEventOnSelected(params);
              }
            },
            sorted: function(param, direction) {
              var params = {},
                args = nwTableService.parse.attrFunction(
                  $attrs.nwTableSortedFunc
                );
              args.first && (params[args.first] = param),
                args.second && (params[args.second] = direction),
                $scope.sortedFunc(params);
            },
            matched: function(item, items) {
              var params = {},
                args = nwTableService.parse.attrFunction(
                  $attrs.nwTableSelectedMatchedFunc
                );
              return (
                args.first && (params[args.first] = item),
                args.second && (params[args.second] = items),
                $scope.matchedFunc(params)
              );
            },
          }),
          (this.sortMenu = function() {
            var blockToggleMenu = angular.element(
              document.getElementsByClassName('block_toggle_menu')[0]
            );
            this.showToggle
              ? (blockToggleMenu.css('display', 'none'), (this.showToggle = !1))
              : (blockToggleMenu.css('display', 'block'),
                (this.showToggle = !0));
          }),
          (this.rowsSize = function() {
            return _.isArray(this.items)
              ? this.items.length
              : _.size(this.items);
          }),
          (this.hasRows = function() {
            return this.rowsSize() > 0;
          }),
          (this.isSelected = function() {
            return this.selected.length;
          }),
          (this.hasSelected = function(item, key) {
            return findSelectedIndex(item, key) + 1;
          }),
          (this.hasSelectedAll = function() {
            return this.hasRows() && this.rowsSize() == this.selected.length;
          }),
          (this.addSelectedItem = function(item, key) {
            this.selected.push({ item: item, key: key });
          }),
          (this.removeSelectedItem = function(item, key) {
            var index = findSelectedIndex(item, key);
            this.selected.splice(index, 1);
          }),
          (this.addSelectedAllItems = function() {
            _.each(
              this.items,
              function(item, key) {
                this.hasSelected(item, key) || this.addSelectedItem(item, key);
              },
              this
            );
          }),
          (this.removeSelectedAllItems = function() {
            _.each(
              this.items,
              function(item, key) {
                this.hasSelected(item, key) &&
                  this.removeSelectedItem(item, key);
              },
              this
            );
          }),
          (this.changeSortParam = function(param) {
            $scope.sortParam != param
              ? (($scope.sortParam = param),
                ($scope.sortDirection = angular.copy($scope.sortDirectionInit)))
              : ($scope.sortDirection =
                  'desc' == $scope.sortDirection ? 'asc' : 'desc'),
              this.action.sorted($scope.sortParam, $scope.sortDirection);
          }),
          (this.getSortParam = function() {
            return $scope.sortParam;
          }),
          (this.getSortDirection = function() {
            return $scope.sortDirection;
          }),
          (this.getDefaultDirection = function() {
            return $scope.sortDirectionInit;
          });
      };
    return {
      restrict: 'A',
      scope: {
        title: '@nwTableTitle',
        needEmptyTitle: '=nwTableNeedEmptyTitle',
        desc: '@nwTableDesc',
        empty: '=nwTableEmptyStatus',
        emptyDesc: '@nwTableEmptySubtitle',
        onAdd: '&nwTableOnAdd',
        onAddDisable: '&nwTableOnAddDisable',
        onAddHide: '&nwTableOnAddHide',
        onDelete: '&nwTableOnDelete',
        onEdit: '&nwTableOnEdit',
        onCustomEvent: '&nwTableOnCustomEvent',
        onSecondCustomEvent: '&nwTableOnSecondCustomEvent',
        customEventName: '@nwTableCustomEventName',
        secondCustomEventName: '@nwTableSecondCustomEventName',
        onCustomEventOnSelected: '&nwTableOnCustomEventOnSelected',
        matchedFunc: '&nwTableSelectedMatchedFunc',
        onCustomEventOnSelectedDisable:
          '&nwTableOnCustomEventOnSelectedDisable',
        onCustomEventDisable: '&nwTableOnCustomEventDisable',
        selectedRows: '=?nwTableSelected',
        sortedFunc: '&nwTableSortedFunc',
        isSorted: '@nwTableSortedFunc',
        toolbarDisabled: '&nwTableToolbarDisabled',
      },
      compile: compile,
      controller: controller,
      controllerAs: 'nwTable',
    };
  }
  function nwTableToolbar(translate) {
    var link = function($scope, $element, $attrs) {};
    return {
      restrict: 'A',
      require: '^?nwTable',
      replace: !0,
      link: link,
      template:
        '<div class="nwtable_toolbar" ng-if="!empty"><div class="nwtable_toolbar_title" ng-if="title || needEmptyTitle" ng-bind="title | translate"></div><div class="nwtable_toolbar_toggle_menu" ng-if="isSorted"ng-click="nwTable.sortMenu()"></div><div class="nwtable_toolbar_actions" ng-class="{\'margin-for-toggle\' : isSorted }"><button class="nwtable_toolbar_button colored flat" ng-if="nwTable.isAction(\'customEvent\')" ng-click="nwTable.action.customEvent($event)"ng-class="{\'disabled\' : onCustomEventDisable() || toolbarDisabled()}"ng-bind="customEventName |translate "></button><button class="nwtable_toolbar_button colored flat" ng-if="nwTable.isAction(\'secondCustomEvent\')" ng-click="nwTable.action.secondCustomEvent($event)"ng-class="{\'disabled\' : toolbarDisabled()}"ng-bind="secondCustomEventName |translate "></button><button class="nwtable_toolbar_button colored flat" ng-if="nwTable.isAction(\'customEventOnSelected\')" ng-click="nwTable.action.customEventOnSelected($event)"ng-class="{\'disabled\' : !nwTable.isSelected() || (nwTable.isAction(\'customEventOnSelected\') && onCustomEventOnSelectedDisable()) || toolbarDisabled()}"ng-bind="customEventName |translate "></button><button class="nwtable_toolbar_button colored flat" ng-if="nwTable.isAction(\'add\')" ng-click="nwTable.action.add($event)"ng-class="{\'disabled\' : (nwTable.isAction(\'addDisable\') && onAddDisable()) || toolbarDisabled(), \'hide\' : nwTable.isAction(\'addDisable\') && onAddHide()}"ng-bind="\'addButton\'|translate "></button><button class="nwtable_toolbar_button colored flat" ng-if="nwTable.isAction(\'delete\')" ng-click="nwTable.action.delete($event)"ng-class="{\'disabled\' : !nwTable.isSelected() || toolbarDisabled()}"ng-bind="\'deleteButton\'|translate "></button></div><div class="nwtable_toolbar_desc" ng-if="desc" ng-bind="desc | translate"></div><div class="nwtable_toolbar_desc" ng-if="emptyDesc" ng-bind="emptyDesc | translate"></div></div>',
    };
  }
  function nwTableHeadRow() {
    var link = function($scope, $element, $attrs, $nwTable) {
      ($scope.toggleSelectAllRows = function($event) {
        $event.stopPropagation(),
          $nwTable.hasSelectedAll()
            ? $nwTable.removeSelectedAllItems()
            : $nwTable.addSelectedAllItems();
      }),
        ($scope.isSelectedAllRows = function() {
          return $nwTable.hasSelectedAll();
        }),
        ($scope.hasRows = function() {
          return $nwTable.hasRows();
        });
    };
    return { restrict: 'A', require: '^^nwTable', link: link };
  }
  function nwTableRowSorted() {
    function template($element, $attrs) {
      var $ths = $element.find('th');
      _.each($ths, function(elem) {
        var $th = angular.element(elem),
          param = $th.attr('nw-table-sort-param');
        param
          ? ($th.addClass('sortable'),
            $th.attr('ng-click', 'rearrangeColumn($event, "' + param + '")'),
            $th.attr('ng-class', 'getColumnClass("' + param + '")'))
          : $th.addClass('sortable--disable');
      });
    }
    function link($scope, $element, $attrs, $nwTable) {
      ($scope.rearrangeColumn = function($event, param) {
        $nwTable.changeSortParam(param);
      }),
        ($scope.getColumnClass = function(param) {
          var result = [],
            currentParam = $nwTable.getSortParam(),
            currentDirection = $nwTable.getSortDirection(),
            defaultDirection = $nwTable.getDefaultDirection();
          return (
            currentParam == param
              ? (result.push('sortable--active'),
                result.push('sortable--' + currentDirection))
              : 'asc' == defaultDirection && result.push('sortable--asc'),
            result
          );
        });
    }
    return {
      restrict: 'A',
      require: '^nwTable',
      priority: 1001,
      template: template,
      scope: {},
      link: link,
    };
  }
  function nwTableRowSelectAll(nwTableService) {
    var template = function($element, $attrs) {
      var $th = angular
          .element(
            "<table><tr><th class='nw-table-checkbox-th'></th></tr></table>"
          )
          .find('th'),
        $checkbox = angular.element('<div nw-table-checkbox></div>');
      $checkbox.attr('ng-click', 'toggleSelectAllRows($event)'),
        $checkbox.attr('nw-checked', 'isSelectedAllRows()'),
        $checkbox.attr('nw-disabled', '!hasRows()'),
        $element.prepend($th.append($checkbox));
    };
    return {
      restrict: 'A',
      require: '^^nwTable',
      priority: 1001,
      template: template,
    };
  }
  function nwTableRow(nwTableService) {
    var link = function($scope, $element, $attrs, $nwTable) {
      var ngRepeat = nwTableService.parse.ngRepeat($attrs.ngRepeat);
      ($scope.toggleSelectRow = function($event, item, key) {
        $event.stopPropagation(),
          $nwTable.hasSelected(item, key)
            ? $nwTable.removeSelectedItem(item, key)
            : $nwTable.addSelectedItem(item, key);
      }),
        ($scope.isSelectedRow = function(item, key) {
          return $nwTable.hasSelected(item, key);
        }),
        ($scope.editRow = function($event, item, key) {
          $nwTable.action.edit($event, item, key);
        }),
        $scope.$last && $nwTable.isReadyBody.resolve(ngRepeat);
    };
    return { restrict: 'A', require: '^^nwTable', link: link };
  }
  function nwTableRowAction(nwTableService) {
    var template = function($element, $attrs) {
      function addSelectAction($element, item) {
        function addCheckbox($container, $target, place) {
          var $checkbox = angular.element('<div nw-table-checkbox></div>');
          $checkbox.attr(
            'ng-click',
            'toggleSelectRow($event, ' + item + ', ' + key + ')'
          ),
            $checkbox.attr(
              'nw-checked',
              'isSelectedRow(' + item + ', ' + key + ')'
            ),
            $target[place]($container.append($checkbox));
        }
        $attrs.$set('ngClass', "{'selected': isSelectedRow(" + item + ')}');
        var $containers = {
          $table: angular
            .element(
              "<table><tr><td class='nw-table-checkbox-td'></td><tr></table>"
            )
            .find('td'),
          $miniTable: angular.element(
            "<div class='nw-mini-table-checkbox-container'></div>"
          ),
        };
        addCheckbox($containers.$table, $element, 'prepend'),
          hasAttr('nwMiniTable') &&
            addCheckbox(
              $containers.$miniTable,
              $element.children('div'),
              'prepend'
            );
      }
      function addClickAction($element, item, key) {
        $element.addClass('clickable'),
          $element.attr(
            'ng-click',
            'editRow($event, ' + item + ', ' + key + ')'
          );
      }
      function hasAttr(name) {
        return !_.isUndefined($attrs[name]);
      }
      var ngRepeat = nwTableService.parse.ngRepeat($attrs.ngRepeat),
        item = ngRepeat.item,
        key = ngRepeat.key;
      hasAttr('nwTableRowSelect') && addSelectAction($element, item),
        hasAttr('nwTableRowClick') && addClickAction($element, item, key);
    };
    return {
      restrict: 'A',
      require: '^nwTable',
      priority: 1001,
      template: template,
      scope: {},
    };
  }
  function nwTableCheckbox() {
    var link = function($scope, $element, $attrs) {
      var $switch = angular.element($element.find('i'));
      $scope.$watch('nwChecked', function(value) {
        value
          ? $switch.addClass('nw-table-checkbox-switch--checked')
          : $switch.removeClass('nw-table-checkbox-switch--checked');
      }),
        $scope.$watch('nwDisabled', function(value) {
          _.isUndefined(value) ||
            (value
              ? ($element.addClass('nw-table-checkbox-field--disabled'),
                $switch.addClass('nw-table-checkbox-switch--disabled'))
              : ($element.removeClass('nw-table-checkbox-field--disabled'),
                $switch.removeClass('nw-table-checkbox-switch--disabled')));
        });
    };
    return {
      restrict: 'A',
      replace: !0,
      scope: { nwChecked: '=nwChecked', nwDisabled: '=nwDisabled' },
      template:
        '<div class="nw-table-checkbox-field"><i class="nw-table-checkbox-switch"></i></div>',
      link: link,
    };
  }
  function nwMiniTable(nwTableService) {
    var postLink = function($scope, $element, $attrs) {
        $element.addClass('nw-mini-table-tr');
      },
      compile = function($element, $attrs) {
        function isFullMiniTable() {
          return (
            $attrs.nwMiniTableFull ||
            (!$attrs.nwMiniTableShort && !$attrs.nwMiniTableCaption)
          );
        }
        var $container = {
          $wrapper: angular.element(
            "<div class='nw-mini-table-container'></div>"
          ),
          $info: angular.element(
            "<div class='nw-mini-table-caption-info-container'></div>"
          ),
          $status: angular.element("<div class='nw-mini-table-status'></div>"),
          $icon: angular.element("<div class='nw-mini-table-icon'></div>"),
        };
        return (
          _.isUndefined($attrs.nwMiniTableCaption) ||
            $container.$info.append(
              '<span class="nw-mini-table-caption" nw-bind-html-compile="' +
                $attrs.nwMiniTableCaption +
                '"></span>'
            ),
          _.isUndefined($attrs.nwMiniTableShort) ||
            $container.$info.append(
              '<span class="nw-mini-table-short" nw-bind-html-compile="' +
                $attrs.nwMiniTableShort +
                '"></span>'
            ),
          _.isUndefined($attrs.nwMiniTableInfo) ||
            ($element.addClass('nw-mini-table-tr-info'),
            $container.$status.attr(
              'nw-bind-html-compile',
              $attrs.nwMiniTableInfo
            )),
          _.isUndefined($attrs.nwMiniTableHideArrow)
            ? ($container.$arrow = angular.element(
                "<div class='nw-mini-table-arrow'><svg svg-icon='sub_menu_arrow'></svg></div>"
              ))
            : $element.addClass('not-clickable'),
          _.isUndefined($attrs.nwMiniTableClick) ||
            $container.$wrapper.attr('ng-click', $attrs.nwMiniTableClick),
          isFullMiniTable()
            ? ($element.addClass('nw-mini-table-opening'),
              $element.bind('click', function() {
                $element.toggleClass('nw-mini-table-open');
              }))
            : $element.addClass('nw-mini-table-not-opening'),
          $container.$wrapper.append($container.$info),
          $container.$wrapper.append($container.$status),
          _.isUndefined($attrs.nwMiniTableIcon)
            ? $container.$wrapper.append($container.$arrow)
            : ($container.$icon.attr(
                'nw-bind-html-compile',
                $attrs.nwMiniTableIcon
              ),
              $container.$wrapper.append($container.$icon)),
          $element.append($container.$wrapper),
          $element.addClass('nw-mini-table-tr'),
          postLink
        );
      };
    return { restrict: 'A', compile: compile, priority: 1002 };
  }
  function nwTableService() {
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
  var nw = angular.module(regdep('nw-table'), []);
  nw.directive('nwTable', [
    '$compile',
    '$q',
    '$timeout',
    'nwTableService',
    nwTable,
  ]),
    nw.directive('nwTableToolbar', ['translate', nwTableToolbar]),
    nw.directive('nwTableHeadRow', [nwTableHeadRow]),
    nw.directive('nwTableRowSorted', [nwTableRowSorted]),
    nw.directive('nwTableRowSelectAll', [
      'nwTableService',
      nwTableRowSelectAll,
    ]),
    nw.directive('nwTableRow', ['nwTableService', nwTableRow]),
    nw.directive('nwTableRowAction', ['nwTableService', nwTableRowAction]),
    nw.directive('nwTableCheckbox', [nwTableCheckbox]),
    nw.directive('nwMiniTable', ['nwTableService', nwMiniTable]),
    nw.factory('nwTableService', nwTableService);
})();
