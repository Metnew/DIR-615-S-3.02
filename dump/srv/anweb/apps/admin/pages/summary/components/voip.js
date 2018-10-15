'use strict';
!(function() {
  function SummaryVoipService(summaryConstants, translate) {
    function get() {
      function handler(response, areas) {
        if (response && response.voip_status) {
          var input = response.voip_status;
          (lines.length = 0),
            _.each(input, function(line) {
              lines.push(prepareLine(line));
            });
        }
      }
      function prepareLine(line) {
        return (
          (line.name = translate('voipLine') + ' ' + line.id),
          line.registration &&
            ((line.registration.status = makeRegStatus(
              line.registration.status
            )),
            (line.registration.status_msg = translate(
              line.registration.status_msg
            ))),
          line
        );
      }
      function makeRegStatus(status) {
        switch (status) {
          case 0:
            return 'off';
          case 1:
            return 'pending';
          case 2:
            return 'on';
        }
      }
      var lines = [];
      return { lines: lines, areas: 'voip_status', devinfoHandler: handler };
    }
    return { get: get };
  }
  function voipPhoneStatus(translate) {
    function link($scope, $element, $attrs) {
      ($scope.getStatusClass = function() {
        switch ($scope.status) {
          case 0:
            return 'voip-phone-status--put_down';
          case 1:
            return 'voip-phone-status--busy';
          case 2:
            return 'voip-phone-status--up';
          case 3:
            return 'voip-phone-status--outgoing_call';
          case 4:
            return 'voip-phone-status--incoming_call';
          case 5:
            return 'voip-phone-status--talking';
        }
      }),
        ($scope.getStatusIcon = function() {
          switch ($scope.status) {
            case 0:
              return 'phone_hang_down';
            case 1:
              return 'phone';
            case 2:
              return 'phone';
            case 3:
              return 'phone_outgoing_call';
            case 4:
              return 'phone_incoming_call';
            case 5:
              return 'phone_talking';
          }
        }),
        ($scope.getStatusMsg = function() {
          return translate($scope.message);
        });
    }
    return {
      restrict: 'A',
      replace: !0,
      template:
        '<div class="nw-static last">                        <span class="title">{{"voipPhoneStatus" | translate}}:</span>                        <span class="info">{{message | translate}}</span>                        <span class="icon">                            <svg svg-icon="{{getStatusIcon()}}" ng-class="getStatusClass()"></svg>                        </span>',
      link: link,
      scope: { status: '=voipPhoneStatus', message: '=voipPhoneStatusMessage' },
    };
  }
  angular.module('app').factory('summaryVoip', SummaryVoipService),
    (SummaryVoipService.$inject = ['summaryConstants', 'translate']),
    angular
      .module('app')
      .directive('voipPhoneStatus', ['translate', voipPhoneStatus]);
})();
