
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
            athens:{
                lat:37.9781853,
                lng:23.7312262,
                zoom: 12
            }
        };



        /*************************
         * SCOPE FUNCTIONS
         *************************/
        $scope.updateVesselTrack = function (days, mmsi) {
            $scope.loadingVesselTrackingData = true;
            ApiCallService.getVesselTrack(days, mmsi).then(
                // Success
                function (response) {
                    $scope.loadingVesselTrackingData = false;
                    $scope.vesselTrack.list = response;
                },
                // error
                function (error) {
                    $scope.loadingVesselTrackingData = false;
                    console.log("No Vessel Tracking Data was found", error);
                }
            );
        };


        /*************************
         * GENERAL FUNCTIONS
         *************************/


    }
})();
