angular.module('myApp')
    .factory('LocationsService', ['$http', 'WebService', function($http, WebService) {
        var service = {};
        service.GetLocations = function(callback) {
            $http({
                method: "GET",
                url: 'http://services.marinetraffic.com/api/exportvesseltrack/3ff05956b0fd72b18a40e69b96c9f4423163490f/days:3/mmsi:219291000/protocol:jsono'
            }).then(function successCallback(response) {
                var locations = response.data;
                callback(locations);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
        return service;
    }]);
