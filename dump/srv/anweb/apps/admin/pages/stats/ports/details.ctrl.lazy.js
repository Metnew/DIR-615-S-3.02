'use strict';
!(function() {
  'use stict';
  angular.module('app').controllerProvider.register('portDetailsStatsCtrl', [
    '$scope',
    'devinfo',
    '$stateParams',
    'translate',
    function($scope, devinfo, $stateParams, translate) {
      function subscribeInfo() {
        devinfo.onceAndSubscribe(rpc, onInfoLoaded, $scope);
      }
      function onInfoLoaded(response) {
        ($scope.portsStats = response ? response[rpc] : {}),
          ($scope.currentPort = _.findWhere($scope.portsStats, {
            alias: $scope.portAlias,
          })),
          mapFields($scope.currentPort),
          $scope.$emit('pageload');
      }
      function mapFields(currentPort) {
        var basicCounterFields = [
            { name: 'BytesSent' },
            { name: 'BytesReceived' },
            { name: 'PacketsSent' },
            { name: 'PacketsReceived' },
            { name: 'UnicastPacketsSent' },
            { name: 'UnicastPacketsReceived' },
            { name: 'MulticastPacketsSent' },
            { name: 'MulticastPacketsReceived' },
            { name: 'BroadcastPacketsSent' },
            { name: 'BroadcastPacketsReceived' },
            { name: 'DiscardPacketsSent' },
            { name: 'DiscardPacketsReceived' },
            { name: 'ErrorsSent' },
            { name: 'ErrorsReceived' },
            { name: 'UnknownProtoPacketsReceived' },
          ],
          flowControlFields = [
            { name: 'PauseFramesSent' },
            { name: 'PauseFramesReceived' },
          ],
          additionalCounterFields = [
            { name: 'UndersizePackets' },
            { name: 'Packets64Bytes' },
            { name: 'Packets65to127Bytes' },
            { name: 'Packets128to255Bytes' },
            { name: 'Packets256to511Bytes' },
            { name: 'Packets512to1023Bytes' },
            { name: 'Packets1024to1518Bytes' },
            { name: 'OversizePackets' },
            { name: 'Fragments', note: 'stat_port_fragment_note' },
            {
              name: 'CRCErroredPackets',
              note: 'stat_port_crce_errored_packets_note',
            },
            { name: 'Jabbers', note: 'stat_port_jabbers_note' },
            { name: 'DropEvents', note: 'stat_port_drop_events_note' },
          ],
          mapField = function(field) {
            return _.extend({}, field, {
              value: currentPort[field.name],
              label: _.isFunction(field.label)
                ? _.result(field, 'label')
                : translate('stat_port_' + field.name),
              note: _.isEmpty(field.note) ? null : translate(field.note),
            });
          };
        $scope.fieldGroups = [
          {
            label: translate('stats_basic_counters'),
            fields: _.map(basicCounterFields, mapField),
          },
          {
            label: translate('stat_port_flow_control'),
            fields: _.map(flowControlFields, mapField),
          },
          {
            label: translate('stat_port_additional_counters'),
            fields: _.map(additionalCounterFields, mapField),
          },
        ];
      }
      var rpc = '129';
      ($scope.portAlias = $stateParams.portAlias.toUpperCase()),
        subscribeInfo();
    },
  ]);
})();
