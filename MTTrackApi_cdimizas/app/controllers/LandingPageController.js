
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
        var objCounter = 0;
        var pathCoordinates = [];


        // models
        $scope.tripStarted = false;
        $scope.selectDaysModel = null;
        $scope.animationStep = 1;
        $scope.count = 0;
        $scope.selectMMSIModel = 219291000;

        $scope.slider = {
            // value: 1,
            options: {
                floor: 1,
                ceil: 100
            }
        };

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
        /*
            API call
         */
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

        /*
            Animation buttons
         */
        $scope.startTrip = function () {
            $scope.tripStarted = true;
            $scope.leafletObj.path = {
                p1: {
                    color: 'green',
                    weight: 4,
                    // message: "<h5>Route</h5>",
                    latlngs: pathCoordinates
                }
            };
            startTheTrip = $interval(function() {
                if($scope.count<$scope.vesselTrack.list.length){
                    addOneMarkerToMap($scope.vesselTrack.list[$scope.count]);
                    addPathToMap($scope.vesselTrack.list[$scope.count]);
                    setBoundsBetweenExistingMarkers($scope.leafletObj.markers);
                }else{
                    $interval.cancel(startTheTrip);
                }
                $scope.count = $scope.count + $scope.animationStep;
                console.log("Markers set: " + $scope.count + "/" + $scope.vesselTrack.list.length);
                // $scope.count++;
            }, 1500);
        };

        $scope.pauseTrip = function () {
            $scope.tripStarted = false;
            // $scope.leafletObj.markers = [];
            $interval.cancel(startTheTrip);
        };

        $scope.cancelTrip = function () {
            $scope.count = 0;
            objCounter = 0;
            $scope.tripStarted = false;
            $scope.leafletObj.markers = {};
            $scope.leafletObj.path = {};
            pathCoordinates = [];
            $interval.cancel(startTheTrip);
        };

        //TODO - bind locationGrid to zoom level
        $scope.$watch("leafletObj.center.zoom", function (zoom) {
            // TODO
            // TODO - ON ZOOM LEVEL DO NOT PRINT ALL MARKERS
            // TODO - PROBABLY PERFORM MARKERS CLUSTERING
            // if zoom level x then ...
        });

        /*
            animation progress
         */
        $scope.getPercentage = function () {
            var progress = ($scope.count / $scope.total)*100;
            if($scope.count>=$scope.total){
                progress = 100;
            }
            return progress.toFixed(2);
        };

        $scope.getTotal = function () {
            return $scope.total;
        };

        /*
            Add/remove (bulky) markers/path for all retrieved data-set
         */
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
            // $scope.leafletObj.center  = resetMapCenter();
            $scope.leafletObj.markers = {};
        };

        $scope.removePath = function () {
            // $scope.leafletObj.center  = resetMapCenter();
            $scope.leafletObj.path = {};
        };


        /*************************
         * GENERAL FUNCTIONS
         *************************/

        function setBoundsToMap(){
            var boundsArray = LeafletService.setMapBounds($scope.vesselTrack.list);
            $scope.leafletObj.bounds  = leafletBoundsHelpers.createBoundsFromArray(boundsArray);
        }

        function setBoundsBetweenExistingMarkers(markersList){
            var boundsArray = LeafletService.setMapBoundsFromMarkerObj(markersList);
            $scope.leafletObj.bounds  = leafletBoundsHelpers.createBoundsFromArray(boundsArray)
        }

        function resetMapCenter(){
            return{
                lat:37.9781853,
                lng:23.7312262,
                zoom: 12
            };
        }

        function addOneMarkerToMap(currentLocationData){
            var markerName = "m"+(objCounter+1);
            $scope.leafletObj.markers[markerName] = LeafletService.prepareMarketObl(currentLocationData);
            if(objCounter>0){
                var previousMarker = "m"+(objCounter);
                $scope.leafletObj.markers[previousMarker].icon = {
                    iconUrl: 'images/dot.png',
                        iconSize:     [14, 14], // size of the icon
                        iconAnchor:   [7, 10], // point of the icon which will correspond to marker's location
                        popupAnchor:  [3, 0] // point from which the popup should open relative to the iconAnchor
                }
            }
            objCounter++;
        }

        function addPathToMap(currentLocationData){
            $scope.leafletObj.path.p1.latlngs.push({
                lat:parseFloat(currentLocationData.LAT),
                lng:parseFloat(currentLocationData.LON)
            });
            pathCoordinates = angular.copy($scope.leafletObj.path.p1.latlngs);
        }
    }
})();
