"use strict";
angular.module("wizard").service("customValidation", ["funcs", function (funcs) {
    function DNS(value) {
        return funcs.is.ipv4(value), null
    }
    return {
        DNS: DNS
    }
}]);