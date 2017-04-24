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

        LocationsService.GetLocations(3, '', '', 219291000, '', '', '', '', '', 'jsono', function(results) {
            $scope.results = results;
            console.log(results);
        });
        //
        // var map = new ol.Map({
        //     target: 'map',
        //     layers: [$scope.stamenTiles],
        //     view: new ol.View({
        //         center: ol.proj.fromLonLat([23, 38]),
        //         zoom: 3,
        //         minZoom: 0,
        //         maxZoom: 22
        //     })
        // });
        //
        // $scope.centerMap = function() {
        //     map.getView().setCenter(ol.proj.fromLonLat([23, 38]));
        //     map.getView().setZoom(3);
        // };
        //
        // var locations = null;
        //
        //
        // var format = new ol.format.GeoJSON();
        // var locationLayer = new ol.layer.Vector({
        //     title: 'Locations Layer',
        //     source: new ol.source.Vector()
        // });
        // var iconStyle = new ol.style.Style({
        //     image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
        //         anchor: [0.5, 0.5],
        //         scale: 0.1,
        //         anchorXUnits: 'fraction',
        //         anchorYUnits: 'fraction',
        //         opacity: 0.75,
        //         src: 'img/location.png'
        //     }))
        // });
        // locationLayer.setStyle(iconStyle);
        // map.addLayer(locationLayer);
        // var formatGeoJson = {
        //     type: "FeatureCollection",
        //     features: []
        // };
        // $http.get('img/data.json').then(function(data) {
        //     locations = data.data;
        //     console.log(locations);
        //
        //     for (var i = 0; i < locations.length; i++) {
        //         var vessel = {
        //             type: "Feature",
        //             geometry: {
        //                 type: 'Point',
        //                 coordinates: []
        //             },
        //             properties: []
        //         };
        //
        //         vessel.geometry.coordinates.push(parseFloat(locations[i].LON));
        //         vessel.geometry.coordinates.push(parseFloat(locations[i].LAT));
        //         vessel.properties.push({
        //             mmsi: locations[i].mmsi
        //         });
        //         formatGeoJson.features.push(vessel);
        //         console.log(vessel);
        //     };
        //     locationLayer.getSource().addFeatures(format.readFeatures(formatGeoJson, {
        //         featureProjection: 'EPSG:3857'
        //     }));
        // });
        // This long string is placed here due to jsFiddle limitations.
        // It is usually loaded with AJAX.
        // var polyline = [
        //   [-42.01171875,-37.99616267972812],
        //   [-37.79296875,-37.85750715625203],
        //   [-34.27734375,-38.13455657705412],
        //   [-30.937499999999996,-38.54816542304657],
        //   [-26.71875,-38.95940879245421]
        // ];
        //
        // var points = [
        //   new ol.geom.Point([-42.01171875,-37.99616267972812]),
        //   new ol.geom.Point([-37.79296875,-37.85750715625203]),
        //   new ol.geom.Point([-34.27734375,-38.13455657705412]),
        //   new ol.geom.Point([-30.937499999999996,-38.54816542304657]),
        //   new ol.geom.Point([-26.71875,-38.95940879245421])
        // ];
        //
        // console.log(points);
        //
        // var featureLine = new ol.Feature({
        //     geometry: new ol.geom.LineString(points)
        // });
        //
        // var route = featureLine.getGeometry();
        // console.log(route.getCoordinates());
        //
        // var routeCoords = route.getCoordinates();
        // var routeLength = routeCoords.length;
        //
        // var routeFeature = new ol.Feature({
        //     type: 'route',
        //     geometry: route
        // });
        // var geoMarker = new ol.Feature({
        //     type: 'geoMarker',
        //     geometry: new ol.geom.Point(routeCoords[0])
        // });
        // var startMarker = new ol.Feature({
        //     type: 'icon',
        //     geometry: new ol.geom.Point(routeCoords[0])
        // });
        // var endMarker = new ol.Feature({
        //     type: 'icon',
        //     geometry: new ol.geom.Point(routeCoords[routeLength - 1])
        // });
        //
        // var styles = {
        //     'route': new ol.style.Style({
        //         stroke: new ol.style.Stroke({
        //             width: 6,
        //             color: [237, 212, 0, 0.8]
        //         })
        //     }),
        //     'icon': new ol.style.Style({
        //         image: new ol.style.Icon({
        //             anchor: [0.5, 1],
        //             src: 'https://openlayers.org/en/v4.1.0/examples/data/icon.png'
        //         })
        //     }),
        //     'geoMarker': new ol.style.Style({
        //         image: new ol.style.Circle({
        //             radius: 7,
        //             snapToPixel: false,
        //             fill: new ol.style.Fill({
        //                 color: 'black'
        //             }),
        //             stroke: new ol.style.Stroke({
        //                 color: 'white',
        //                 width: 2
        //             })
        //         })
        //     })
        // };
        //
        // var animating = false;
        // var speed, now;
        // var speedInput = document.getElementById('speed');
        // var startButton = document.getElementById('start-animation');
        //
        // var vectorLayer = new ol.layer.Vector({
        //     source: new ol.source.Vector({
        //         features: [routeFeature, geoMarker, startMarker, endMarker]
        //     }),
        //     style: function(feature) {
        //         // hide geoMarker if animation is active
        //         if (animating && feature.get('type') === 'geoMarker') {
        //             return null;
        //         }
        //         return styles[feature.get('type')];
        //     }
        // });
        //
        // var center = [-5639523.95, -3501274.52];
        // var map = new ol.Map({
        //     target: document.getElementById('map'),
        //     loadTilesWhileAnimating: true,
        //     view: new ol.View({
        //         center: center,
        //         zoom: 10,
        //         minZoom: 2,
        //         maxZoom: 19
        //     }),
        //     layers: [$scope.stamenTiles,
        //         vectorLayer
        //     ]
        // });
        //
        // var moveFeature = function(event) {
        //     var vectorContext = event.vectorContext;
        //     var frameState = event.frameState;
        //
        //     if (animating) {
        //         var elapsedTime = frameState.time - now;
        //         // here the trick to increase speed is to jump some indexes
        //         // on lineString coordinates
        //         var index = Math.round(speed * elapsedTime / 1000);
        //
        //         if (index >= routeLength) {
        //             stopAnimation(true);
        //             return;
        //         }
        //
        //         var currentPoint = new ol.geom.Point(routeCoords[index]);
        //         var feature = new ol.Feature(currentPoint);
        //         vectorContext.drawFeature(feature, styles.geoMarker);
        //     }
        //     // tell OpenLayers to continue the postcompose animation
        //     map.render();
        // };
        //
        // function startAnimation() {
        //     if (animating) {
        //         stopAnimation(false);
        //     } else {
        //         animating = true;
        //         now = new Date().getTime();
        //         speed = speedInput.value;
        //         startButton.textContent = 'Cancel Animation';
        //         // hide geoMarker
        //         geoMarker.setStyle(null);
        //         // just in case you pan somewhere else
        //         map.getView().setCenter(center);
        //         map.on('postcompose', moveFeature);
        //         map.render();
        //     }
        // }
        //
        //
        // /**
        //  * @param {boolean} ended end of animation.
        //  */
        // function stopAnimation(ended) {
        //     animating = false;
        //     startButton.textContent = 'Start Animation';
        //
        //     // if animation cancelled set the marker at the beginning
        //     var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
        //     /** @type {ol.geom.Point} */
        //     (geoMarker.getGeometry())
        //     .setCoordinates(coord);
        //     //remove listener
        //     map.un('postcompose', moveFeature);
        // }
        //
        // startButton.addEventListener('click', startAnimation, false);
    });
