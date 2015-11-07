var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var locate;
var markers = [];
var info_for_markers = [];
var address_for_markers = [];
var waypts = [];
var map;
var place;
var address;
var directionsDisplay;
var directionsService;
var save_response;

function initMap() {
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService = new google.maps.DirectionsService;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 10.767523, lng: 106.706772},
    zoom: 13
  });
    directionsDisplay.setMap(map);
  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('pac-input'));

  var types = document.getElementById('type-selector');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    else {
        locate= place.geometry.location;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
      autocomplete.setTypes(types);
  } 

  setupClickListener('changetype-all', []);

    function click() {
        addMarker(locate); 
        marker.setVisible(false);
        infowindow.close();
        check_number();
    }
  document.getElementById('btn-add').onclick = click;
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    animation: google.maps.Animation.DROP,
    draggable: true,
    title: place.name,
    map: map
  });
  markers.push(marker);
  marker.addListener('click', toggleBounce);
  info_for_markers.push(place.name);
  address_for_markers.push(address);
  var infowin = new google.maps.InfoWindow();
  infowin.setContent('<div><strong>' + info_for_markers.pop() + '</strong><br>' + address_for_markers.pop());
  infowin.open(map, marker);
  console.log(marker.position.lat() +" "+marker.position.lng() );
    if(markers.length>1)   
    {
        waypts.push({ location });
    }
}

//
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

//Draw ways
function calculateAndDisplayRoute(directionsService, directionsDisplay, start, finish) {
  directionsService.route({
    origin: {lat: start.position.lat(), lng: start.position.lng()},  
    destination: {lat: finish.position.lat(), lng: finish.position.lng()},
    waypoints: waypts,
    // Note that Javascript allows us to access the constant
    // using square brackets and a string value as its
    // "property."
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
        console.log(response);
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  })
}

function check_number() {
    if(markers.length>1)
    {
        calculateAndDisplayRoute(directionsService, directionsDisplay, markers[0], markers[markers.length-1]);
    }
}


