
(function () {
    'use strict';
    angular.module('MTTrackingApi').controller('LandingPageController', LandingPageController);
    LandingPageController.$inject = ['$scope', 'ApiCallService', 'LeafletService', 'leafletBoundsHelpers', '$interval'];
    // HOME PAGE
    function LandingPageController($scope, ApiCallService, LeafletService, leafletBoundsHelpers, $interval) {


        /*************************
         * SCOPE VARIABLES
         *************************/

        var startTheTrip = null;
        var count = 0;

        // models
        $scope.tripStarted = false;
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
                },
                {
                    id:100,
                    name: "100 Days"
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
            center:{ lat: 37.9781853,
                lng: 23.7312262,
                zoom: 3
            },
            defaults: {
                // scrollWheelZoom: false
            },
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
                        $scope.total = response.length;
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
            $scope.leafletObj.center  = resetMapCenter();
            $scope.leafletObj.markers = {};
        };

        $scope.removePath = function () {
            $scope.leafletObj.center  = resetMapCenter();
            $scope.leafletObj.path = {};
        };

        $scope.startTrip = function () {
            $scope.tripStarted = true;
            startTheTrip = $interval(function() {
                startAddingMarkers($scope.vesselTrack.list)
            }, 1000);
        };

        $scope.pauseTrip = function () {
            $scope.tripStarted = false;
            // $scope.leafletObj.markers = [];
            $interval.cancel(startTheTrip);
        };

        $scope.cancelTrip = function () {
            count = 0;
            $scope.tripStarted = false;
            $scope.leafletObj.markers = [];
            $interval.cancel(startTheTrip);
        };

        //bind locationGrid to zoom level
        $scope.$watch("leafletObj.center.zoom", function (zoom) {
            // TODO
            // TODO - ON ZOOM LEVEL DO NOT PRINT ALL MARKERS
            // if zoom level x then ...
        });

        $scope.threshold = 15000;

        $scope.getPercentage = function () {
            return ((count / $scope.total)*100).toFixed(2);
        };
        $scope.getTotal = function () {
            return $scope.total;
        };


        /*************************
         * GENERAL FUNCTIONS
         *************************/

        function setBoundsToMap(){
            var boundsArray = LeafletService.setMapBounds($scope.vesselTrack.list);
            $scope.leafletObj.bounds  = leafletBoundsHelpers.createBoundsFromArray(boundsArray);
        }

        function resetMapCenter(){
            return{
                lat:37.9781853,
                lng:23.7312262,
                zoom: 12
            };
        }

        function calculateSpeedIntervals(LocationListData){
            var speeds = [];
            for(var i=0; i<LocationListData.length; i++){
                var next = i+1;
                if(next<LocationListData.length){
                    var dt = getTimeInterval(LocationListData[next].TIMESTAMP, "minutes") - getTimeInterval(LocationListData[i].TIMESTAMP, "minutes");
                    var dlat = parseFloat(LocationListData[next].LAT) - parseFloat(LocationListData[i].LAT);
                    var s = parseFloat(dlat/dt);
                    speeds.push(s);
                }
            }
            return speeds;
        }

        function getTimeInterval(timeString, timeIntervalCase){
            var seconds = 1000;
            var minutes = seconds * 60;
            var hours = minutes * 60;
            var days = hours * 24;
            var time = new Date(timeString);

            switch(timeIntervalCase){
                case 'seconds':
                    return Math.round((time.getTime())/seconds);
                    break;
                case 'minutes':
                    return Math.round((time.getTime())/minutes);
                    break;
                case 'hours':
                    return Math.round((time.getTime())/hours);
                    break;
                case 'days':
                    return Math.round((time.getTime())/days);
                    break;
            }
        }

        function startAddingMarkers(LocationListData){
            setBoundsToMap();
            if(count<LocationListData.length){
                var markerName = "m"+(count+1);
                $scope.leafletObj.markers[markerName] = LeafletService.prepareMarketObl(LocationListData[count]);
            }else{
                $interval.cancel(startTheTrip);
            }
            console.log("Markers set: " + count + "/" + LocationListData.length);
            count++;
        }
    }
})();
