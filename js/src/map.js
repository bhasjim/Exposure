var imageUrl;
var image;
var infoWindow;
var markerClusterer = null;
var chicago = {lat: 41.85, lng: -87.65};
var map, errorWindow;
var nearbyPics = [];
var nearbyTitles = [];
var which_date = "ever";
var answer = "ever";


var apiParams = { //parameters for API calls
  "key": "65030e1f766ba9dccb6deb836165ca4a",
  "max_upload_date": "1493856000",
  "bbox": [-117.285576,32.805377,-117.185326,32.896597],
  "tags":[]
};

var markers = [];
var params = {
        format: "json",
        apiKey: "4cd3d05ce08d3d4fa414116b3e3c247e"
    };

/*
 * Get TimeStamp that we can pass in when we load data in getPhotoData
 */
var getTS = function() {
        var ts = Math.round((new Date()).getTime() / 1000);
        // var answer= '';
        // answer= $('.dropwdown-menu li a').data('value');

        console.log("TS" + answer);
        which_date = answer;

        if (answer === "year") return (ts - 31536000).toString();
        if (answer === "week") return (ts - 604800).toString();
        if (answer === "day") return (ts - 86400).toString();
        return "0";
    };


/*
 * Our main function
 * This makes the API call to flickr and gets the photos
 * based on our parameters
 */
var getPhotoData = function(bounds) {
      console.log(bounds.getSouthWest().toString());

      var bbox = bounds.toJSON();
      var bboxString = bounds.toString().replace(/\(/g,"");
      bboxString = bounds.getSouthWest().lng().toString() + "," + bounds.getSouthWest().lat().toString() + "," + bounds.getNorthEast().lng().toString() + "," + bounds.getNorthEast().lat().toString();
      var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search"+
      "&api_key=" + apiParams.key +
      "&bbox=" + bboxString +
      "&tags="+ apiParams.tags +
      "&min_upload_date=" +  getTS() +
      "&sort=interestingness-desc&has_geo=1&extras=geo&format=json&jsoncallback=?";
    //   console.log(url);
      $.getJSON(url, params, function(data) {
        addMarkers(data.photos);
      });
    };


/*
 * Initializes the map
 * Pretty much copy pasta from google maps api
 */
function initMap() {
  var image = new google.maps.MarkerImage(
              './../images/bluedot_retina.png',
              null, // size
              null, // origin
              new google.maps.Point( 0, 0 ), // anchor (move to center of marker)
              new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
            );

  //gets our location!
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 12,
        styles: googleMapOptions
      });

      errorWindow = new google.maps.InfoWindow();

      // create the marker of where we are!!
      var locMarker = new google.maps.Marker({
        flat: true,
        icon: image,
        map: map,
        optimized: false,
        position: pos,
        title: 'I might be here',
        visible: true
      });

      //refreshes the map everytime we move and then stop moving
      map.addListener('idle', function(e) {
        deleteMarkers();  // clears map
        if (markerClusterer) {    // clears clusters
          markerClusterer.clearMarkers();
        }
        getPhotoData(map.getBounds());

      });
      infoWindow = new google.maps.InfoWindow({disableAutoPan : true});


      // our marker clusters!
      var mcOptions = {
          gridSize: 20,
          styles: clusterStyles,
          minimumClusterSize:1,
          maxZoom: 20
      };
      markerClusterer = new MarkerClusterer(map, markers, mcOptions);


      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);


      // Sets the bounds once we have searched for a location
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      //if we click on the cluster we want to pop up the gallery view
      google.maps.event.addListener(markerClusterer, 'clusterclick', function(cluster) {
          var center = cluster.getCenter();
          var lat = center.lat();
          var lng = center.lng();
          $('#photoModal').modal('show');
          $('#main-pic-header').empty();
          $('#main-pic').empty();
          $('#gallery-pic').empty();
          $('.pic-rotate').hide();

          var base = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
          var query = base + lat.toString() + "," + lng.toString();
          $.getJSON(query, params, function(data) {
            if (data) {
              var title = data.results[2].formatted_address;
              $('#main-pic-header').append(title);
            }
            else {
              console.log("geocoding failed");
            }
          });
          //$('#main-pic').append(content);
          nearbyPictures(lat, lng);
      });


      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });

    }, function() {
      handleLocationError(true, errorWindow, map.getCenter());
  });
  } else {
    // Browser doesn't support Geolocation
      handleLocationError(false, errorWindow, map.getCenter());
  }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

var addMarkers = function(results) {
  var photoLocation, marker, imgHTML;
  $.each(results.photo, function(i, photo) {
    var photoMarker = new google.maps.MarkerImage('./../images/m1.png',
      null, // size
      null, // origin
      new google.maps.Point( 0, 0 ), // anchor (move to center of marker)
      new google.maps.Size( 20, 20 )); // scaled size (required for Retina display icon)
    imgHTML = "<img data-title='" + photo.title + "' src=" + 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg' + " alt=" + photo.title + "/>";
    photoLocation = new google.maps.LatLng(photo.latitude, photo.longitude);
    marker = new google.maps.Marker({icon:photoMarker,position: photoLocation,map:map});

    marker.addListener('click', function() {
      // $('#locationInfo').slideDown();
      $('#photoModal').modal('show');
    });
    markers.push(marker);
    setInfoWindowContent(marker, imgHTML, results, photo);
  });
  markerClusterer.addMarkers(markers);
};


var setInfoWindowContent = function(marker, content,results, photo) {
  google.maps.event.addListener(marker, 'click', function() {
    //infoWindow.setContent(content);
    $('#main-pic-header').empty();
    $('#main-pic').empty();
    $('#gallery-pic').empty();
    $('#main-pic-header').append(photo.title);
    $('#main-pic').append(content);
    console.log(photo);
    var lat = marker.internalPosition.lat();
    var lon = marker.internalPosition.lng();

    nearbyPictures(lat, lon);
    //infoWindow.open(map, marker);
  });
};

/*
 * Gets the pictures that are nearby our lat and longitude
 * Does this through the bbox from flickr api
 */
function nearbyPictures(lat, lon){
  rad = (40-map.zoom) * 0.00001;
  var mbbox = (lon - rad) + "," + (lat - rad) + "," + (lon + rad) + "," + (lat + 0.0005);
  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" +
        apiParams.key +
        "&bbox=" + mbbox +
        "&tags="+ apiParams.tags +
        "&min_upload_date" + getTS() +
        "&sort=interestingness-desc&has_geo=1&extras=geo&format=json&jsoncallback=?";
  $.getJSON(url, params, function(data) {
    //console.log(data.photos.photo.length);
    if (data.photos.photo.length > 0) {
      var photo_ind = 0;
      nearbyPics = [];
      nearbyTitles = [];
      $.each(data.photos.photo, function(i, photo) {
        src = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret;
        imgHTML = "<img class=\"grid-pic\" data-ind='"  + photo_ind + "' data-title='" + photo.title + "' src=" + 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg' + " alt=" + photo.title + "/>";
        $('#gallery-pic').append(imgHTML);
        nearbyPics.push(src);
        nearbyTitles.push(photo.title);
        photo_ind++;
      });
    }
  });

}


function changePic(index){
  $('#main-pic-header').empty();
  $('#main-pic').empty();
  $('#main-pic-header').append(nearbyTitles[index]);
  $('#main-pic').append("<img data-ind='"  + (index) + "' src='" + nearbyPics[index] + "_z.jpg' />");
}

var deleteMarkers = function() {
  for (i = 0; i < markers.length; i += 1) {
    markers[i].setMap(null);
  }
  markers = [];
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
