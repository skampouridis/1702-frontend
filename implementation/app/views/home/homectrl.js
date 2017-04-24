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
        VesselTracks.Tracks.get({
            apiKey: config.apiKey,
            days: '3',
            mmsi: '219291000',
            protocol: 'jsono'
        }).$promise.then(function(data) {
            $scope.data = data;
            console.log(data);
        });

        LocationsService.GetLocations(function(results) {
            $scope.results = results;
            console.log(results);
        });

    });
