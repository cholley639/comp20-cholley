## Comp20 Assignment 2

# Assignment 2: The Private Car Service

### README
* Identify what aspects of the work have been correctly implemented and what have not.
* Identify anyone with whom you have collaborated or discussed the assignment.
* Say approximately how many hours you have spent completing the assignment.


## Overview
For this assignment, you will be building the front-end of a private car a la ride sharing service. Most of you will be passengers. A lucky few of you, randomly selected, will be drivers / vehicles. I cannot provide you the number of passengers or drivers. The idea: passengers will be seeking vehicles, drivers will be seeking customers (passengers). You will develop a web page that:

1. Retrieves your current location (latitude and longitude) and sends it to a server via ride request API that I created.
2. Retrieves and displays the locations of vehicles OR passengers on a map, depending on who you are. Your web page will need to handle both cases (showing locations of vehicles or passengers on map) as it is possible that I can change your status from a passenger to a driver, vice versa.
3. Upon clicking on your marker (i.e., where you are currently located), show how far away you are to (1) the nearest vehicle or passenger --depending on who you are, and (2) the Weinermobile --if it exists!

### Fully functioning

My project should do everything that the assignment description asks. My map shows the weinermobile with a unique marker and how far it is from the user. It shows each passenger/vehicle with the proper marker and the distance from the user. The user also has a unique marker with an info window telling how far away the nearest marker and weinermobile is respectively.

### Sources
* https://developers.google.com/maps/documentation/javascript/
* https://stackoverflow.com/questions/14915945/google-maps-initial-marker-wont-show-up
* https://stackoverflow.com/questions/15096461/resize-google-maps-marker-icon-image
* https://stackoverflow.com/questions/2283566/how-can-i-round-a-number-in-javascript-tofixed-returns-a-string/14978830

### Time
I spent between 15-20 hours on this assignment

### Other
* ride request API https://hans-moleman.herokuapp.com/rides