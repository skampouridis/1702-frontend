(function () {
    "use strict";
    angular.module('MTTrackingApi').factory('RequestService',RequestService);
    RequestService.$inject= ['$http'];

    function RequestService($http) {
        // TODO
        var services = {
            get: _get,
            cleanArguments: _cleanArguments,
            setParamsArguments: _setParamsArguments
        };

        return services;

        function _cleanArguments(args, argsArity) {
            var argsArray = [];
            for (var i = argsArity; i < args.length; i++) {
                argsArray.push(args[i]);
            }
            return argsArray;
        }

        function _setParamsArguments(args, url, params) {
            if (params) args.unshift(params);
            if (url) args.unshift(url);
            return args;
        }

        function _get(url) {
            return $http.get(url)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        console.log("WARNING - Get failed", error);
                    }
                );
        }
    }
})();
