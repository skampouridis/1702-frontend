angular.module('myApp')
    .factory('VesselTracks', function($resource, WebService) {
            return {
                Tracks: $resource('http://services.marinetraffic.com/api/exportvesseltrack/:apiKey/days::days/mmsi::mmsi/protocol::protocol', {
                    apiKey: '@apiKey',
                    days: '@days',
                    mmsi: '@mmsi',
                    protocol: '@protocol'
                })
            }
          });
