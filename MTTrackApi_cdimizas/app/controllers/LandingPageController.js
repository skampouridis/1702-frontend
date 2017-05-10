
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
        $scope.loadingVesselTrackingData = false;
        $scope.animationStep = 1; // it refers in hours
        $scope.count = 0;
        $scope.selectMMSIModel = 219291000;

        $scope.slider = {
            // value: 1,
            options: {
                floor: 1,
                ceil: 200,
                skipDataAlso:false
            }
        };
        //
        $scope.vesselTrack = {
            shipId: null,
            list: []
        };
        // Days
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
                // {
                //     id:100,
                //     name: "100 Days"
                // }
            ],
            change: function () {
                $scope.updateVesselTrack($scope.selectDaysModel, $scope.selectMMSIModel);
            }
        };
        // MMSI
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
            bounds: {},
            layers: {
                baselayers:  {
                    xyz: {
                        name: 'OpenStreetMap (XYZ)',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    }
                },
                overlays: {
                    trip: {
                        name: "Vessel Trip Markers",
                        type: "markercluster",
                        visible: true,
                        layerOptions: {
                            showCoverageOnHover: false,
                            // spiderfyOnMaxZoom: false,
                            // singleMarkerMode:true,
                            disableClusteringAtZoom: 10,
                            maxClusterRadius:50,
                            iconCreateFunction: function (cluster) {
                                return L.divIcon({
                                    className: 'map-marker marker-color-gray a-class',
                                    iconSize: new L.Point(28,28),
                                    // html:"<p class=''><i class='fa fa-location-arrow custom-cluster-icon color-red fa-2x' aria-hidden='true'></i><b>"+cluster.getChildCount()+"</b></p>"
                                    html:"<i class='fa fa-circle color-light-red fa-1x'></i><b>"+cluster.getChildCount()+"</b>"
                                });
                            }
                        }
                    },
                    pathLayer:{
                        name: "Vessel Path",
                        type: 'group',
                        visible: true
                    }
                }
            }
        };

        /*************************
         * SCOPE FUNCTIONS
         *************************/
        // API call
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
        // Animation buttons
        $scope.startTrip = function () {
            $scope.tripStarted = true;
            $scope.leafletObj.path = {
                p1: {
                    color: 'green',
                    weight: 4,
                    layer: "pathLayer",
                    // message: "<h5>Route</h5>",
                    latlngs: pathCoordinates
                }
            };
            $scope.timeInterval = 1;
        };
        //
        $scope.pauseTrip = function () {
            $scope.tripStarted = false;
            // $scope.leafletObj.markers = [];
            $interval.cancel(startTheTrip);
        };
        //
        $scope.cancelTrip = function () {
            $scope.count = 0;
            objCounter = 0;
            $scope.tripStarted = false;
            $scope.leafletObj.markers = {};
            $scope.leafletObj.path = {};
            pathCoordinates = [];
            $interval.cancel(startTheTrip);
        };
        // animation progress
        $scope.getPercentage = function () {
            var progress = ($scope.count / $scope.total)*100;
            if($scope.count>=$scope.total){
                progress = 100;
            }
            return progress.toFixed(2);
        };
        //
        $scope.getTotal = function () {
            return $scope.total;
        };
        // Add/remove (bulky) markers/path for all retrieved data-set
        $scope.addMarkersTMap = function () {
            // TODO - Find Center (on animation the center will be the next marker)
            // TODO - The loaded on map markers will depend on zoom level
            // $scope.leafletObj.center  = LeafletService.setMapCenter($scope.vesselTrack.list[0]);
            $scope.leafletObj.markers = LeafletService.createMapMarkersList($scope.vesselTrack.list);
            $scope.leafletObj.bounds  = LeafletService.setBoundsToMap($scope.vesselTrack.list);
        };
        //
        $scope.addPathToMap = function () {
            $scope.leafletObj.path    = LeafletService.createPathList($scope.vesselTrack.list);
            $scope.leafletObj.bounds  = LeafletService.setBoundsToMap($scope.vesselTrack.list);
        };
        //
        $scope.removeMarkers = function () {
            // $scope.leafletObj.center  = resetMapCenter();
            $scope.leafletObj.markers = {};
        };
        //
        $scope.removePath = function () {
            // $scope.leafletObj.center  = resetMapCenter();
            $scope.leafletObj.path = {};
        };


        $scope.$watch("timeInterval", function () {
            $interval.cancel(startTheTrip);
            startTheTrip = $interval(function () {
                if($scope.count<$scope.vesselTrack.list.length){
                    var vesselTimeInterval = LeafletService.calcTimeInterval($scope.vesselTrack.list[$scope.count+1], $scope.vesselTrack.list[$scope.count], "seconds");
                    $scope.timeInterval = vesselTimeInterval / ($scope.animationStep);
                    addOneMarkerToMap($scope.vesselTrack.list[$scope.count]);
                    addPathToMap($scope.vesselTrack.list[$scope.count]);
                    // Set map bounds between first and last printed marker
                    $scope.leafletObj.bounds = LeafletService.setBoundsBetweenExistingMarkers($scope.leafletObj.markers);
                }else{
                    $interval.cancel(startTheTrip);
                }
                if($scope.slider.options.skipDataAlso){
                    $scope.count = $scope.count + $scope.animationStep;
                }else{
                    $scope.count++;
                }
                console.log("Markers set: " + $scope.count + "/" + $scope.vesselTrack.list.length + " Next Marker after: " + $scope.timeInterval + "secs");
            }, $scope.timeInterval*1000);
        });

        /*************************
         * GENERAL FUNCTIONS
         *************************/

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
            // The below replaces previous marker icon with dot
            // if(objCounter>0){
            //     var previousMarker = "m"+(objCounter);
            //     $scope.leafletObj.markers[previousMarker].icon = {
            //         iconUrl: 'images/dot.png',
            //             iconSize:     [14, 14], // size of the icon
            //             iconAnchor:   [7, 10], // point of the icon which will correspond to marker's location
            //             popupAnchor:  [3, 0] // point from which the popup should open relative to the iconAnchor
            //     }
            // }
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
