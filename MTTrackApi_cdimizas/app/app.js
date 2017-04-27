
var $stateProviderRef = null;
(function () {
  'use strict';
    angular.module('MTTrackingApi', ['ui.router', 'ngAnimate', 'ngRoute', 'leaflet-directive']);
    angular.module('MTTrackingApi')
        .config(
            function($stateProvider, $urlRouterProvider) {
                $stateProviderRef = $stateProvider;
                $urlRouterProvider.otherwise('/');
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
            }
        )
})();
