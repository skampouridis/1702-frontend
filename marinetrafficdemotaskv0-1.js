/*
MARINETRAFFIC DEMO TASK
v0.1

(c)20170411 MICHAIL TZIOTIS
DRAFT version
Known Bugs
Limited Documentation
Limited Comments
 */

function stepSelectVessel() {
	/*
	SELECT A VESSEL
	 */

	$('#mainMenuTitle').html("Vessel Selection");

	$('#selectVesselPanel').show();

	//   7 digits=IMO --- 9 digits=MMSI
	$('#selectVesselCode').on('input propertychange', function () {
		$(this).val($(this).val().replace(/[^\d]+/g, ''));

	});

	$('#visualizeButton').click(function () {

		// Construct VesselID
		if ($('#selectVesselCode').val().length == 7) {

			vesselID = {
				"type": "imo",
				"code": $('#selectVesselCode').val()
			};
		} else if ($('#selectVesselCode').val().length == 9) {

			vesselID = {
				"type": "mmsi",
				"code": $('#selectVesselCode').val()
			};

		} else {
			alert("IMO must be a 7-digit code, and MMSI a 9-digit one!\nPlease check your input!");
		}

		if (vesselID) {

			$('#mainMenuTitle').html("Selected Ship:&nbsp&nbsp&nbsp<strong>" + vesselID.type + "= " + vesselID.code + '</strong>');

			$('#selectVesselPanel').hide();

			stepSelectDataPeriod();

		}

	});

};

function stepSelectDataPeriod() {
	/*
	Select a time period of latest 190 days for AIS data.
	 */

	$('#selectDataPeriodPanel').show();

	var latestDataTimestamp = Date.now();
	var earliestDataTimestamp = latestDataTimestamp - 16416000000 // 190*24*60*60*1000 ms;

		// Max Duration = 7 days, min= 5 hours.
		$("#rangeSliderDataPeriod").dateRangeSlider({
			arrows: false,
			range: {
				min: {
					hours: 5
				},
				max: {
					days: 7
				}
			},
			formatter: function (val) {

				var hours = val.getHours(),
				mins = val.getMinutes(),
				days = val.getDate(),
				month = val.getMonth() + 1,
				year = val.getFullYear();
				return ("0" + hours).slice(-2) + ":" + ("0" + mins).slice(-2) + " " + days + "/" + month + "/" + year;
			},

			bounds: {
				min: earliestDataTimestamp,
				max: latestDataTimestamp
			},
			//default=last seven days.
			defaultValues: {
				min: latestDataTimestamp - 604800000, //DEV 604800000= 7*24*60*60*1000
				max: latestDataTimestamp
			}

		});

	$('#selectDataPeriodButton').click(function () {

		startSelectedDataTimestamp = $("#rangeSliderDataPeriod").dateRangeSlider("min");
		endSelectedDataTimestamp = $("#rangeSliderDataPeriod").dateRangeSlider("max");

		$('#selectDataPeriodPanel').hide();

		getTrackData();

	});

};

function getTrackData() {

	$.getJSON("http://services.marinetraffic.com/api/exportvesseltrack/3ff05956b0fd72b18a40e69b96c9f4423163490f/", {
		"fromdate": ((startSelectedDataTimestamp).toISOString()).slice(1, 19) + "Z",
		"todate": ((endSelectedDataTimestamp).toISOString()).slice(1, 19) + "Z",
		[vesselID.type]: [vesselID.code],
		"protocol": "json"
	}, function (result, status) {

		aisTrackData = result;
		startTrackTimeStamp = new Date(aisTrackData[0][7]);
		endTrackTimeStamp = new Date(aisTrackData[aisTrackData.length - 1][7]);

		createTrack();

	});

};

// DEV - READ FROM SAMPLE DATA FILE
// Change this part of code for local data loading.
/*
getTrackData = function (vesselID) {
aisTrackData = result;
startTimeStamp = new Date(aisTrackData[0][7]);
endTimeStamp = new Date(aisTrackData[aisTrackData.length - 1][7]);
selectedStartTimeStamp = startTimeStamp;
selectedEndTimeStamp = endTimeStamp;
createTrack();
};
// END OF DEV
 */

createTrack = function () {

	trackWaypoints_src = {
		"type": "geojson",
		"tolerance": 0.01,
		"maxzoom": 22,
		"data": {
			"type": "FeatureCollection",
			"features": []
		}

	};

	trackLine_src = {
		"type": "geojson",
		"tolerance": 1,
		"data": {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "LineString",
				"coordinates": []
			}
		}
	};

	//For each item create a feature.
	aisTrackData.forEach(function (item, index) {
		var nodeCoordinates = new Array(parseFloat(item[3]), parseFloat(item[4]));

		trackLine_src.data.geometry.coordinates.push(nodeCoordinates);

		var feature = new Object();

		feature = {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [parseFloat(item[3]), parseFloat(item[4])]
			},
			"properties": {
				"icon": "triangle-11",
				"aisHeading": parseInt(item[6]),
				"aisSpeed": parseInt(item[2]) / 10,
				"aisCourse": parseInt(item[5]),
				"aisTimestamp": new Date(item[7] + "Z")

			}

		};

		trackWaypoints_src.data.features.push(feature);

	});

	// Special icons for the start and last points.
	trackWaypoints_src.data.features[0].properties.icon = "circle-15";
	trackWaypoints_src.data.features[trackWaypoints_src.data.features.length - 1].properties.icon = "circle-15";

	// The original data set is not needed anymore.
	delete aisTrackData;

	// Add the 2 objects as sources for the map.
	map.addSource('trackWaypointsSource', trackWaypoints_src);
	map.addSource('trackLineSource', trackLine_src);

	//Create the layer with the waypoint.
	trackWaypointsLayer = {

		"id": "trackWaypointsLayer",
		"type": "symbol",
		"interactive": true,
		'source': 'trackWaypointsSource',
		"layout": {
			'symbol-placement': 'point',
			"icon-image": "{icon}",
			"icon-rotate": {
				"type": "identity",
				"property": "heading"
			}
		},
		"paint": {
			"icon-opacity": 0.7,
			"icon-color": "#00ffff"

		}

	};

	// Create the layer of the track line.
	trackLineLayer = {
		"id": "trackLineLayer",
		"type": "line",
		'source': 'trackLineSource',
		"layout": {
			"line-join": "round",
			"line-cap": "round"
		},
		"paint": {
			"line-color": "#66cdaa",
			"line-opacity": 0.8,
			"line-width": 7
		}
	};

	// Add the layers to the map.
	map.addLayer(trackLineLayer);
	map.addLayer(trackWaypointsLayer);

	// Pan & zoom the map to display the whole track line.
	var bbox = turf.bbox(trackLine_src.data);

	map.fitBounds(bbox, {
		padding: 50
	});

	// Create a popup for the waypoints, but don't add it to the map yet.
	var popupWaypoint = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

	// Display a popup with some info about each waypoint when the mouse hovers.
	map.on('mousemove', function (e) {
		var features = map.queryRenderedFeatures(e.point, {
				layers: ['trackWaypointsLayer']
			});
		// Change the cursor style as a UI indicator.
		map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

		if (!features.length) {
			popupWaypoint.remove();
			return;
		}

		var feature = features[0];

		// Populate the popup and set its coordinates
		// based on the feature found.
		popupWaypoint.setLngLat(feature.geometry.coordinates)
		.setHTML('<table><tr><td>Speed:</td><td>' + (feature.properties.aisSpeed).toFixed(1) + ' kn</td></tr><tr><td>Course:</td><td>' + feature.properties.aisCourse + ' °</td></tr><tr><td>Time:</td><td>' + (new Date(feature.properties.aisTimestamp)).toUTCString() + '</td></tr></table>')
		.addTo(map);
	});

	$('#selectDataPeriodPanel').hide();
	displayAnimation();

};

function displayAnimation() {
	/*
	Prepare the animation1.
	 */

	$('#animateShipPanel').show();

	$('#sliderAnimation').slider();
	$('#sliderTimeScale').slider();

	nrOfAnimationPoints = trackWaypoints_src.data.features.length;
	startAnimationTimestamp = new Date(trackWaypoints_src.data.features[0].properties.aisTimestamp);
	endAnimationTimestamp = new Date(trackWaypoints_src.data.features[nrOfAnimationPoints - 1].properties.aisTimestamp);

	// This is used as the main timer. It regards the real time of the data in the past.
	virtualTime = startAnimationTimestamp;

	refreshTimeIndicator(virtualTime);

	//Create the symbol of the ship as a point.
	pointShipAnimated = {
		"type": "Point",
		"coordinates": trackWaypoints_src.data.features[0].geometry.coordinates,
		properties: {}
	};

	//Create a popup for the current AIS Info during the animation.
	popupShipData = new mapboxgl.Popup({
			offset: 50,
			closeButton: false,
			closeOnClick: false
		})
		.setLngLat(trackWaypoints_src.data.features[0].geometry.coordinates)
		.addTo(map);

	map.addSource('shipSymbolSource', {
		type: 'geojson',
		data: pointShipAnimated
	});

	map.addLayer({
		"id": "shipSymbolLayer",
		"type": "symbol",
		"source": "shipSymbolSource",
		"layout": {
			"icon-image": "marker-15",
			"icon-size": 2,
			"icon-rotation-alignment": "map",
			"icon-allow-overlap": true
		}
	});

	virtualTime = startAnimationTimestamp.getTime();
	animationPlaying = false
		followShip = false; // when true, the map pans to display the ship at the center of the window. UI contains switch.
	autoRotateMap = false; // when true, the map rotates according toy the current heading of the ship during the animation. UI contains switch.
	dynamicZoom = false; // when true, the zoom changes according to the speed of the ship. UI contains switch.


	// UI switch to show/hide the AIS waypoints and the related line.
	$("#displayHideTrack").click(function () {
		switch ($("#displayHideTrack").is(':checked')) {
		case true:
			map.setLayoutProperty('trackLineLayer', 'visibility', 'visible');
			map.setLayoutProperty('trackWaypointsLayer', 'visibility', 'visible');
			break;
		case false:
			map.setLayoutProperty('trackWaypointsLayer', 'visibility', 'none');
			map.setLayoutProperty('trackLineLayer', 'visibility', 'none');
		};

	});

	// UI to have the ship always at the center of the window.
	$("#followShip").click(function () {
		switch ($("#followShip").is(':checked')) {
		case true:
			followShip = true;
			break;
		case false:
			followShip = false;
		};

	});

	// UI to have the map rotated according to the ship hesding.
	$("#autoRotateMap").click(function () {
		switch ($("#autoRotateMap").is(':checked')) {
		case true:
			autoRotateMap = true;
			break;
		case false:
			autoRotateMap = false;
		};

	});

	// UI to have the zoom changing according to the speed of the ship.
	$("#dynamicZoom").click(function () {
		switch ($("#dynamicZoom").is(':checked')) {
		case true:
			dynamicZoom = true;
			break;
		case false:
			dynamicZoom = false;
		};

	});

	// Target Frame Rate.
	animFrameRate = 15;

	// This list contains some fixed Multipliers for the animation playback speed.
	timeScalesList = [0.25, 0.5, 1, 30, 60, 200, 500, 1000]

	// The slider selects a multiplier from the list.
	$("#sliderTimeScale").slider("option", "min", 0);
	$("#sliderTimeScale").slider("option", "max", timeScalesList.length - 1);
	$("#sliderTimeScale").slider("option", "step", 1);
	$("#sliderTimeScale").slider("value", 3);

	animTimeScale = timeScalesList[$("#sliderTimeScale").slider("value")];
	$('#timeScaleIndicator').html(animTimeScale + "x");

	$("#sliderTimeScale").on("slide", function (event, uiTimeScale) {
		if (animationPlaying) {
			stopAnimation();
		};
		animTimeScale = timeScalesList[uiTimeScale.value];
		$('#timeScaleIndicator').html(animTimeScale + "x");
		if (animationPlaying) {
			playAnimation(virtualTime);
		};
	});

	// The slider which controls the time position of the animation.
	$("#sliderAnimation").slider("option", "min", (startAnimationTimestamp).getTime());
	$("#sliderAnimation").slider("option", "max", (endAnimationTimestamp).getTime());
	$("#sliderAnimation").slider("value", virtualTime);

	$("#sliderAnimation").on("slide", function (event, uiAnimation) {
		virtualTime = uiAnimation.value;
		refreshTimeIndicator(virtualTime);
		getAnimNewFrame(virtualTime, -1);
	});

	// The UI button to start & pause the animation.
	$('#playPauseAnim').click(function () {

		animationPlaying = !(animationPlaying);
		if (animationPlaying == true) {
			$('#playPauseAnim').text("PAUSE");
			virtualTime = $("#sliderAnimation").slider("value");
			refreshTimeIndicator(virtualTime);
			playAnimation(virtualTime);

		} else {
			$('#playPauseAnim').text("PLAY");
			stopAnimation();
		}

	});

};

//Refresh the animation time on the screen.
function refreshTimeIndicator(timepoint) {
	$('#timeIndicator').html((new Date(timepoint)).toUTCString());
}

// This is called by the animation controller and manages the frames,
function animateShip(timepoint, prevWaypointIndex) {

	// Get a new animation frame.
	// The function returns the previous waypoint, which is the first point of the current track segment.
	var prevWaypointIndex = getAnimNewFrame(timepoint, prevWaypointIndex);

	// Refresh the time slider.
	$("#sliderAnimation").slider("value", timepoint);
	refreshTimeIndicator(timepoint);

	// Stops the animation at the end of the data.
	if (prevWaypointIndex == trackWaypoints_src.data.features.length) {
		stopAnimation();
	}

	return prevWaypointIndex;
};

// Create a new animation frame.
// This function can be called directly, thus it provides a complete frame when the slider moves.
function getAnimNewFrame(timepoint, prevWaypointIndex) {

	// Check if the time is equal or greater than the time of the next waypoint, and if true, change segment.
	if (timepoint >= (trackWaypoints_src.data.features[prevWaypointIndex + 1].properties.aisTimestamp).getTime()) {

		// Find the first waypoint of the next segment.
		prevWaypointIndex = getPrevWaypointIndex(timepoint);

		// Calculate the values which are constant in the segment (eg acceletations),
		factors = getFactors(prevWaypointIndex);

		prevWaypoint = trackWaypoints_src.data.features[prevWaypointIndex];

		// This object contains the data about the first point of the segment.
		segmentStartData = {
			coordinates: [prevWaypoint.geometry.coordinates[0], prevWaypoint.geometry.coordinates[1]],
			aisSpeed: prevWaypoint.properties.aisSpeed,
			aisHeading: prevWaypoint.properties.aisHeading
		}

	};

	// segmentTime is the time difference between the current animation time and the timestamp of the segment.
	var segmentTime = (timepoint - trackWaypoints_src.data.features[prevWaypointIndex].properties.aisTimestamp)

	// Calculate the ship track data for the intermediate position.
	var virtualData = getVirtualData(segmentTime, factors, segmentStartData);

	//Refresh the  map.
	setPointShipAnimated(virtualData);

	// The first point of the segment is given back, to avoid a new search according to the time.
	return prevWaypointIndex;
};

// Get the first waypoint of the segment, according to the current animation time and the timestamps,
function getPrevWaypointIndex(timepoint) {

	function checkTimestamp(timepointsearch) {
		return timepoint < (timepointsearch.properties.aisTimestamp).getTime();
	};

	return (trackWaypoints_src.data.features).findIndex(checkTimestamp) - 1;
}

// Calculate the factors (eg accelerations) which are constant in the segment, and can be used to calculate the intermediate positions.
// One calculation per segment limits the CPU load.

function getFactors(prevWaypointIndex) {

	var prevWaypoint = trackWaypoints_src.data.features[prevWaypointIndex];
	var nextWaypoint = trackWaypoints_src.data.features[prevWaypointIndex + 1];

	var prevWaypointLon = prevWaypoint.geometry.coordinates[0];
	var nextWaypointLon = nextWaypoint.geometry.coordinates[0];

	var prevWaypointLat = prevWaypoint.geometry.coordinates[1];
	var nextWaypointLat = nextWaypoint.geometry.coordinates[1];

	// The time difference between the two points of the segment.
	var deltaTime = (nextWaypoint.properties.aisTimestamp - prevWaypoint.properties.aisTimestamp);
	var deltaLon = nextWaypointLon - prevWaypointLon;
	var deltaLat = nextWaypointLat - prevWaypointLat;
	var prevWaypointAisSpeed = prevWaypoint.properties.aisSpeed;
	var nextWaypointAisSpeed = nextWaypoint.properties.aisSpeed;
	var prevWaypointAisHeading = prevWaypoint.properties.aisHeading;
	var nextWaypointAisHeading = nextWaypoint.properties.aisHeading;

	var deltaAisSpeed = nextWaypointAisSpeed - prevWaypointAisSpeed;

	// Calculate the 2 perpendicular vectors of the AIS speed.
	var calculatedBearing = azimuth(prevWaypointLon, prevWaypointLat, nextWaypointLon, nextWaypointLat);

	var prevWaypointAisSpeedLon = prevWaypointAisSpeed * Math.sin(calculatedBearing * Math.PI / 180) * Math.cos(prevWaypointLat * Math.PI / 180) / 216000000;

	var prevWaypointAisSpeedLat = prevWaypointAisSpeed * Math.cos(calculatedBearing * Math.PI / 180) / 216000000;

	var accLon = 2 * (deltaLon - prevWaypointAisSpeedLon * deltaTime) / (deltaTime ** 2);
	var accLat = 2 * (deltaLat - prevWaypointAisSpeedLat * deltaTime) / (deltaTime ** 2);

	var accAisSpeed = (nextWaypoint.properties.aisSpeed - prevWaypoint.properties.aisSpeed) / deltaTime;

	// Find the speed and the direction of the rotation.
	switch (Math.abs(nextWaypointAisHeading - prevWaypointAisHeading) <= 180) {
	case true:
		var accAisHeading = (((nextWaypointAisHeading - prevWaypointAisHeading) >= 0) * (nextWaypointAisHeading - prevWaypointAisHeading) + ((nextWaypointAisHeading - prevWaypointAisHeading) < 0) * (+nextWaypointAisHeading - prevWaypointAisHeading)) / deltaTime;
		break;
	case false:
		var accAisHeading = ((((nextWaypointAisHeading - prevWaypointAisHeading) >= 0) * (-360) + ((nextWaypointAisHeading - prevWaypointAisHeading) < 0) * 360) + nextWaypointAisHeading - prevWaypointAisHeading) / deltaTime;
	};

	accAisHeading = accAisHeading % 360;

	return {
		"deltaTime": deltaTime,
		"accLon": accLon,
		"accLat": accLat,
		"v0Lon": prevWaypointAisSpeedLon,
		"v0Lat": prevWaypointAisSpeedLat,
		"accAisSpeed": accAisSpeed,
		"accAisHeading": accAisHeading
	};
};

// Calculates the Ship data at an intermediate position, between the 2 points of the segment.
function getVirtualData(segmentTime, factors, segmentStartData) {

	var virtualLon = segmentStartData.coordinates[0] + factors.v0Lon * segmentTime + 0.5 * factors.accLon * (segmentTime ** 2);
	var virtualLat = segmentStartData.coordinates[1] + factors.v0Lat * segmentTime + 0.5 * factors.accLat * (segmentTime ** 2);
	var virtualAisSpeed = segmentStartData.aisSpeed + factors.accAisSpeed * segmentTime;
	var virtualAisHeading = segmentStartData.aisHeading + factors.accAisHeading * segmentTime;

	return {
		"coordinates": [virtualLon, virtualLat],
		"aisSpeed": virtualAisSpeed,
		"aisHeading": virtualAisHeading
	};

};

// Refresh the ship symbol on the map.
function setPointShipAnimated(virtualData) {

	pointShipAnimated.coordinates = virtualData.coordinates;
	map.getSource('shipSymbolSource').setData(pointShipAnimated);

	map.setLayoutProperty('shipSymbolLayer', 'icon-rotate', virtualData.aisHeading);

	// Refresh the attached popup.
	popupShipData.setLngLat(virtualData.coordinates)
	.setHTML('<table><tr><td>Speed:</td><td>' + (virtualData.aisSpeed).toFixed(1) + ' kn</td></tr><tr><td>Heading:</td><td>' + (virtualData.aisHeading).toFixed(0) + ' °</td></tr></table>');

	// In case these modes have been selected by the user,
	if (dynamicZoom) {
		map.setZoom(20 * (1 - virtualData.aisSpeed / 50));
	}

	if (followShip && !autoRotateMap) {
		map.panTo([virtualData.coordinates[0], virtualData.coordinates[1]]);
	}

	if (autoRotateMap && !followShip) {
		map.rotateTo(virtualData.aisHeading);
	}

	if (followShip && autoRotateMap) {
		map.easeTo({
			center: [virtualData.coordinates[0], virtualData.coordinates[1]],
			bearing: virtualData.aisHeading
		});
	}

};

//Start the animation from the provided time.
function playAnimation(startTime) {
	prevWaypointIndex = -1;
	animation1 = new animationControl(animFrameRate, function (e) {
			virtualTime = (e.time) * animTimeScale + startTime;
			prevWaypointIndex = animateShip(virtualTime, prevWaypointIndex);
		});
	animation1.start(startTime);
};

// Stops the animation controller.
function stopAnimation() {
	animation1.pause();
};

// The animation controler.
// By using the requestAnimationFrame, the animation is smoother, and the CPU loaded is reduced.
function animationControl(fps, callback) {

	var delay = 1000 / fps,
	time = null,
	frame = -1,
	tref,
	zeroTime = null;

	function loop(timestamp) {
		if (time === null) {
			time = timestamp;
			zeroTime = time;
		};

		var seg = Math.floor((timestamp - time) / delay);
		if (seg > frame) {
			frame = seg;
			callback({
				time: timestamp - zeroTime,
				frame: frame
			})
		}
		tref = requestAnimationFrame(loop)
	}

	this.isPlaying = false;

	this.frameRate = function (newfps) {
		if (!arguments.length)
			return fps;
		fps = newfps;
		delay = 1000 / fps;
		frame = -1;
		time = null;
	};

	this.start = function () {
		if (!this.isPlaying) {
			this.isPlaying = true;
			tref = requestAnimationFrame(loop);
		}
	};

	this.pause = function () {
		if (this.isPlaying) {
			cancelAnimationFrame(tref);
			this.isPlaying = false;
			time = null;
			frame = -1;
		}
	};
};

// Calculate the azimuth of a vector, according to the coordinates of its 2 points.
function azimuth(lon1, lat1, lon2, lat2) {

	var dLon = (lon2 - lon1) * Math.PI / 180;
	var y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
	var x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) - Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
	var brng = (Math.atan2(y, x)) * 180 / Math.PI;
	return ((brng + 360) % 360);
};

// The start function.
// Creates the map, and continues to the main procedure when rthe map is ready.
$(function () {

	mapboxgl.accessToken = 'pk.eyJ1IjoibXR6aW90aXNudHVhIiwiYSI6IkpDSmJWZE0ifQ.Z0pg5e-1e5DLN-4nJKgm8A';

	map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mtziotisntua/cj13vktqp001m2rmdo8gbr5cp',
			zoom: 6,
			center: [23.7, 38.5]
		});

	map.on('load', function () {

		justAfterMapHasBeenLoaded();

	});

	function justAfterMapHasBeenLoaded() {

		map.addControl(new mapboxgl.NavigationControl());

		stepSelectVessel();
	};

});
