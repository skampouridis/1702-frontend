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

        var map = new ol.Map({
            target: 'map',
            layers: [$scope.stamenTiles],
            view: new ol.View({
                center: ol.proj.fromLonLat([23,38]),
                zoom: 7,
                minZoom: 0,
                maxZoom: 22
            })
        });
    });
