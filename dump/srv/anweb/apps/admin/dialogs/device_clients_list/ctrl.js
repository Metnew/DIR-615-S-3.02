'use strict';
function DeviceClientsListDialogCtrl(
  $scope,
  $q,
  devinfo,
  funcs,
  nwClientListUtil
) {
  function make(list) {
    function addItem(item) {
      $scope.clients.list.push(item);
    }
    var list = nwClientListUtil.prepareClientsList(list, options.ipversion);
    _.each(list, addItem);
  }
  function clean() {
    ($scope.clients.list.length = 0), ($scope.clients.selected.length = 0);
  }
  function apply() {
    var selectedItems = _.pluck($scope.clients.selected, 'item');
    $scope.closeThisDialog(selectedItems);
  }
  function refresh() {
    activate();
  }
  function cancel() {
    $scope.closeThisDialog(null);
  }
  function isEmpty() {
    return 0 == $scope.clients.list.length;
  }
  function isSelected() {
    return $scope.clients.selected.length > 0;
  }
  function getTitle(item) {
    return item.hostname
      ? item.ip
        ? item.ip + ' (' + item.hostname + ') '
        : item.hostname
      : item.ip
        ? item.ip
        : '';
  }
  function activate() {
    function success(output) {
      clean(), make(output.clients), ($scope.clients.isLoading = !1);
    }
    function error() {
      ($scope.clients.isLoading = !1), ($scope.clients.isError = !0);
    }
    ($scope.clients.isError = !1),
      ($scope.clients.isLoading = !0),
      nwClientListUtil.pull().then(success, error);
  }
  var options = $scope.ngDialogData;
  ($scope.clients = {
    isLoading: !0,
    isError: !1,
    list: [],
    selected: [],
    make: make,
    clean: clean,
    apply: apply,
    refresh: refresh,
    cancel: cancel,
    isEmpty: isEmpty,
    isSelected: isSelected,
    getTitle: getTitle,
  }),
    options.comment && ($scope.clients.comment = options.comment),
    activate();
}
