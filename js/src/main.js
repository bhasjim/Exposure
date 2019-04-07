$(document).ready(function() {
  initMap();
});

/*
 * Clears the loading screen
 */
$("#cs-loader").on('click', function(){
        document.body.style.backgroundColor = "white";
        var coverCircle = document.getElementById('circle');
        coverCircle.classList.add('shrink');

        var coverScreen = document.getElementById('cs-loader');
        coverScreen.parentNode.removeChild(coverScreen);

});


/*
 * When we search for a new tag, we will add it to our array of tags
 * And then refresh our markers.
 */
$('#tagsearch').on('itemAdded', function(event) {
  // event.item: contains the item
  // push tag to array of tags
  apiParams.tags.push(event.item);
  deleteMarkers();  // clears map
  if (markerClusterer) {    // clears clusters
    markerClusterer.clearMarkers();
  }
  if(map){
    getPhotoData(map.getBounds()); //reloads our photos with the tags
  }
});


/*
 * When we remove an item from the tags, we take it out of the list
 * We redo our search, and then reload everything
 */
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


/*
 * When we change the time criteria.
 * Finds the value that we have selected and assigns it to answer
 * If it is a new time criteria, we will refresh the map
 */
$(".dropdown-menu li a").click(function(){
  $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents(".dropdown").find('.btn').val($(this).data('value'));

  answer = $(this).data('value');

  // if its not what it already is
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



/*
 * When we click on a grid picture, it will blow up to the main pic
 * It will also update the title and such
 */
$(document).on('click', '.grid-pic',function(){
  $('#main-pic-header').empty();
  $('#main-pic').empty();
  $('#main-pic-header').append($(this).data('title'));
  source = $(this)[0].src;
  curr_ind = $(this)[0].dataset.ind;
  console.log(curr_ind);
  source = source.substring(0, source.length - 6);
  $('#main-pic').append("<img data-ind='"  + curr_ind + "' src='" + source + "_z.jpg' />");
  $('.pic-rotate').show();
  $('#photoModal').scrollTop(0);
});


/*
 * When we click on the left and right arrow buttons to navigate
 * when we are viewing pics
 */
$('.pic-rotate').on('click', function(){
  //make sure it is not empty
  if( !$('#main-pic').is(':empty') ){
    curr_ind = $('#main-pic').children().data('ind');

    // if we have clicked left
    if ($(this).hasClass("glyphicon-chevron-left")){
      if (curr_ind == 0){ //if were in first pic, loop to last
          changePic(nearbyPics.length-1);
      }
      else{
          changePic(curr_ind-1);
      }
    }
    // click right
    else if($(this).hasClass("glyphicon-chevron-right")){
        if (curr_ind == nearbyPics.length-1){ //if were in last pic, loop to first
            changePic(0);
        }
        else {
            changePic(curr_ind+1);
        }

    }
    $('#photoModal').scrollTop(0);
  }
});


/*
 * Go left and right on the gallery of pictures using keyboard
 */
$(document).on('keydown',function(e){
  if( !$('#main-pic').is(':empty') && $('#photoModal').hasClass('in')){
    curr_ind = $('#main-pic').children().data('ind');
    console.log("HEYYY" + curr_ind);

    switch(e.which){
      case 37: //left
        if (curr_ind == 0){
          changePic(nearbyPics.length - 1);
        } else {
          changePic(curr_ind-1);
        }
        break;
      case 39: //right
        if(curr_ind == (nearbyPics.length - 1)){
            changePic(0);
        } else {
            changePic(curr_ind+1);
        }
        break;
    }
  }

});
