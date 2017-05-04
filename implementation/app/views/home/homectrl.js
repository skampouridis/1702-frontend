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

    .controller('HomeCtrl', function($scope, LocationsService, $http, $filter) {

        /**
         * Elements that make up the popup.
         */
        var container = document.getElementById('popup');
        var content = document.getElementById('popup-content');
        var closer = document.getElementById('popup-closer');

        var overlay = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));

        closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };

        LocationsService.GetLocations(3, '', '', 477336000, '', '', '', '', '', 'jsono', function(results) {
            loadMap(results);
        });

        $scope.fetchVessel = function() {
            var mmsi = parseInt($scope.mmsi);
            LocationsService.GetLocations(3, '', '', mmsi, '', '', '', '', '', 'jsono', function(results) {
                console.log(results);
                loadMap(results);
            });
        };


        var map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat([23, 38]),
                zoom: 3,
                minZoom: 0,
                maxZoom: 22,
                projection: 'EPSG:3857'
            }),
            layers: [$scope.stamenTiles],
            overlays: [overlay]
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

        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                title: 'Route Layer'
            })
        });

        var clusters = new ol.layer.Vector({
            source: new ol.source.Vector({
                title: 'Other'
            })
        });

        map.addLayer(vectorLayer);
        map.addLayer(clusters);

        function loadMap(data) {
            var locations = data;
            var vesselLine = [];

            vectorLayer.getSource().clear();
            clusters.getSource().clear();

            var propertiesArray = [];
            for (let i = 0; i < locations.length; i++) {
                var coords = [];
                var props = {
                    speed: locations[i].SPEED,
                    course: locations[i].COURSE,
                    heading: locations[i].HEADING,
                    time: locations[i].TIMESTAMP,
                    id: locations[i].SHIP_ID,
                    mmsi: locations[i].MMSI
                };
                coords.push(parseFloat(locations[i].LON));
                coords.push(parseFloat(locations[i].LAT));
                vesselLine.push(coords);
                propertiesArray[i] = props;
            };

            var strPrj = new ol.geom.LineString();
            strPrj.setCoordinates(vesselLine);
            var featureLine = strPrj.transform('EPSG:4326', 'EPSG:3857');
            var route = featureLine.getCoordinates();

            var routeCoordsProps = [];
            for (let i = 0; i < locations.length; i++) {
                routeCoordsProps[i] = {
                    coordinates: route[i],
                    properties: propertiesArray[i]
                };
            };
            console.log(routeCoordsProps[0]);

            var routeLength = routeCoordsProps.length;

            var routeFeature = new ol.Feature({
                geometry: featureLine,
                type: 'route'
            });

            var geoMarker = new ol.Feature({
                type: 'geoMarker',
                geometry: new ol.geom.Point(routeCoordsProps[0].coordinates)
            });
            var startMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point(routeCoordsProps[0].coordinates)
            });
            var endMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point(routeCoordsProps[routeLength - 1].coordinates)
            });

            var animating = false;
            var speed, now;
            var speedInput = document.getElementById('speed');
            var startButton = document.getElementById('start-animation');

            vectorLayer.setStyle(function(feature) {
                if (animating && feature.get('type') === 'geoMarker') {
                    return null;
                }
                return styles[feature.get('type')];
            });

            vectorLayer.getSource().addFeatures([routeFeature, geoMarker, startMarker, endMarker]);

            var waypoints = new Array(locations.length);

            for (let i = 0; i < locations.length; i++) {
                waypoints[i] = new ol.Feature({
                    type: 'icon',
                    geometry: new ol.geom.Point(routeCoordsProps[i].coordinates),
                    properties: routeCoordsProps[i].properties
                });
            };

            var waypointsSource = new ol.source.Vector({
                features: waypoints
            });

            var clusterWaypoints = new ol.source.Cluster({
                distance: 40,
                source: waypointsSource
            });

            clusters.setSource(clusterWaypoints);
            clusters.setStyle(function(feature, resolution) {
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
            });

            var styleCache = {};

            map.getView().setCenter(routeCoordsProps[0].coordinates);
            map.getView().setZoom(10);

            var ind = 0;

            var moveFeature = function(event) {
                var vectorContext = event.vectorContext;
                var frameState = event.frameState;

                if (animating) {
                    var elapsedTime = frameState.time - now;
                    var index = Math.round(speed * elapsedTime * propertiesArray[ind].speed / 2000);
                    if (index >= routeLength) {
                        stopAnimation(true);
                        return;
                    };
                    ind = index;
                    var currentPoint = new ol.geom.Point(routeCoordsProps[index].coordinates);
                    var feature = new ol.Feature(currentPoint);
                    var head = routeCoordsProps[index].properties.heading;
                    styles.geoMarker.getImage().setRotation(head * Math.PI / 180);
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
                    console.log(speed);
                    startButton.textContent = 'Cancel Animation';
                    geoMarker.setStyle(null);
                    map.on('postcompose', moveFeature);
                    map.render();
                }
            }

            function stopAnimation(ended) {
                animating = false;
                startButton.textContent = 'Start Animation';
                var coord = ended ? routeCoordsProps[routeLength - 1].coordinates : routeCoordsProps[0].coordinates;
                /** @type {ol.geom.Point} */
                (geoMarker.getGeometry())
                .setCoordinates(coord);
                map.un('postcompose', moveFeature);
            }

        };

        map.on('singleclick', function(evt) {
            var coordinate = evt.coordinate;

            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature, layer) {
                  console.log(layer, feature.getProperties());
                    return feature;
                });

            if (feature.getProperties().features) {
                var vesselProperties = feature.getProperties().features[0].O.properties;
                content.innerHTML = "<h4>Vessel with ID <b>" + vesselProperties.id + "</b></h4>";
                content.innerHTML += "<p><b>MMSI: </b>" + vesselProperties.mmsi + "</p>";
                content.innerHTML += "<p><b>Speed: </b>" + vesselProperties.speed + "</p>";
                content.innerHTML += "<p><b>Course: </b>" + vesselProperties.course + "</p>";
                var timestamp = Date.parse(vesselProperties.time);
                var time = $filter('date')(timestamp, "yyyy-MM-dd @ HH:mm:ss 'GMT'Z");
                content.innerHTML += "<p><b>Timestamp: </b>" + time + "</p>";
                overlay.setPosition(coordinate);
            } else {

            };

        });

        // Make the curson a hand-pointer when the mouse is over a feature
        var cursorHoverStyle = "pointer";
        var target = map.getTarget();
        var jTarget = typeof target === "string" ? $("#" + target) : $(target);
        map.on("pointermove", function(event) {
            var mouseCoordInMapPixels = [event.originalEvent.offsetX, event.originalEvent.offsetY];

            var hit = map.forEachFeatureAtPixel(mouseCoordInMapPixels, function(feature, layer) {
                return true;
            });

            if (hit) {
                jTarget.css("cursor", cursorHoverStyle);
            } else {
                jTarget.css("cursor", "");
            }
        });

    });
