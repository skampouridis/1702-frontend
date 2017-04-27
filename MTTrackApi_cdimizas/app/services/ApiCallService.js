(function () {
    "use strict";
    angular.module('MTTrackingApi').factory('ApiCallService',ApiCallService);
    ApiCallService.$inject= ['RequestService'];

    function ApiCallService(RequestService) {
        // TODO
        var services = {
            getVesselTrack : _getVesselTrack
        };

        return services;

        function _getVesselTrack(days, mmsi) {
            var args = RequestService.cleanArguments(arguments, _getVesselTrack.length);
            var url ='http://services.marinetraffic.com/api/exportvesseltrack/';
            url += '3ff05956b0fd72b18a40e69b96c9f4423163490f/';
            url += 'days:' + days + '/mmsi:' + mmsi + "/protocol:jsono";
            args = RequestService.setParamsArguments(args, url);
            return RequestService.get.apply(null, args);
        }
    }
})();

