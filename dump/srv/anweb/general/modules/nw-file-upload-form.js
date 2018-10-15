'use strict';
!(function() {
  var nw = angular.module(regdep('nw-file-upload-form'), []);
  nw.directive('nwFileUploadForm', [
    '$rootScope',
    '$timeout',
    'authDigestHelper',
    'cookie',
    function($rootScope, $timeout, authDigestHelper, cookie) {
      return {
        restrict: 'AE',
        replace: !1,
        scope: {
          nwUploadUrl: '@',
          nwUploadBegin: '&',
          nwUploadEnd: '&',
          nwFieldButtonTitle: '@',
          nwSubmitTitle: '@',
          nwButtonBlockClass: '@',
          nwSubmitButtonClass: '@',
        },
        template:
          '<form method="POST" enctype="multipart/form-data"  target="nwFileUploadFormTarget" class="nw_file_upload_form"><label class="nw_file nwfield_content"><div class="button">{{nwFieldButtonTitle | translate}}</div><div class="input">{{filename || (\'file_not_selected\' | translate)}}</div><input type="file" name="file"></label><div class="button_block {{nwButtonBlockClass}}"><button type="submit"class="{{nwSubmitButtonClass}}"ng-disabled="!filename" >{{nwSubmitTitle | translate}}</button></div></form>',
        link: function($scope, $element, $attrs) {
          function setAuthCookie() {
            var header = authDigestHelper.generateHeader({
              url: $scope.nwUploadUrl,
              method: 'POST',
            });
            cookie.set('Authorization', header, 1, 'sec');
          }
          {
            var iframe,
              uniq_iframe = _.uniqueId('nw_upload_iframe'),
              form = $element.find('form'),
              input = form.find('input').eq(0);
            form.find('input').eq(1), form.find('input').eq(2);
          }
          form.after(
            '<iframe name="' +
              uniq_iframe +
              '" id="' +
              uniq_iframe +
              '" width="0" height="0" frameborder="0" />'
          ),
            (iframe = $element.find('iframe')),
            form.attr('target', uniq_iframe),
            form.attr('action', $scope.nwUploadUrl),
            input.bind('change', function(e) {
              $scope.fileSelect(input[0].value);
            }),
            form.bind('submit', function(e) {
              e.preventDefault(),
                setAuthCookie(),
                form[0].submit(),
                (window[uniq_iframe] = !0),
                $scope.nwUploadBegin && $scope.nwUploadBegin()();
            }),
            iframe.bind('load', function(e) {
              if (window[uniq_iframe]) {
                var data = angular
                  .element(e.target)
                  .contents()
                  .find('body')
                  .text();
                if ($scope.nwUploadEnd && data)
                  try {
                    var json = JSON.parse(data);
                    $scope.nwUploadEnd()({ data: json });
                  } catch (e) {
                    $scope.nwUploadEnd()({ data: data });
                  }
              }
            }),
            ($scope.fileSelect = function(path) {
              ($scope.filename = path.slice(path.lastIndexOf('\\') + 1)),
                $scope.$digest();
            });
        },
      };
    },
  ]);
})();
