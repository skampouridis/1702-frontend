(function () {
    "use strict";
    angular.module('MTTrackingApi').factory('LeafletService',LeafletService);
    LeafletService.$inject= ['leafletBoundsHelpers'];

    function LeafletService(leafletBoundsHelpers) {
		// TODO
        var services = {
            prepareMarketObl                : _prepareMarketObl,
            setMapCenter                    : _setMapCenter,
            createMapMarkersList            : _createMapMarkersList,
            createPathList                  : _createPathList,
            setMapBounds                    : _setMapBounds,
            setMapBoundsFromMarkerObj       : _setMapBoundsFromMarkerObj,
            getTime                         : _getTime,
            calcTimeInterval                : _calcTimeInterval,
            setBoundsBetweenExistingMarkers : _setBoundsBetweenExistingMarkers,
            setBoundsToMap                  : _setBoundsToMap
        };

        return services;

        // prepare marker object and add it to directive attribute
        function _prepareMarketObl(currentLocationData){
            var utcDateString = _utcDateFn(currentLocationData.TIMESTAMP);
            var tooltip = currentLocationData.SPEED+ "Speed / "+
                currentLocationData.COURSE + "&#176;" + " | " +
                utcDateString;
            return {
                lat: parseFloat(currentLocationData.LAT),
                lng: parseFloat(currentLocationData.LON),
                message: tooltip,
                // group: currentLocationData.MMSI,
                layer: "trip",
                iconAngle:parseFloat(currentLocationData.HEADING),
                icon:{
                    // iconUrl: 'images/Ship-icon.png',
                    iconUrl: 'images/triangle-arrow.png',
                    iconSize:     [28, 28], // size of the icon
                    iconAnchor:   [15, 20], // point of the icon which will correspond to marker's location
                    popupAnchor:  [5, 0] // point from which the popup should open relative to the iconAnchor
                    // shadowUrl: 'img/leaf-shadow.png',
                    // shadowSize:   [50, 64], // size of the shadow
                    // shadowAnchor: [4, 62],  // the same for the shadow
                }
            };
        }

        function _utcDateFn(dateString){
            var date = new Date(dateString);
            var result = date.getUTCFullYear()+"-"+_addZero(date.getUTCMonth())+"-"+_addZero(date.getUTCDate())+ " "+
                _addZero(date.getUTCHours())+":"+_addZero(date.getUTCMinutes())+ " UTC";
            return result;
        }

        function _addZero(datePart){
            var s = datePart.toString();
            if (s.length === 1) {
                return "0" + s;
            }
            return s;
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

        function _getTime(timeString, timeCase){
            var seconds = 1000;
            var minutes = seconds * 60;
            var hours = minutes * 60;
            var days = hours * 24;
            var time = new Date(timeString);

            switch(timeCase){
                case 'seconds':
                    return Math.round((time.getTime())/seconds);
                    break;
                case 'minutes':
                    return Math.round((time.getTime())/minutes);
                    break;
                case 'hours':
                    return Math.round((time.getTime())/hours);
                    break;
                case 'days':
                    return Math.round((time.getTime())/days);
                    break;
            }
        }

        function _calcTimeInterval(nextLocation, currentLocation, timeCase){
            var dt = _getTime(nextLocation.TIMESTAMP, timeCase) - _getTime(currentLocation.TIMESTAMP, timeCase);
            return parseFloat(dt);
        }

        function _setBoundsBetweenExistingMarkers(markersList){
            var boundsArray = _setMapBoundsFromMarkerObj(markersList);
            var r = leafletBoundsHelpers.createBoundsFromArray(boundsArray);
            return r;
        }

        function _setBoundsToMap(dataList){
            var boundsArray = _setMapBounds(dataList);
            var r = leafletBoundsHelpers.createBoundsFromArray(boundsArray);
            return r;
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

    }
})();
