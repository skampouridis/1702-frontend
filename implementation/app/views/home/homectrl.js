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

    .controller('HomeCtrl', function($scope, LocationsService, $http) {

        LocationsService.GetLocations(3, '', '', 477336000, '', '', '', '', '', 'jsono', function(results) {
            $scope.results = results;
            console.log(results);
            loadMap(results);
        });

        $scope.fetchVessel = function() {
            var mmsi = parseInt($scope.mmsi);
            LocationsService.GetLocations(3, '', '', mmsi, '', '', '', '', '', 'jsono', function(results) {
                $scope.results = results;
                console.log(results);
                loadMap(results);
            });
        };

        var locations = null;
        var vesselLine = [];

        function loadMap(data) {
            locations = data;
            console.log(locations);

            for (let i = 0; i < locations.length; i++) {
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
                        width: 3,
                        color: 'rgba(151, 79, 181, 0.79)'
                    })
                }),
                'geoMarker': new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        scale: 0.2,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: 0.9,
                        src: 'img/vessel.png'
                    })
                }),
                'icon': new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        scale: 0.2,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: 1,
                        src: 'img/location1.png'
                    })
                })
            };

            var animating = false;
            var speed, now;
            var speedInput = document.getElementById('speed');
            var startButton = document.getElementById('start-animation');

            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    title: 'Route Layer'
                }),
                style: function(feature) {
                    if (animating && feature.get('type') === 'geoMarker') {
                        return null;
                    }
                    return styles[feature.get('type')];
                }
            });

            vectorLayer.getSource().addFeatures([routeFeature, geoMarker, startMarker, endMarker]);

            var waypoints = new Array(locations.length);

            for (let i = 0; i < locations.length; i++) {
                waypoints[i] = new ol.Feature({
                    type: 'icon',
                    geometry: new ol.geom.Point(routeCoords[i])
                });
            };

            var waypointsSource = new ol.source.Vector({
                features: waypoints
            });

            var clusterWaypoints = new ol.source.Cluster({
                distance: 40,
                source: waypointsSource
            });
            var styleCache = {};
            var clusters = new ol.layer.Vector({
                source: clusterWaypoints,
                style: function(feature, resolution) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = [new ol.style.Style({
                            image: new ol.style.Icon({
                                anchor: [0.5, 1],
                                scale: 1,
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                opacity: 1,
                                src: 'img/waypoint.svg'
                            })
                        })];
                        styleCache[size] = style;
                    }
                    return style;
                }
            });

            var map = new ol.Map({
                target: 'map',
                view: new ol.View({
                    center: ol.proj.fromLonLat([23, 38]),
                    zoom: 3,
                    minZoom: 0,
                    maxZoom: 22,
                    projection: 'EPSG:3857'
                }),
                layers: [$scope.stamenTiles, vectorLayer, clusters]
            });

            map.getView().setCenter(routeCoords[0]);
            map.getView().setZoom(10);

            var moveFeature = function(event) {
                var vectorContext = event.vectorContext;
                var frameState = event.frameState;

                if (animating) {
                    var elapsedTime = frameState.time - now;
                    var index = Math.round(speed * elapsedTime / 1000);

                    if (index >= routeLength) {
                        stopAnimation(true);
                        return;
                    }

                    var currentPoint = new ol.geom.Point(routeCoords[index]);
                    var feature = new ol.Feature(currentPoint);
                    var curRot=styles.geoMarker.getImage().getRotation();
                    styles.geoMarker.getImage().setRotation(curRot+40);
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
