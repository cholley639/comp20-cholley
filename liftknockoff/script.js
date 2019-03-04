//initializing map
//Javascript for index.html in Assignment 2 comp20
var weiner_bool = false;
var weiner_dist;
var closest_marker = 1000000;
var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(0, 0);

var myOptions = {
    zoom: 13, // The larger the zoom number, the bigger the zoom
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var marker;
var infowindow = new google.maps.InfoWindow();

function init() {
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    getMyLocation();
}

function getMyLocation() {
    if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;

        me = new google.maps.LatLng(myLat, myLng);
        // Update map and go there...
        map.panTo(me);
        });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }
    xmlrequests();
}

//xml request
function xmlrequests() {

    var username = "Tkwu74WC";
    var param_string = "username=" + username +"&lat=" + myLat + "&lng=" + myLng;

    var request = new XMLHttpRequest();
    request.open("POST", "https://hans-moleman.herokuapp.com/rides", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            parse(request);
        }
    };
    request.send(param_string);
}

function parse(request) {
    objects = JSON.parse(request.responseText);
    console.log(objects);
    if ("passengers" in objects) {
        var passengers = objects["passengers"];
        for (i = 0; i < passengers.length ; i++) {
            var curr_passenger = passengers[i];
            //check Weinermobile
            if (curr_passenger["username"] == "WEINERMOBILE") {
                weiner(curr_passenger);
            }

            else {
                // Create a marker
                var passenger_icon = {
                    url: "passenger.png",
                    size: new google.maps.Size(26, 26)
                };

                var pass = new google.maps.LatLng(curr_passenger["lat"], curr_passenger["lng"]);
                var new_marker = new google.maps.Marker({
                position: pass,
                title: "Passenger!" + i,
                icon: passenger_icon,
                map: map
                });

                // Open info window on click of marker
                google.maps.event.addListener(new_marker, 'click', function() {
                infowindow.setContent(this.title);
                infowindow.open(map, this);
                });

                if (distance(pass) < closest_marker) {
                    closest_marker = distance(pass);
                }
            }
        }
    }
    else{
        console.log("nah");
    }

    updateMe();
}

function weiner(curr_passenger) {
    weiner_bool = true;

    var weiner_pos = new google.maps.LatLng(curr_passenger["lat"], curr_passenger["lng"]);
    var new_marker = new google.maps.Marker({
        position: weiner_pos,
        title: "username: Weinermobile | distance: " + distance(weiner_pos)+" mi",
        icon: "Weinermobile.png",
        map: map
    });

    // Open info window on click of marker
    google.maps.event.addListener(new_marker, 'click', function() {
    infowindow.setContent(this.title);
    infowindow.open(map, this);
    });
}
    
function distance(weiner_pos) {
    var dist;
    dist = google.maps.geometry.spherical.computeDistanceBetween(weiner_pos, me);
    dist = dist/1609.344;
    dist = Number((dist).toFixed(3));
    weiner_dist = dist;
    return dist;
}

function updateMe() {
    // Create a marker
    if (weiner_bool) {
        marker = new google.maps.Marker({
            position: me,
            title: "Nearest marker: "+closest_marker+" mi"+" | Weinermobile is "+weiner_dist+" miles away"
        });
    }
    else {
        marker = new google.maps.Marker({
            position: me,
            title: "Nearest marker: " + closest_marker +" mi" + " | The Weinermobile is nowhere to be seen"
        });
    }
    marker.setMap(map);
  
    // Open info window on click of marker
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.title);
        infowindow.open(map, marker);
    });

}