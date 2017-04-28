# 1702-frontend

Your task is to present daily vessel tracks on a map and animate them.

Retrieve dataset from our API URL: http://services.marinetraffic.com/api/exportvesseltrack/3ff05956b0fd72b18a40e69b96c9f4423163490f
adding necessary extra parameters like MMSI and days.

Documentation on the API can be found here: https://www.marinetraffic.com/en/ais-api-services/documentation/api-service:ps01

The track should be presented both as
a line and
as waypoints, which present a tooltip with information like
   - vessel speed,
   - course and
   - timestamp.
Vary the waypoints rendered by zoom level so that the visible waypoints do not overlap.
Animation should take vessel speed, true heading and starting time variation in account.
The user must be able to control animation speed as well as select a point in time. Develop the application on
Javascript.

Utilizing suitable frameworks is advisable.

Stage your solution on a demo page, fork this repo and create a pull request that contains your implementation in a subfolder.



