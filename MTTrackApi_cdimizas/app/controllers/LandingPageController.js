
(function () {
    'use strict';
    angular.module('MTTrackingApi').controller('LandingPageController', LandingPageController);
    LandingPageController.$inject = ['$scope', 'ApiCallService', 'LeafletService'];
    // HOME PAGE
    function LandingPageController($scope, ApiCallService, LeafletService) {


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
        $scope.leafletObj = {
            center:{
                lat:37.9781853,
                lng:23.7312262,
                zoom: 12
            },
            markers : {}
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
            $scope.leafletObj.center = setMapCenter($scope.vesselTrack.list[0]);
            $scope.leafletObj.markers = createMapMarkersList($scope.vesselTrack.list);
        };


        /*************************
         * GENERAL FUNCTIONS
         *************************/

        // prepare marker object and add it to directive attribute
        function prepareMarketObl(currentLocationData){
            var tooltip = "Speed: "+currentLocationData.SPEED+
                " Course: " + currentLocationData.COURSE +
                " At Time: " + new Date(currentLocationData.TIMESTAMP);
            return {
                lat: Number(currentLocationData.LAT),
                lng: Number(currentLocationData.LON),
                message: tooltip
            };
        }

        function setMapCenter(currentLocationData){
            return {
                lat:Number(currentLocationData.LAT),
                lng:Number(currentLocationData.LON),
                zoom: 3
            }
        }

        function createMapMarkersList(markers){
            var mapObjMarkers = [];
            for(var i=0; i<markers.length; i++){
                var markerName = "m"+(i+1);
                mapObjMarkers[markerName] = prepareMarketObl(markers[i]);
                // mapObjMarkers.push(prepareMarketObl(markers[i]));
            }
            return mapObjMarkers;
        }
    }
})();
