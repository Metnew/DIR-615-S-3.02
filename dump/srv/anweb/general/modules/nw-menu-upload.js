'use strict';
!(function() {
  var nw = angular.module(regdep('nw-menu-upload'), []);
  nw.directive('nwMenuUpload', [
    '$rootScope',
    '$timeout',
    function($rootScope, $timeout) {
      return {
        restrict: 'AE',
        replace: !1,
        scope: {
          nwUploadUrl: '@',
          nwUploadPrepare: '&',
          nwUploadBegin: '&',
          nwUploadEnd: '&',
          nwUploadTitle: '@',
          nwUploadDesc: '@',
          nwUploadClass: '@',
        },
        template:
          '<span class="addlink {{nwUploadClass}}" ng-click="clickFile(); $event.stopPropagation(); $event.preventDefault();"> <form method="POST" enctype="multipart/form-data" target="nwMenuUploadTarget">    <input type="file" name="file" class="hidden_element">    <label class="button">{{nwUploadTitle | translate}}</label> </form>   <span>{{nwUploadDesc | translate}}</span></span>',
        link: function($scope, $element, $attrs) {
          var uniq_iframe = _.uniqueId('nw_upload_iframe'),
            form = $element.find('form');
          form.after(
            '<iframe name="' +
              uniq_iframe +
              '" id="' +
              uniq_iframe +
              '" width="0" height="0" frameborder="0" />'
          );
          var iframe = $element.find('iframe'),
            input = form.find('input').eq(0),
            label = form.find('label'),
            uniq_label = _.uniqueId('nw_upload_label');
          input.attr('id', uniq_label),
            label.attr('for', $scope.nwUploadUrl),
            form.attr('target', uniq_iframe),
            form.attr('action', $scope.nwUploadUrl),
            $element.addClass('nw_menu_upload'),
            ($scope.clickFile = function() {
              input[0].click();
            }),
            input.bind('change', function(e) {
              (window[uniq_iframe] = !0),
                $scope.nwUploadPrepare && $scope.nwUploadPrepare(),
                form[0].submit(),
                $rootScope.$emit('request.started', {
                  config: { url: $scope.nwUploadUrl },
                }),
                $scope.nwUploadBegin && $scope.nwUploadBegin();
            }),
            iframe.bind('load', function(e) {
              if (window[uniq_iframe]) {
                var data = angular
                  .element(e.target)
                  .contents()
                  .find('body')
                  .text();
                if ($scope.nwUploadEnd && data) {
                  $rootScope.$emit('request.succeed', {
                    config: { url: $scope.nwUploadUrl },
                  });
                  try {
                    var json = JSON.parse(data);
                    $scope.nwUploadEnd({ data: json });
                  } catch (e) {
                    $scope.nwUploadEnd({ data: data });
                  }
                }
              }
            });
        },
      };
    },
  ]);
})();
