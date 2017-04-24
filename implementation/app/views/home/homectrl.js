'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home/homepage.html',
                controller: 'HomeCtrl',
                name: 'home'
            });
    }])

    .controller('HomeCtrl', function($scope, VesselTracks, LocationsService) {

        LocationsService.GetLocations(3, '', '', 219291000, '', '', '', '', '', 'jsono',function(results) {
            $scope.results = results;
            console.log(results);
        });
    });
