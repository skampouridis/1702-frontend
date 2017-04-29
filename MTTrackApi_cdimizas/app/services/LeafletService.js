(function () {
    "use strict";
    angular.module('MTTrackingApi').factory('LeafletService',LeafletService);
    LeafletService.$inject= [];

    function LeafletService() {
		// TODO
        var services = {
            // prepareMarketObl : _prepareMarketObl,
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
                lat: Number(currentLocationData.LAT),
                lng: Number(currentLocationData.LON),
                message: tooltip
            };
        }

        function _setMapCenter(currentLocationData){
            return {
                lat:Number(currentLocationData.LAT),
                lng:Number(currentLocationData.LON),
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
                [Number(LocationListData[0].LAT), Number(LocationListData[0].LON)],
                [Number(LocationListData[LocationListData.length-1].LAT), Number(LocationListData[LocationListData.length-1].LON)]
            ];
        }

        function _createPathList(LocationListData){
            var path = {
                p1:{
                    color: 'red',
                    weight: 4,
                    message: "<h5>Route</h5>",
                    latlngs: []
                }
            };

            for(var i=0; i<LocationListData.length; i++){
                path.p1.latlngs.push({
                    lat:Number(LocationListData[i].LAT),
                    lng:Number(LocationListData[i].LON)
                });
            }
            return path;
        }
    }
})();
