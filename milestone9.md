
# Milestone 9



## Core Functionality
 
From last week until now, we've put in a ton of work to make the app based entirely on real, from-an-actual-api data, rather than dummy data like we used last week. We linked up the Google Maps and Flickr apis, and the result is that not only can we see pins on the map for each picture that was taken, but we can click on each of those pins and see the picture itself. 

Additionally, the pins now reload every time the bounds of the map are changed. For example, if the user zooms in from looking at the whole of California, to just looking at San Diego, the pins will disappear and just pins for San Diego will be loaded (resulting in much more photos for that area). 

![](http://i.imgur.com/4qrcrlg.png)

## Bahari Hasjim 
I fixed the Flickr API request so that we were getting pictures according to their geotagged locations. Finally figured out how to use bbox, to get all of the pictures in a longitude/latitude box. Also worked with David to configure getting the box of the google maps window so that we can pull photos from Flickr according to our current google maps window. Then, I updated all of the pins to be fires. Also just cleaned up code so it is better organized.


## David Moll
I focused this week on the core piece of our app - making sure there were pins on the map wherever a picture on flickr had been taken. I iterated through the JSON response from the flickr api, and converted each into pins on the map. I also implemented a functionality where every time the map was dragged to a new spot or the zoom changed, the pins would reload. I also refactored the home page so that the javascript code we were writing was no longer in the html. This helped make our codebase a lot easier to read and contribute to.


## Justine Lin
My position was mainly focused on UI and because our team mainly focused on the backend this time around, I did not do much coding. I did sketch up some ideas regarding what the UI would look like. 


## Joshua Komala
I mainly focused on trying to connect the data pulled from the Flickr api to the frontend. Now when you pull up the bottom bar, the images populate the new div. I also finally fixed the application deployment onto heroku. The app is now live on appexposure.herokuapp.com
