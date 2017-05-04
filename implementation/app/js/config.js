var config = {
  backendUrl: 'http://services.marinetraffic.com/api',
  apiKey : '3ff05956b0fd72b18a40e69b96c9f4423163490f'
};

/*

I will be using this function in order to map
the vessel speed that I am taking from the API
(which is is knots x 10) to a number between 1
and 10. The reason for this is because, to adjust
the speed of the animation, I am skipping waypoints.
So, with the speed factor, I am jumping indices.

*/

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
