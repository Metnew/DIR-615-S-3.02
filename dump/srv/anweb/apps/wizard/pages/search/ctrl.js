'use strict';
angular.module('wizard').controller('wizardSearchCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  '$http',
  '$state',
  '$timeout',
  '$document',
  'regions',
  'profiles',
  'dataShare',
  'stepManager',
  function(
    $scope,
    $rs,
    $window,
    $http,
    $state,
    $timeout,
    $document,
    regions,
    profiles,
    dataShare,
    stepManager
  ) {
    function search() {
      var words = $scope.query ? $scope.query.toLowerCase().split(' ') : [],
        prepare = _.map(regions.list(), function(region) {
          return (
            (region.__score = 0),
            _.each(words, function(w) {
              var pos = region.__name.toLowerCase().indexOf(w);
              0 == pos
                ? (region.__score += 1)
                : pos > 0 && (region.__score += 0.5);
            }),
            region
          );
        });
      if (
        (_.isNumber($scope.selected) && $scope.selected > 0
          ? ($scope.result = _.reject(prepare, function(region) {
              if (_.isNumber(region.Parent) && region.Parent > 0) {
                var rByID = regions.byID(region.Parent);
                return rByID && rByID.ID != $scope.selected;
              }
              return !0;
            }))
          : $scope.query.length
            ? ((prepare = _.sortBy(prepare, function(region) {
                return region.__score;
              }).reverse()),
              (prepare = _.reject(prepare, function(region) {
                return !region.__score;
              })),
              ($scope.result = _.first(prepare, 100)))
            : ($scope.result = _.reject(prepare, function(region) {
                return _.isNumber(region.Parent) && region.Parent > 0;
              })),
        ($scope.result = _.sortBy($scope.result, function(region) {
          return region.Name.toLowerCase();
        })),
        _.find($scope.result, function(region) {
          return region.Name.length >= $scope.nameMaxSymbols;
        }))
      )
        $scope.result = [$scope.result, []];
      else {
        var inx = 0;
        $scope.result = _.partition($scope.result, function(region) {
          return inx++ % 2 == 0;
        });
      }
    }
    function mouseup(event) {
      'wizardSearchCtrl' == $state.$current.controller &&
        $scope.$apply(function() {
          cursor.enable = !1;
        });
    }
    function keydown(event) {
      if ('wizardSearchCtrl' == $state.$current.controller) {
        switch (event.keyCode) {
          case keycodes.UP:
            1 == cursor.x && 0 == cursor.y
              ? ((cursor.x = 0), (cursor.y = _.size($scope.result[0]) - 1))
              : cursor.y > 0
                ? cursor.y--
                : ((cursor.enable = !0), $scope.resetCursor());
            break;
          case keycodes.DOWN:
            cursor.enable && $scope.result[cursor.x].length - 1 > cursor.y
              ? cursor.y++
              : 0 == cursor.x && _.size($scope.result[1])
                ? ((cursor.x = 1), (cursor.y = 0))
                : ((cursor.enable = !0), $scope.resetCursor());
            break;
          case keycodes.RIGHT:
          case keycodes.LEFT:
            cursor.enable && $scope.result[cursor.x ? 0 : 1][cursor.y]
              ? (cursor.x = cursor.x ? 0 : 1)
              : ((cursor.enable = !0), $scope.resetCursor());
            break;
          case keycodes.ENTER:
            if (cursor.enable) {
              var obj = $scope.result[cursor.x][cursor.y];
              $scope.selectParent(obj.ID),
                obj &&
                  _.find(regions.list(), function(region) {
                    return _.isNumber(region.Parent) && region.Parent > 0
                      ? regions.byID(region.Parent).ID == obj.ID
                      : !1;
                  }) &&
                  $scope.resetCursor();
            }
            break;
          case keycodes.ESC:
            $scope.resetCursor(), $scope.prev();
            break;
          case keycodes.TAB:
            var elm = document.querySelector('#query_handler');
            $scope.resetCursor(),
              $timeout(
                cursor.enable
                  ? function() {
                      elm.focus();
                    }
                  : function() {
                      elm.blur();
                    }
              ),
              (cursor.enable = !cursor.enable);
        }
        $scope.$digest();
      }
    }
    $scope.stepData = stepManager.getData();
    var keycodes = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        DOWN: 40,
        LEFT: 39,
        UP: 38,
        RIGHT: 37,
      },
      cursor = { x: 0, y: 0, enable: !1 };
    ($scope.short_style = !0),
      ($scope.query = ''),
      ($scope.query_watched = !0),
      ($scope.result = []),
      ($scope.selected = null),
      ($scope.baseRegionID = null),
      ($scope.nameMaxSymbols = 100),
      ($scope.prev = function() {
        if (_.isNumber($scope.selected) && $scope.selected > 0) {
          if (
            (($rs.selectedID = null),
            ($scope.selected = regions.byID($scope.selected).Parent),
            $scope.selected != $scope.baseRegionID)
          ) {
            var next = regions.byID($scope.selected);
            next && _.isNumber(next.Parent) && ($scope.selected = next.Parent);
          }
          search();
        }
      }),
      ($scope.openProvlist = function() {
        $scope.isSelected() &&
          (($rs.selectedID = $scope.selected),
          dataShare.set('FoundRegion', regions.byID($scope.selected)),
          profiles.load($scope.selected, function(res) {
            var res = res.result;
            res && stepManager.action('selected', res.data);
          }));
      }),
      ($scope.selectParent = function(index) {
        ($scope.query_watched = !1),
          ($scope.query = ''),
          ($scope.selected = index),
          _.find(regions.list(), function(region) {
            return region.Parent == index && region.Parent > 0;
          })
            ? search()
            : ($rs.gTZ = regions.findTZ($scope.selected)),
          (!$scope.selectedID || $scope.isBack) && $scope.openProvlist();
      }),
      ($scope.isShowCancel = function() {
        return (
          $scope.selected &&
          0 == regions.byID($scope.selected).Parent &&
          !_.find(regions.list(), function(region) {
            return region.Parent == $scope.selected;
          })
        );
      }),
      ($scope.isSelected = function() {
        return _.isNumber($scope.selected) && 0 != $scope.selected
          ? !_.find(regions.list(), function(region) {
              if (_.isNumber(region.Parent) && region.Parent > 0) {
                var rbyID = regions.byID(region.Parent);
                return rbyID && rbyID.ID == $scope.selected;
              }
              return !1;
            })
          : !1;
      }),
      ($scope.withoutPanel = function() {
        return !(_.isNumber($scope.selected) && $scope.selected > 0);
      }),
      ($scope.searchFocus = function() {
        ($scope.query_watched = !0),
          ($scope.short_style = !1),
          ($scope.selected = null),
          ($scope.navs_hide = !!isMobile.any()),
          search(),
          1 == _.size($scope.result[0]) &&
            (($scope.selected = _.first($scope.result[0]).ID), search());
      }),
      ($scope.searchBlur = function() {
        $scope.navs_hide = !1;
      }),
      ($scope.searchKeypress = function(event) {
        event.keyCode == keycodes.ENTER &&
          $timeout(function() {
            var handler = document.querySelector('#query_handler');
            handler.blur && handler.blur();
          });
      }),
      ($scope.isShowPrev = function() {
        return (
          _.isNumber($scope.selected) &&
          $scope.selected > 0 &&
          $scope.baseRegionID != $scope.selected
        );
      }),
      ($scope.getSelected = function() {
        return _.isNumber($scope.selected) && $scope.selected > 0
          ? regions.byID($scope.selected)
          : void 0;
      }),
      $scope.$watch('short_style', function(val) {
        val === !1 && $scope.resetCursor();
      }),
      $scope.$watch('query', function() {
        $scope.query_watched && (($scope.selected = null), search());
      }),
      ($scope.checkCursor = function(x, y) {
        return cursor.enable && cursor.x == x && cursor.y == y;
      }),
      ($scope.resetCursor = function() {
        (cursor.x = 0),
          (cursor.y = 0),
          (document.body.scrollTop = 0),
          (document.documentElement.scrollTop = 0);
      }),
      ($scope.isSingleCol = function() {
        return (
          _.find($scope.result[0], function(region) {
            return region.Name.length >= $scope.nameMaxSymbols;
          }) ||
          _.find($scope.result[1], function(region) {
            return region.Name.length >= $scope.nameMaxSymbols;
          })
        );
      }),
      angular
        .element($document)
        .bind('mouseup', mouseup)
        .bind('keydown', keydown),
      $scope.$on('$destroy', function() {
        angular
          .element($document)
          .unbind('mouseup', mouseup)
          .unbind('keydown', keydown);
      }),
      regions.load(function() {
        if (regions.isSingleProfile())
          return void ($scope.selectedID
            ? (($rs.selectedID = null), $scope.prevCustomStep())
            : (($scope.selected = regions.getSingleProfileID()),
              $scope.openProvlist()));
        if ($scope.selectedID) {
          var parent = regions.byID($scope.selectedID).Parent;
          parent && $scope.selectParent(parent);
        }
        ($scope.baseRegionID = regions.getBaseRegionID()),
          $scope.selectedID
            ? ($scope.selectParent($scope.selectedID), ($scope.isBack = !0))
            : $scope.selectParent($scope.baseRegionID),
          ($scope.profileLoaded = !0);
      }),
      ($scope.prevCustomStep = function() {
        $scope.isShowPrev() && $scope.stepData.btn_prev
          ? $scope.prev()
          : $state.go(
              isMobile.any() ? ($scope.gSkipGEO ? 'lang' : 'geo') : 'lang'
            );
      });
  },
]);
