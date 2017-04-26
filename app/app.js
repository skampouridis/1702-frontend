(function () {
    'use strict';
    var app = angular.module('MTTrackingApi', ['ui.router', 'ngAnimate', 'ngRoute', 'uiGmapgoogle-maps']);
    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'sidebar': {
                        templateUrl : 'views/sidebar.html',
                        controller  : 'LandingPageController'
                    },
                    'landingPage': {
                        templateUrl : 'views/landingPage.html',
                        controller  : 'LandingPageController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
})();