angular.module('myApp')
    .factory('LocationsService', ['$http', 'WebService', function($http, WebService) {
        var service = {};
        service.GetLocations = function(days, fromdate, todate, mmsi, imo, MINLAT, MAXLAT, MINLON, MAXLON, protocol, callback) {
            var parameters = '/'.concat(config.apiKey);
            if (typeof days == 'number') parameters=parameters.concat('/days:', days.toString());
            if (fromdate.length>0) parameters=parameters.concat('/fromdate:', fromdate);
            if (todate.length>0) parameters=parameters.concat('/todate', todate);
            if (typeof mmsi == 'number') parameters=parameters.concat('/mmsi:', mmsi.toString());
            if (typeof imo == 'number') parameters=parameters.concat('/imo:', imo.toString());
            if (typeof MINLAT == 'number') parameters=parameters.concat('/MINLAT:', imo.toString());
            if (typeof MAXLAT == 'number') parameters=parameters.concat('/MAXLAT:', imo.toString());
            if (typeof MINLON == 'number') parameters=parameters.concat('/MINLON:', imo.toString());
            if (typeof MAXLON == 'number') parameters=parameters.concat('/MAXLON:', imo.toString());
            if (protocol.length>0) parameters=parameters.concat('/protocol', protocol);
            var formatUrl = WebService.Endpoint('/exportvesseltrack').concat(parameters);
            $http({
                method: "GET",
                url: formatUrl,
            }).then(function successCallback(response) {
                var locations = response.data;
                callback(locations);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
        return service;
    }]);
