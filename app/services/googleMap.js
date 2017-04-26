/**
 * Created by christos on 2/5/2016.
 */
function initialize() {
    var myCenter= new google.maps.LatLng(37.9729553,23.7697136);
    var mapProp = {
        center:myCenter,
        zoom:15,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("addressGoogleMap"),mapProp);
    var marker=new google.maps.Marker({
        position:myCenter
    });

    marker.setMap(map);
}
google.maps.event.addDomListener(window, 'load', initialize);