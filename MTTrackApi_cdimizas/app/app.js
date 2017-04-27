
var $stateProviderRef = null;
(function () {
  'use strict';
    angular.module('MTTrackingApi', ['ui.router', 'ngAnimate', 'ngRoute', 'leaflet-directive']);
    angular.module('MTTrackingApi').config(
        function($stateProvider, $urlRouterProvider, $qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
            $stateProviderRef = $stateProvider;
            $urlRouterProvider.otherwise('/');
            $stateProvider
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'landingPage': {
                        templateUrl : 'views/landingPage.html',
                        controller  : 'LandingPageController'
                     }
                }
            });
        }
        );
})();
