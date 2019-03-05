//initializing map
//Javascript for index.html in Assignment 2 comp20
var weiner_bool = false;
var weiner_dist;
var closest_marker = 1000000;
var myLat = 0;
var myLng = 0;
var me;

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
        xmlrequests();
        });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }
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
                title: "username: "+curr_passenger["username"]+" | Distance: "+distance(pass)+" mi away from me",
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
        var vehicles = objects["vehicles"];
        for (i = 0; i < vehicles.length ; i++) {
            var vehicle = vehicles[i];
            //check Weinermobile
            if (vehicle["username"] == "WEINERMOBILE") {
                weiner(vehicle);
            }

            else {
                // Create a marker
                var vehicle_icon = {
                    url: "vehicle.png",
                    scaledSize: new google.maps.Size(15, 35)
                };

                var vehicle_pos = new google.maps.LatLng(vehicle["lat"], vehicle["lng"]);
                var new_marker = new google.maps.Marker({
                position: vehicle_pos,
                title: "username: "+vehicle["username"]+" | Distance: "+distance(vehicle_pos)+" mi away from me",
                icon: vehicle_icon,
                map: map
                });

                // Open info window on click of marker
                google.maps.event.addListener(new_marker, 'click', function() {
                infowindow.setContent(this.title);
                infowindow.open(map, this);
                });

                if (distance(vehicle_pos) < closest_marker) {
                    closest_marker = distance(vehicle_pos);
                }
            }
        }
        
    }

    updateMe();
}

function weiner(curr_passenger) {
    weiner_bool = true;

    var weiner_pos = new google.maps.LatLng(curr_passenger["lat"], curr_passenger["lng"]);

    weiner_dist = distance(weiner_pos);

    var new_marker = new google.maps.Marker({
        position: weiner_pos,
        title: "username: Weinermobile | Distance: " + weiner_dist+" mi away from me",
        icon: "Weinermobile.png",
        map: map
    });

    // Open info window on click of marker
    google.maps.event.addListener(new_marker, 'click', function() {
    infowindow.setContent(this.title);
    infowindow.open(map, this);
    });
}
    
function distance(pos) {
    var dist;
    dist = google.maps.geometry.spherical.computeDistanceBetween(pos, me);
    dist = dist/1609.344;
    dist = Number((dist).toFixed(3));
    return dist;
}

function updateMe() {
    // Create a marker
    var myicon = {
        url: "mymarker.png",
        scaledSize: new google.maps.Size(32, 32)
    };


    if (weiner_bool) {
        marker = new google.maps.Marker({
            position: me,
            title: "Nearest marker: "+closest_marker+" mi"+" | Weinermobile is "+weiner_dist+" miles away",
            icon: myicon
        });
    }
    else {
        marker = new google.maps.Marker({
            position: me,
            title: "Nearest marker: " + closest_marker +" mi" + " | The Weinermobile is nowhere to be seen",
            icon: myicon
        });
    }
    marker.setMap(map);
  
    // Open info window on click of marker
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.title);
        infowindow.open(map, marker);
    });

}