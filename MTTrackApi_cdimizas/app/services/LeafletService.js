(function () {
    "use strict";
    angular.module('MTTrackingApi').factory('LeafletService',LeafletService);
    LeafletService.$inject= [];

    function LeafletService() {
		// TODO
        var services = {
            prepareMarketObl      : _prepareMarketObl,
            setMapCenter          : _setMapCenter,
            createMapMarkersList  : _createMapMarkersList,
            createPathList        : _createPathList,
            setMapBounds          : _setMapBounds
        };

        return services;

        // prepare marker object and add it to directive attribute
        function _prepareMarketObl(currentLocationData){
            var tooltip = "Speed: "+currentLocationData.SPEED+
                " Course: " + currentLocationData.COURSE +
                " At Time: " + new Date(currentLocationData.TIMESTAMP);
            return {
                lat: parseFloat(currentLocationData.LAT),
                lng: parseFloat(currentLocationData.LON),
                message: tooltip,
                iconAngle:parseFloat(currentLocationData.HEADING),
                icon:{
                    iconUrl: 'images/Ship-icon.png',
                    iconSize:     [38, 38], // size of the icon
                    iconAnchor:   [22, 38], // point of the icon which will correspond to marker's location
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                    // shadowUrl: 'img/leaf-shadow.png',
                    // shadowSize:   [50, 64], // size of the shadow
                    // shadowAnchor: [4, 62],  // the same for the shadow
                }
            };
        }

        function _setMapCenter(currentLocationData){
            return {
                lat:parseFloat(currentLocationData.LAT),
                lng:parseFloat(currentLocationData.LON),
                zoom: 8
            }
        }

        function _createMapMarkersList(markers){
            var mapObjMarkers = [];
            for(var i=0; i<markers.length; i++){
                var markerName = "m"+(i+1);
                mapObjMarkers[markerName] = _prepareMarketObl(markers[i]);
                // mapObjMarkers.push(prepareMarketObl(markers[i]));
            }
            return mapObjMarkers;
        }

        function _setMapBounds(LocationListData) {
            return [
                [parseFloat(LocationListData[0].LAT), parseFloat(LocationListData[0].LON)],
                [parseFloat(LocationListData[LocationListData.length-1].LAT), parseFloat(LocationListData[LocationListData.length-1].LON)]
            ];
        }

        function _createPathList(LocationListData){
            var path = {
                p1:{
                    color: 'green',
                    weight: 4,
                    message: "<h5>Route</h5>",
                    latlngs: []
                }
            };

            for(var i=0; i<LocationListData.length; i++){
                path.p1.latlngs.push({
                    lat:parseFloat(LocationListData[i].LAT),
                    lng:parseFloat(LocationListData[i].LON)
                });
            }
            return path;
        }
    }
})();
