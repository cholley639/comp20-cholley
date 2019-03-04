//initializing map
//Javascript for index.html in Assignment 2 comp20
var weinerbool = false;
var weinerLat = 0;
var weinerLng = 0;
var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(42.4037887, 71.1142046);

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
        initMap();
        });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }
}

function initMap() {

    me = new google.maps.LatLng(myLat, myLng);
    // Update map and go there...
    map.panTo(me);

    // Create a marker
    marker = new google.maps.Marker({
        position: me,
        title: "Here I Am!"
    });
    marker.setMap(map);
  
    // Open info window on click of marker
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.title);
        infowindow.open(map, marker);
    });
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

            var new_window = new google.maps.InfoWindow();

            // Open info window on click of marker
            google.maps.event.addListener(new_marker, 'click', function() {
            new_window.setContent(this.title);
            new_window.open(map, this);
            });

        }
    }
    else{
        console.log("nah");

    }
}

function weiner(curr_passenger) {
    weinerbool = true;
    var weiner_icon = {
        url: "Weinermobile.png",
        size: new google.maps.Size(26, 26)
    };

    var weiner_pos = new google.maps.LatLng(curr_passenger["lat"], curr_passenger["lng"]);
    var new_marker = new google.maps.Marker({
    position: weiner_pos,
    title: "username: Weinermobile | distance: " + distance(weiner_pos)+" mi",
    icon: weiner_icon,
    map: map
    });

    var new_window = new google.maps.InfoWindow();

    // Open info window on click of marker
    google.maps.event.addListener(new_marker, 'click', function() {
    new_window.setContent(this.title);
    new_window.open(map, this);
    });
}
    
function distance(weiner_pos) {
    var dist;
    dist = google.maps.geometry.spherical.computeDistanceBetween(weiner_pos, me);
    dist = Number((dist).toFixed(3));
    return dist;
}