
(function () {
    'use strict';
    angular.module('MTTrackingApi').controller('LandingPageController', LandingPageController);
    LandingPageController.$inject = ['$scope', 'ApiCallService', 'LeafletService', '$timeout'];
    // HOME PAGE
    function LandingPageController($scope, ApiCallService, LeafletService, $timeout) {

        /*****************
         * ACTION BUTTONS (Side bar)
         ****************/
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

        /*************************
        * Leaflet Map
        *************************/
        $scope.leafletObj = {
            athens:{
                lat:37.9781853,
                lng:23.7312262,
                zoom: 12
            }
        };

    }
})();
