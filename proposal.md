## Team GuoDaddy Proposal


### Project: InstaMap

Taking great pictures is all about location. InstaMap scours Instagram to help you find the hottest locations to hone your art. 

![](http://i.imgur.com/0otoCaw.jpg)


### Feedback:

> Emily Yew: "good idea to start off, though might want to consider other factors that make an Instagram post popular
perhaps consider the category that the picture goes into? The image can be a food picture, a great location, or it could be outside of these categories. Controversial posts etc can also be popular. How would you differentiate?"


> Alok: "I really liked the ideas by Bahari Hasjim. If you could combine the ideas behind both the storyboards together, that would be something that I would use :)"

The above pieces of feedback helped shape our features and the direction we took our initial ideas. The advice from Emily resulted in the "Categories" feature of our app, where we decided to split pictures up into the different types they were. Alok's feedback resulted in us deciding to use a map interface for placing Instagram pictures.  

### Storyboard

![](http://i.imgur.com/g16CFIe.jpg)


### Features: 

The motivation behind this app is twofold. One, photographers can find locations that other photographers have taken pictures, and try to replicate their shots or use their photoshoot locations. Two, it's a way for people who haven't been to certain locations to get an idea of what that area is like.

Both of these goals are accomplished with a single map interface. At the top of the map will be three buttons for the **food** category, **portrait** category, and **landcape** categories. Using OpenCV and other tools, we will be able to present users with local cuisine, great places to photograph people, and great views. 

The pictures will appear on the map as circles with numbers inside (representing the number of pictures at that location. As the user zooms in, the circles will split into circles with smaller numbers, representing more specific locations. As an example, Yosemite may appear as a circle with a large number of pictures, but after the user zooms in, the initial circle would split into circles at Half Dome, Clouds Rest, Curry Village, etc, each with the specific number of pictures taken there. 

Locations will be automatically filled with public pictures that have that location. By checking a box in user settings, users can choose to add their private pictures as well. 

An aspect of the app which will increase engagement and quality of content is a rating system which keeps the best content at the top of each dot's list. We plan on implementing this by allowing users to "star" pictures they like, and sorting the pictures by number of stars. This will make sure that people cannot advertise on the app by putting up unrelated pictures. 


### How We're Going to Split the Work: 


Bahari: 
  - Research database possibilities and set up backend services as necessary.
  - Will be tasked with finding at least two different backend services that will work for our application.
  - Research databases that can store information we need.
  
Justine: 
  - Sketch out possible designs and develop UI/UX using HTML,CSS,JS and potential frontend frameworks.
  - Create at least two designs that can be done so we can implement A/B testing
  - Research potential frontend frameworks and servers to host our application.
  
David: 
  - Set up routing of backend to frontend with Javascript REST API.
  - Make sure we are able to communicate with the backend and display it to the user.
  - Help tie in backend services with databases
  
Josh: 
  - Code up frontend using HTML, CSS, Javascript and help with backend setup.
  - Develop a rough draft of the designs we have and maintain good DOM structure.
  - Help set up and research of backend.
