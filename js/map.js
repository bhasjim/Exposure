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
}
var markers = [];
var params = {
        format: "json",
        apiKey: "4cd3d05ce08d3d4fa414116b3e3c247e"
      }


//add listener and loop through tags to add to url
$('#tagsearch').on('itemAdded', function(event) {
  // event.item: contains the item
  //push tag to array of tags
  apiParams.tags.push(event.item);
  deleteMarkers();  // clears map
  if (markerClusterer) {    // clears clusters
    markerClusterer.clearMarkers();
  }
  if(map){
    getPhotoData(map.getBounds());
  }

  $( document ).ready(function() {
    $('#tagsearch').attr('placeholder','WHAT');
    console.log($('#tagsearch').attr('placeholder'));
  });

});



$('#tagsearch').on('itemRemoved', function(event) {
  // event.item: contains the item
  //remove tag from array of tags
  //get index of the item and remove it
  var index = apiParams.tags.indexOf(event.item);
  if (index > -1) {
    apiParams.tags.splice(index, 1);
  }
  //refresh the map
  deleteMarkers();  // clears map
  if (markerClusterer) {    // clears clusters
    markerClusterer.clearMarkers();
  }
  if(map){
    getPhotoData(map.getBounds());
  }
});

$(".dropdown-menu li a").click(function(){
  $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents(".dropdown").find('.btn').val($(this).data('value'));

  answer= $(this).data('value');
  console.log(answer);

  if (which_date != answer) {
    //refresh the map
    deleteMarkers();  // clears map
    if (markerClusterer) {    // clears clusters
      markerClusterer.clearMarkers();
    }
    if(map){
      getPhotoData(map.getBounds());
    }
  }
});

var getTS = function() {
        var ts = Math.round((new Date()).getTime() / 1000);
        // var answer= '';
        // answer= $('.dropwdown-menu li a').data('value');

        console.log("TS" + answer)
        which_date = answer;

        if (answer === "year") return (ts - 31536000).toString();
        if (answer === "week") return (ts - 604800).toString();
        if (answer === "day") return (ts - 86400).toString();
        return "0";
      }


var getPhotoData = function(bounds) {
      console.log(bounds.getSouthWest().toString());

      var bbox = bounds.toJSON();
      var bboxString = bounds.toString().replace(/\(/g,"");
      var bboxString = bounds.getSouthWest().lng().toString() + "," + bounds.getSouthWest().lat().toString() + "," + bounds.getNorthEast().lng().toString() + "," + bounds.getNorthEast().lat().toString();
      var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search"+
      "&api_key=" + apiParams.key +
      "&bbox=" + bboxString +
      "&tags="+ apiParams.tags +
      "&min_upload_date=" +  getTS() +
      "&sort=interestingness-desc&has_geo=1&extras=geo&format=json&jsoncallback=?";
      console.log(url);
      $.getJSON(url, params, function(data) {
        addMarkers(data.photos);
      });
    };


function initMap() {
  var image = new google.maps.MarkerImage(
              './../images/bluedot_retina.png',
              null, // size
              null, // origin
              new google.maps.Point( 0, 0 ), // anchor (move to center of marker)
              new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
            );

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
        styles: [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "weight": "0.5"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text",
        "stylers": [
            {
                "lightness": "-50"
            },
            {
                "saturation": "-50"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text",
        "stylers": [
            {
                "hue": "#009aff"
            },
            {
                "saturation": "25"
            },
            {
                "lightness": "0"
            },
            {
                "visibility": "simplified"
            },
            {
                "gamma": "1"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": "0"
            },
            {
                "lightness": "100"
            },
            {
                "gamma": "2.31"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "lightness": "20"
            },
            {
                "gamma": "1"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": "-100"
            },
            {
                "lightness": "-100"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": "0"
            },
            {
                "saturation": "45"
            },
            {
                "gamma": "4.24"
            },
            {
                "visibility": "simplified"
            },
            {
                "hue": "#00ff90"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": "-100"
            },
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#666666"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.icon",
        "stylers": [
            {
                "saturation": "-25"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "50"
            },
            {
                "gamma": ".75"
            },
            {
                "saturation": "100"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

      });

      errorWindow = new google.maps.InfoWindow;

                // then create the new marker
      var locMarker = new google.maps.Marker({
        flat: true,
        icon: image,
        map: map,
        optimized: false,
        position: pos,
        title: 'I might be here',
        visible: true
      });





      map.addListener('idle', function(e) {
        deleteMarkers();  // clears map
        if (markerClusterer) {    // clears clusters
          markerClusterer.clearMarkers();
        }
        getPhotoData(map.getBounds());

      });
      infoWindow = new google.maps.InfoWindow({disableAutoPan : true});



      var clusterStyles = [
        {
            textColor: 'white',
            textSize:1,
            url: './../images/m1.png',
            height: 29,
            width: 30
        },
        {
            textColor: 'white',
            textSize:1,
            url: './../images/m2.png',
            height: 42,
            width: 43
        },
        {
            textColor: 'white',
            textSize:1,
            url: './../images/m3.png',
            height: 57,
            width: 56
        },
        {
            textColor: 'white',
            textSize:1,
            url: './../images/m4.png',
            height: 69,
            width: 68
        },
        {
            textColor: 'white',
            textSize:1,
            url: './../images/m5.png',
            height: 80,
            width: 79
        }
    ];

      var mcOptions = {
          gridSize: 20,
          styles: clusterStyles,
          minimumClusterSize:1,
          maxZoom: 20
      };

      markerClusterer = new MarkerClusterer(map, markers, mcOptions)
      console.log(markerClusterer.getGridSize());
      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);


      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });


      google.maps.event.addListener(markerClusterer, 'clusterclick', function(cluster) {
          var center = cluster.getCenter();
          var lat = center.lat();
          var lng = center.lng()
          $('#photoModal').modal('show');
          $('#main-pic-header').empty()
          $('#main-pic').empty();
          $('#gallery-pic').empty();
          $('.pic-rotate').hide();

          var base = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
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
    })
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
    setInfoWindowContent(marker, imgHTML, results, photo)
  });
  markerClusterer.addMarkers(markers);
};

var setInfoWindowContent = function(marker, content,results, photo) {
  google.maps.event.addListener(marker, 'click', function() {
    //infoWindow.setContent(content);
    $('#main-pic-header').empty()
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

function nearbyPictures(lat, lon){
  rad = (40-map.zoom) * 0.001;
  const mbbox = (lon - rad) + "," + (lat - rad) + "," + (lon + rad) + "," + (lat + 0.0005)
  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" +
        apiParams.key +
        "&bbox=" + mbbox +
        "&tags="+ apiParams.tags +
        "&min_upload_date" + getTS() +
        "&sort=interestingness-desc&has_geo=1&extras=geo&format=json&jsoncallback=?";
  $.getJSON(url, params, function(data) {
    if (data.photos.photo.length > 1) {
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

$(document).on('click', '.grid-pic',function(){
  $('#main-pic-header').empty();
  $('#main-pic').empty();
  $('#main-pic-header').append($(this).data('title'));
  source = $(this)[0].src;
  curr_ind = $(this)[0].dataset.ind;
  console.log(curr_ind);
  source = source.substring(0, source.length - 6)
  $('#main-pic').append("<img data-ind='"  + curr_ind + "' src='" + source + "_z.jpg' />");
  $('.pic-rotate').show();
  $('#photoModal').scrollTop(0);
});

$('.pic-rotate').on('click', function(){
  if( !$('#main-pic').is(':empty') ){
    curr_ind = $('#main-pic').children().data('ind');
    if (curr_ind == 0 || curr_ind == (nearbyPics.length -1)){
      return;
    }
    if ($(this).hasClass("glyphicon-chevron-left")){
    //console.log("left");
      changePic(curr_ind-1);
    }
    else if($(this).hasClass("glyphicon-chevron-right")){
      // console.log("right");
      changePic(curr_ind+1);
      
    }
    $('#photoModal').scrollTop(0);

  }

});

$(document).on('keydown',function(e){
  if( !$('#main-pic').is(':empty') && $('#photoModal').hasClass('in')){
    curr_ind = $('#main-pic').children().data('ind');
    console.log(curr_ind);


    switch(e.which){
      case 37:
        if (curr_ind == 0){
          return
        }

        changePic(curr_ind-1);
        
        break;
      case 39:
        if(curr_ind == (nearbyPics.length -1)){
          return
        }
        changePic(curr_ind+1);
        break;
    }
  }
  
})


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


$(document).ready(function() {
  initMap();
});

