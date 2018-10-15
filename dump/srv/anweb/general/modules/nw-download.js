'use strict';
!(function() {
  function nwDownload(authDigestHelper, cookie) {
    function compile($element, $attrs) {
      var mode = $attrs.nwDownloadMode
          ? 'nw-download--' + $attrs.nwDownloadMode
          : '',
        template = "<span class='nw-download " + mode + "'>";
      return (
        (template +=
          "<svg class='nw-download__icon' svg-icon='download'></svg>"),
        $attrs.nwDownloadLabel &&
          (template +=
            '<span class="nw-download__text" ng-bind="\'' +
            $attrs.nwDownloadLabel +
            '\' | translate "></span>'),
        (template += '</span>'),
        $element.append(template),
        postLink
      );
    }
    function postLink($scope, $element, $attrs) {
      function downloadElement() {
        var link = path;
        filepath && (link += '?filepath=' + filepath),
          filename && (link += '&filename=' + filename),
          setAuthCookie(path),
          (document.location.href = link);
      }
      function setAuthCookie(link) {
        var header = authDigestHelper.generateHeader({
          url: link,
          method: 'GET',
        });
        cookie.set('Authorization', header, 3, 'sec');
      }
      var path = $attrs.nwDownloadPath,
        filepath = $attrs.nwDownloadFilePath,
        filename = $attrs.nwDownloadFileName;
      $element.bind('click', downloadElement);
    }
    return { restrict: 'A', replace: !0, compile: compile };
  }
  angular
    .module(regdep('nw-download'), [])
    .directive('nwDownload', ['authDigestHelper', 'cookie', nwDownload]),
    (nwDownload.$inject = []);
})();
