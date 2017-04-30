(function () {
    "use strict";
    angular.module('MTTrackingApi').factory('LeafletService',LeafletService);
    LeafletService.$inject= [];

    function LeafletService() {
		// TODO
        var services = {
            prepareMarketObl          : _prepareMarketObl,
            setMapCenter              : _setMapCenter,
            createMapMarkersList      : _createMapMarkersList,
            createPathList            : _createPathList,
            setMapBounds              : _setMapBounds,
            setMapBoundsFromMarkerObj : _setMapBoundsFromMarkerObj
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
                    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
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

        function _setMapBoundsFromMarkerObj(markersObj) {
            var first = markersObj["m1"];
            var lastPropName = "m" + Object.keys(markersObj).length;
            var last = markersObj[lastPropName];
            return [
                [parseFloat(first.lat), parseFloat(first.lng)],
                [parseFloat(last.lat), parseFloat(last.lng)]
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

        // function startAddingMarkers(LocationListData){
        //     setBoundsToMap();
        //     if($scope.count<LocationListData.length){
        //         var markerName = "m"+($scope.count+1);
        //         $scope.leafletObj.markers[markerName] = LeafletService.prepareMarketObl(LocationListData[$scope.count]);
        //     }else{
        //         $interval.cancel(startTheTrip);
        //     }
        //     console.log("Markers set: " + $scope.count + "/" + LocationListData.length);
        //     $scope.count++;
        // }

        // function _calculateSpeedIntervals(LocationListData){
        //     var speeds = [];
        //     for(var i=0; i<LocationListData.length; i++){
        //         var next = i+1;
        //         if(next<LocationListData.length){
        //             var dt = getTimeInterval(LocationListData[next].TIMESTAMP, "minutes") - getTimeInterval(LocationListData[i].TIMESTAMP, "minutes");
        //             var dlat = parseFloat(LocationListData[next].LAT) - parseFloat(LocationListData[i].LAT);
        //             var s = parseFloat(dlat/dt);
        //             speeds.push(s);
        //         }
        //     }
        //     return speeds;
        // }
        //
        // function _getTimeInterval(timeString, timeIntervalCase){
        //     var seconds = 1000;
        //     var minutes = seconds * 60;
        //     var hours = minutes * 60;
        //     var days = hours * 24;
        //     var time = new Date(timeString);
        //
        //     switch(timeIntervalCase){
        //         case 'seconds':
        //             return Math.round((time.getTime())/seconds);
        //             break;
        //         case 'minutes':
        //             return Math.round((time.getTime())/minutes);
        //             break;
        //         case 'hours':
        //             return Math.round((time.getTime())/hours);
        //             break;
        //         case 'days':
        //             return Math.round((time.getTime())/days);
        //             break;
        //     }
        // }
    }
})();
