
(function () {
    'use strict';
    angular.module('MTTrackingApi').controller('LandingPageController', LandingPageController);
    LandingPageController.$inject = ['$scope', 'ApiCallService', 'uiGmapGoogleMapApi'];
    // HOME PAGE
    function LandingPageController($scope, ApiCallService, uiGmapGoogleMapApi) {

        /**********
         * ACTIONS
         **********/
        $scope.selectDaysModel = 1;
        $scope.selectDays = {
            list:[
                {
                    id:1,
                    name: "1 Day"
                },
                {
                    id:2,
                    name: "2 Days"
                },
                {
                    id:3,
                    name: "3 Days"
                },
                {
                    id:4,
                    name: "4 Days"
                },
                {
                    id:5,
                    name: "5 Days"
                }

            ],
            change: function () {
                console.log($scope.selectDaysModel);
            }
        };


        /**********
         * MAP
         **********/
        $scope.map = {
            center: {
                latitude: 40.1451,
                longitude: -99.6680
            },
            zoom: 4,
            bounds: {
                northeast: {
                    latitude: 45.1451,
                    longitude: -80.6680
                },
                southwest: {
                    latitude: 30.000,
                    longitude: -120.6680
                }
            }
        };

        var createRandomMarker = function(i, bounds, idKey) {
            var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;

            if (idKey == null) {
                idKey = "id";
            }

            var latitude = lat_min + (Math.random() * lat_range);
            var longitude = lng_min + (Math.random() * lng_range);
            var ret = {
                latitude: latitude,
                longitude: longitude,
                title: 'm' + i
            };
            ret[idKey] = i;
            return ret;
        };
        var markers = [];
        for (var i = 0; i < 50; i++) {
            markers.push(createRandomMarker(i, $scope.map.bounds))
        }
        $scope.randomMarkers = markers;

        // POLYLINES
        $scope.polylines = [];
        uiGmapGoogleMapApi.then(function(){
            $scope.polylines = [
                {
                    id: 1,
                    path: [
                        {
                            latitude: 45,
                            longitude: -74
                        },
                        {
                            latitude: 30,
                            longitude: -89
                        },
                        {
                            latitude: 37,
                            longitude: -122
                        },
                        {
                            latitude: 60,
                            longitude: -95
                        }
                    ],
                    stroke: {
                        color: '#6060FB',
                        weight: 3
                    },
                    editable: true,
                    draggable: true,
                    geodesic: true,
                    visible: true,
                    icons: [{
                        icon: {
                            path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                        },
                        offset: '25px',
                        repeat: '50px'
                    }]
                },
                {
                    id: 2,
                    path: [
                        {
                            latitude: 47,
                            longitude: -74
                        },
                        {
                            latitude: 32,
                            longitude: -89
                        },
                        {
                            latitude: 39,
                            longitude: -122
                        },
                        {
                            latitude: 62,
                            longitude: -95
                        }
                    ],
                    stroke: {
                        color: '#6060FB',
                        weight: 3
                    },
                    editable: true,
                    draggable: true,
                    geodesic: true,
                    visible: true,
                    icons: [{
                        icon: {
                            path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                        },
                        offset: '25px',
                        repeat: '50px'
                    }]
                }
            ];
        });
    }
})();