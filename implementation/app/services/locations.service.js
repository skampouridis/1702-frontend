/*
As explained in homectrl.js, I am trying to make a call using JSONP
because the server does not allow cross origin requests.
*/

function log_result(data) {
  console.log(data);
}

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
            if (typeof MINLAT == 'number') parameters=parameters.concat('/MINLAT:', MINLAT.toString());
            if (typeof MINLAT == 'number') parameters=parameters.concat('/MAXLAT:', MINLAT.toString());
            if (typeof MINLON == 'number') parameters=parameters.concat('/MINLON:', MINLON.toString());
            if (typeof MAXLON == 'number') parameters=parameters.concat('/MAXLON:', MAXLON.toString());
            if (protocol.length>0) parameters=parameters.concat('/protocol:', protocol);
            var formatUrl = WebService.Endpoint('/exportvesseltrack').concat(parameters);
            // $http.jsonp(formatUrl, {jsonpCallbackParam: 'log_result'});
            // $http({
            //     method: "GET",
            //     url: WebService.Endpoint(formatUrl)
            // }).then(function successCallback(response) {
            //     var tracks = response.data;
            //     callback(tracks);
            // }, function errorCallback(response) {
            //     console.log(response);
            // });
            $.get(formatUrl, function(data, status){
                console.log("\nStatus: " + status);
            }).done(function(data) {
              callback(data);
            }).fail(function() {
              console.log('Failed');
            });
        }
        return service;
    }]);
