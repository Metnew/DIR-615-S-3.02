'use strict';
function ipv6cut(value) {
  if (!value) return '';
  if (value.length <= 30) return value;
  var tmp = value.split(':'),
    ret = tmp[0] + ': .. :' + tmp[tmp.length - 2] + ':' + tmp[tmp.length - 1];
  return ret;
}
angular.module(regdep('nw-ipv6cut'), []).directive('ipv6cut', [
  '$compile',
  function($compile) {
    return {
      restrict: 'AE',
      template: '',
      scope: { ipv6cut: '=' },
      link: function(scope, element, attrs, ctrl) {
        var template,
          threshold = 30,
          ipv6 = scope.ipv6cut,
          ipv6Length = ipv6.length;
        (template =
          ipv6Length >= threshold
            ? $compile(
                '<abbr title="' + ipv6 + '" >' + ipv6cut(ipv6) + '</abbr>'
              )(scope)
            : $compile('<span>' + ipv6 + '</span>')(scope)),
          element.append(template);
      },
    };
  },
]),
  angular.module('nw-ipv6cut').filter('ipv6cut', function() {
    return ipv6cut;
  });
