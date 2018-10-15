'use strict';
function DHCPServerAddressPoolDialogCtrl($scope) {
  function setRangeList() {
    _.each(ranges, function(range, inx) {
      $scope.range.list.push({
        label: range.start + ' - ' + range.end,
        value: range,
      });
    });
  }
  function setRangeValue() {
    $scope.range.list;
    $scope.range.value = $scope.range.list[0].value;
  }
  function apply() {
    $scope.closeThisDialog($scope.range.value);
  }
  function cancel() {
    $scope.closeThisDialog(null);
  }
  var ranges = $scope.ngDialogData.ranges;
  ($scope.range = { value: null, list: [] }),
    setRangeList(),
    setRangeValue(),
    ($scope.dialog = { apply: apply, cancel: cancel });
}
