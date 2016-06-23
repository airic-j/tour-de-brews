(function(module){

  rideDetailView = {};

  // Ride function method for turning rides json data into HTML
  Ride.prototype.detailToHtml = function() {
    // console.log('using handlebars');
    var rideDetailTemplate = $('#rideDetailTemplate').html();
    var compiledDetailTemplate = Handlebars.compile(rideDetailTemplate);
    var html = compiledDetailTemplate(this);
    return(html);
  };

  rideDetailView.appendRides = function(id) {
    // console.log('populate the rides by appending');
    // put each JSON element into the projects array after making it a Project object
    $('#rideDetails').empty();
    rideDetailToAppend = Ride.all[id-1];
    $('#rideDetails').append(rideDetailToAppend.detailToHtml());
  };

  rideDetailView.initMap = function() {
    console.log('initMap on rideDetailView called');
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('rideDetailMap'), {
      zoom: 9,
      center: {lat: +45.523, lng: -122.676}
    });
    directionsDisplay.setMap(map);

    // initialize the map!
    rideDetailView.calculateAndDisplayRoute(directionsService, directionsDisplay);
  }

  rideDetailView.calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
    waypointObject = JSON.parse(rideDetailToAppend.mapWaypoints);
    waypointValues = waypointObject.map(function(waypoint){
      return {
        // TODO get this place_id working
        location: waypoint.place_id,
        stopover: true
      }
    });
    console.log(waypointValues);

    directionsService.route({
      origin: {'placeId': rideDetailToAppend.mapStart},
      destination: {'placeId': rideDetailToAppend.mapEnd},
      travelMode: google.maps.TravelMode.BICYCLING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      waypoints: waypointValues,
      optimizeWaypoints: true
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        console.log(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


  rideDetailView.init = function(id) {
    // console.log('rendering rideview.preview');
    rideDetailView.appendRides(id);
    $('section').hide();
    $('#rideDetails').show();
    rideDetailView.initMap();
  };

  module.rideView = rideView;

})(window);
