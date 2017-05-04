'use strict';

angular.module('myApp.about', ['ngRoute'])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('about', {
                url: '/about',
                templateUrl: 'views/about/aboutpage.html',
                controller: 'AboutCtrl',
                name: 'about'
            });
    }])

    .controller('AboutCtrl', function($scope) {



    });
