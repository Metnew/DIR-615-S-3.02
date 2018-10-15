'use strict';
!(function() {
  function WanMediaATMCtrl($scope, helper) {
    function update() {
      var mediaType = $scope.wan.model.connection.MediaType;
      if ('DSL.ATM' == mediaType) {
        var iface = $scope.wan.model['interface'];
        ($scope.atm.isNew = !!iface.isNew),
          ($scope.atm.data = $scope.wan.model.connection.Media.DSL.ATM),
          $scope.atm.destinationAddress.init();
      }
    }
    function validation(value, param) {
      var data = $scope.atm.data;
      if (!data) return null;
      var errors = atm.validation(data);
      return errors[param].length ? errors[param][0] : void 0;
    }
    function isShow(param) {
      var data = $scope.atm.data;
      switch (param) {
        case 'PeakCellRate':
          return 'UBR' != data.QoSClass;
        case 'SustainableCellRate':
        case 'MaximumBurstSize':
          return 'VBR-nrt' == data.QoSClass || 'VBR-rt' == data.QoSClass;
      }
      return !0;
    }
    function isRequired(param) {
      switch (param) {
        case 'PeakCellRate':
        case 'SustainableCellRate':
        case 'MaximumBurstSize':
          return $scope.atm.isNew;
      }
      return !1;
    }
    function isDisabled(param) {
      switch (param) {
        case 'Encapsulation':
        case 'QoSClass':
        case 'PeakCellRate':
        case 'SustainableCellRate':
        case 'MaximumBurstSize':
          return !$scope.atm.isNew;
      }
      return !1;
    }
    var device = $scope.device,
      atm = device.wan.media.atm;
    ($scope.atm = {
      isNew: !1,
      data: null,
      update: update,
      validation: validation,
      isShow: isShow,
      isRequired: isRequired,
      isDisabled: isDisabled,
    }),
      ($scope.atm.select = {
        QoSClass: [
          { name: 'UBR', value: 'UBR' },
          { name: 'UBR with PCR', value: 'UBR+' },
          { name: 'CBR', value: 'CBR' },
          { name: 'Non Realtime VBR', value: 'VBR-nrt' },
          { name: 'Realtime VBR', value: 'VBR-rt' },
        ],
        Encapsulation: [
          { name: 'LLC', value: 'LLC' },
          { name: 'VCMUX', value: 'VCMUX' },
        ],
      }),
      ($scope.atm.destinationAddress = (function() {
        function init() {
          destAddr.isNew = $scope.atm.isNew;
          var data = $scope.atm.data.DestinationAddress,
            dataArr = data ? data.split('/') : [];
          (destAddr.vpi = dataArr[0] ? dataArr[0] : ''),
            (destAddr.vci = dataArr[1] ? dataArr[1] : '');
        }
        function update() {
          $scope.atm.data.DestinationAddress =
            (destAddr.vpi ? destAddr.vpi : '') +
            '/' +
            (destAddr.vci ? destAddr.vci : '');
        }
        function isRequired() {
          return destAddr.isNew;
        }
        function isDisabled() {
          return !destAddr.isNew;
        }
        function validation(value, type) {
          var error = $scope.atm.validation(value, 'DestinationAddress');
          return 'error_destination_address_already_use' == error
            ? 'is_media_type_busy'
            : null;
        }
        var destAddr = {
          isNew: !1,
          vpi: null,
          vci: null,
          init: init,
          update: update,
          validation: validation,
          isRequired: isRequired,
          isDisabled: isDisabled,
        };
        return destAddr;
      })()),
      update(),
      $scope.$on('wan.model.connection.media.set', update);
  }
  angular
    .module('app')
    .controller('WanMediaATMCtrl', ['$scope', 'wanHelper', WanMediaATMCtrl]);
})();
