
(function () {
    'use strict';
    angular.module('MTTrackingApi').controller('LandingPageController', LandingPageController);
    LandingPageController.$inject = ['$scope', 'ApiCallService', 'LeafletService', 'leafletBoundsHelpers'];
    // HOME PAGE
    function LandingPageController($scope, ApiCallService, LeafletService, leafletBoundsHelpers) {


        /*************************
         * SCOPE VARIABLES
         *************************/

        // models
        $scope.selectDaysModel = null;
        $scope.selectMMSIModel = 219291000;
        $scope.vesselTrack = {
            shipId: null,
            list: []
        };
        $scope.loadingVesselTrackingData = false;

        // Side bar elements
        $scope.selectDays = {
            list:[
                {
                    id:1,
                    name: "1 Day"
                },
                {
                    id:5,
                    name: "5 Days"
                },
                {
                    id:10,
                    name: "10 Days"
                },
                {
                    id:20,
                    name: "20 Days"
                },
                {
                    id:40,
                    name: "40 Days"
                }

            ],
            change: function () {
                $scope.updateVesselTrack($scope.selectDaysModel, $scope.selectMMSIModel);
            }
        };
        $scope.selectMMSI = {
            list:[
                {
                    id:219291000,
                    mmsi: "219291000"
                }
            ],
            change: function () {
                $scope.updateVesselTrack($scope.selectDaysModel, $scope.selectMMSIModel);
            }
        };

        // Leaflet Map
        var initMapCenter = {
            lat:37.9781853,
            lng:23.7312262,
            zoom: 12
        };
        $scope.leafletObj = {
            center:angular.copy(initMapCenter),
            markers : {},
            path: {},
            bounds: {}
        };



        /*************************
         * SCOPE FUNCTIONS
         *************************/
        $scope.updateVesselTrack = function (days, mmsi) {
            $scope.loadingVesselTrackingData = true;
            ApiCallService.getVesselTrack(days, mmsi).then(
                // Success
                function (response) {
                    if(response){
                        $scope.loadingVesselTrackingData = false;
                        $scope.vesselTrack.list = response;
                        $scope.vesselTrack.shipId = response[0].SHIP_ID;
                    }
                },
                // error
                function (error) {
                    $scope.loadingVesselTrackingData = false;
                    $scope.vesselTrack.shipId = null;
                    console.log("No Vessel Tracking Data was found", error);
                }
            );
        };

        $scope.addMarkersTMap = function () {
            // TODO - Find Center (on animation the center will be the next marker)
            // TODO - The loaded on map markers will depend on zoom level
            // $scope.leafletObj.center  = LeafletService.setMapCenter($scope.vesselTrack.list[0]);
            $scope.leafletObj.markers = LeafletService.createMapMarkersList($scope.vesselTrack.list);
            setBoundsToMap();
        };

        $scope.addPathToMap = function () {
            $scope.leafletObj.path    = LeafletService.createPathList($scope.vesselTrack.list);
            setBoundsToMap();
        };

        $scope.removeMarkers = function () {
            $scope.leafletObj.center  = initMapCenter;
            $scope.leafletObj.markers = {};
        };

        $scope.removePath = function () {
            $scope.leafletObj.center  = initMapCenter;
            $scope.leafletObj.path = {};
        };


        /*************************
         * GENERAL FUNCTIONS
         *************************/

        function setBoundsToMap(){
            var boundsArray = LeafletService.setMapBounds($scope.vesselTrack.list);
            $scope.leafletObj.bounds  = leafletBoundsHelpers.createBoundsFromArray(boundsArray);
        }
        // TODO - ON ZOOM LEVEL DO NOT PRINT ALL MARKERS
    }
})();
