'use strict';
!(function() {
  function wifiTransmitPower() {
    function link($scope, $element, $attrs) {
      function change(value) {
        $scope.value = wifiTransmit.value;
      }
      function isWarning(value) {
        return 'Maximum' == value || parseInt(value) > 100;
      }
      function getSelectClass(value) {
        var classes = ['wifi-transmit-power-select'];
        return (
          isWarning(value) &&
            classes.push('wifi-transmit-power-select--warning'),
          classes.join(' ')
        );
      }
      function getOptionClass(option) {
        var classes = ['wifi-transmit-power-option'];
        return (
          isWarning(option.value) &&
            classes.push('wifi-transmit-power-option--warning'),
          classes.join(' ')
        );
      }
      function setValue(value) {
        value && ($scope.wifiTransmit.value = value);
      }
      function makeOptions() {
        var options = $scope.$parent.$eval($attrs.wifiTransmitPowerOptions);
        return _.map(options, function(opt) {
          return { name: opt, value: opt };
        });
      }
      $element.find('select');
      $scope.wifiTransmit = {
        value: null,
        options: makeOptions(),
        change: change,
        isWarning: isWarning,
        getSelectClass: getSelectClass,
        getOptionClass: getOptionClass,
      };
      var wifiTransmit = $scope.wifiTransmit;
      setValue($scope.value), $scope.$watch('value', setValue);
    }
    return {
      restrict: 'AEC',
      scope: { value: '=wifiTransmitPowerValue' },
      template:
        '<div nw-field nw-label="wifiTransmitPower"><div class="custom-select"><select class="wifi-transmit-power-select" ng-model="wifiTransmit.value" ng-change="wifiTransmit.change(wifiTransmit.value)" ng-options="option.value as option.name | translate for option in wifiTransmit.options" nw-options-class="wifiTransmit.getOptionClass(option)" ng-class="wifiTransmit.getSelectClass(wifiTransmit.value)" ></select></div></div><div class="note"  ng-bind="\'wifiTransmitPowerNote\' | translate"  ng-if="wifiTransmit.isWarning(wifiTransmit.value)" ></div>',
      link: link,
    };
  }
  var app = angular.module('app');
  app.directive('wifiTransmitPower', [wifiTransmitPower]);
})();
