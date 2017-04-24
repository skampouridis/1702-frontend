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

    .controller('HomeCtrl', function($scope, VesselTracks, LocationsService, $http) {

        /*
        The XHTTP requests are not accepted by the server, because the server does not have CORS Headers.
        I tried to overcome this using JSONP requests, but it failed.
        There are three possible solutions:
        1. I reproduce the MarineTraffic API locally, and make requests without javascript (because the CORS limitation is JavaScript's limitation), using PHP for example.
        2. I use JSONP in my requests and whitelist the domain of the MarineTraffic API
        2. The server adds CORS headers

        from stackoverflow:
        JSONP (as in "JSON with Padding") is a method commonly used to
        bypass the cross-domain policies in web browsers (you are not
        allowed to make AJAX requests to a webpage perceived to be on
        a different server by the browser).

        */

        // LocationsService.GetLocations(3, '', '', 538005478, '', '', '', '', '', 'jsono', function(results) {
        //     $scope.results = results;
        //     console.log(results);
        // });

        $scope.fetchVessel = function() {
          var mmsi = parseInt($scope.mmsi);
          LocationsService.GetLocations(3, '', '', mmsi, '', '', '', '', '', 'jsono', function(results) {
              $scope.results = results;
              console.log(results);
              // loadMap(results);
          });
        };

        var locations = null;
        var vesselLine = [];
        $http.get('img/data.json').then(function(data) {                        //I am using a local copy of the data retrieved from the server
            loadMap(data)                                                        //due to the CORS limitation
        });

        function loadMap(data) {
            locations = data.data;
            console.log(locations);

            for (var i = 0; i < locations.length; i++) {
                var coords = [];
                coords.push(parseFloat(locations[i].LON));
                coords.push(parseFloat(locations[i].LAT));
                vesselLine.push(coords);
            };
            console.log(vesselLine);

            var strPrj = new ol.geom.LineString();
            strPrj.setCoordinates(vesselLine);
            var featureLine = strPrj.transform('EPSG:4326', 'EPSG:3857');
            var route = featureLine.getCoordinates();

            var routeCoords = route;
            var routeLength = routeCoords.length;

            var routeFeature = new ol.Feature({
                geometry: featureLine,
                type: 'route'
            });
            var geoMarker = new ol.Feature({
                type: 'geoMarker',
                geometry: new ol.geom.Point(routeCoords[0])
            });
            var startMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point(routeCoords[0])
            });
            var endMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point(routeCoords[routeLength - 1])
            });

            var styles = {
                'route': new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        width: 6,
                        color: 'rgba(151, 79, 181, 0.79)'
                    })
                }),
                'geoMarker': new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        scale: 0.2,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: 0.75,
                        src: 'img/location.png'
                    })
                }),
                'icon': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        snapToPixel: false,
                        fill: new ol.style.Fill({
                            color: 'black'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 2
                        })
                    })
                })
            };

            var animating = false;
            var speed, now;
            var speedInput = document.getElementById('speed');
            var startButton = document.getElementById('start-animation');

            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    title: 'Some Layer'
                }),
                style: function(feature) {
                    if (animating && feature.get('type') === 'geoMarker') {
                        return null;
                    }
                    return styles[feature.get('type')];
                }
            });

            vectorLayer.getSource().addFeatures([routeFeature, geoMarker, startMarker, endMarker]);

            var map = new ol.Map({
                target: 'map',
                view: new ol.View({
                    center: ol.proj.fromLonLat([23, 38]),
                    zoom: 3,
                    minZoom: 0,
                    maxZoom: 22,
                    projection: 'EPSG:3857'
                }),
                layers: [$scope.stamenTiles, vectorLayer]
            });

            map.getView().setCenter(routeCoords[0]);
            map.getView().setZoom(10);

            var moveFeature = function(event) {
                var vectorContext = event.vectorContext;
                var frameState = event.frameState;

                if (animating) {
                    var elapsedTime = frameState.time - now;
                    // here the trick to increase speed is to jump some indexes
                    // on lineString coordinates
                    var index = Math.round(speed * elapsedTime / 1000);

                    if (index >= routeLength) {
                        stopAnimation(true);
                        return;
                    }

                    var currentPoint = new ol.geom.Point(routeCoords[index]);
                    var feature = new ol.Feature(currentPoint);
                    vectorContext.drawFeature(feature, styles.geoMarker);
                };
                map.render();
            };


            $scope.startAnimation = function() {
                if (animating) {
                    stopAnimation(false);
                } else {
                    animating = true;
                    now = new Date().getTime();
                    speed = speedInput.value;
                    startButton.textContent = 'Cancel Animation';
                    geoMarker.setStyle(null);
                    map.on('postcompose', moveFeature);
                    map.render();
                }
            }

            function stopAnimation(ended) {
                animating = false;
                startButton.textContent = 'Start Animation';
                var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
                /** @type {ol.geom.Point} */
                (geoMarker.getGeometry())
                .setCoordinates(coord);
                map.un('postcompose', moveFeature);
            }

        };

    });
