angular.module('myApp')
    .factory('VesselTracks', function($resource, WebService) {
            return {
                Tracks: $resource('http://services.marinetraffic.com/api/exportvesseltrack/:apiKey/days::days/fromdate::fromdate/todate::todate/mmsi::mmsi/imo::imo/MINLAT::MINLAT/MAXLAT::MAXLAT/MINLON::MINLON/MAXLON::MAXLON/protocol::protocol', {
                    apiKey: '@apiKey',
                    days: '@days',
                    fromdate: '@fromdate',
                    todate: '@todate',
                    mmsi: '@mmsi',
                    imo: '@imo',
                    MINLAT: '@MINLAT',
                    MAXLAT: '@MAXLAT',
                    MINLON: '@MINLON',
                    MAXLON: '@MAXLON',
                    protocol: '@protocol',
                })
            }
          });
