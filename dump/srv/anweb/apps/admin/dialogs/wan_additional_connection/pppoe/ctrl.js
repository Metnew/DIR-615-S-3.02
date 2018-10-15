'use strict';
function WanAdditionalConnectionPPPoEDialogCtrl($scope, translate) {
  function setSelectLists() {
    function setTypeList() {
      var list = select.type.list;
      list.push({
        label: 'wanAdditionalSelectTypeInternet',
        value: 'internet',
      });
    }
    function setConnectionList() {
      var list = select.connection.list;
      list.push({
        label: 'wanAdditionalSelectConnectionNew',
        value: { type: 'new' },
      }),
        _.each(data.connections, function(elem) {
          list.push({ label: elem.data.Name, value: elem });
        });
    }
    setTypeList(), setConnectionList();
  }
  function setSelectValues() {
    function setTypeValue() {
      var list = select.type.list;
      select.type.value = list.length ? list[0].value : null;
    }
    function setConnectionValue() {
      var list = select.connection.list;
      select.connection.value = list.length ? list[0].value : null;
    }
    setTypeValue(), setConnectionValue();
  }
  function isShowConnection() {
    return 'internet' == select.type.value && select.connection.list.length > 1;
  }
  var data = $scope.ngDialogData;
  ($scope.newConnection = !1),
    ($scope.select = {
      type: { value: null, list: [] },
      connection: { value: null, list: [] },
      isShowConnection: isShowConnection,
    });
  var select = $scope.select;
  setSelectLists(),
    setSelectValues(),
    ($scope.cancel = function() {
      $scope.closeThisDialog(null);
    }),
    ($scope.create = function() {
      function getMode() {
        return 'internet' == select.type.value
          ? 'new' == select.connection.value.type
            ? 'new'
            : 'select'
          : void 0;
      }
      var mode = getMode(),
        connection = 'select' == mode ? select.connection.value : null;
      $scope.closeThisDialog({ mode: mode, connection: connection });
    }),
    ($scope.skip = function() {
      $scope.closeThisDialog({ mode: 'none' });
    });
}
