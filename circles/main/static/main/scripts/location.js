/*
location.js
Manages things for the Location Box, including:
- Displaying the location of the user
- Displaying the number of users online and offline
- Catching when a button is pressed on the box, and navigating the user to the necessary Circle
*/

var location_box = document.getElementById("main-location-box-location")
var location_box_users = document.getElementById("main-location-box-users")

function update_position_indicator() {
    location_box.replaceChildren() // Clear children

    for (const item in me.location_circle) {
        const element = document.createElement("p")
        element.classList.add("location-item")
        element.innerHTML = me.location_circle[item];

        const slash = document.createElement("p")
        slash.classList.add("location-slash")
        slash.innerHTML = "/";

        location_box.appendChild(element);
        location_box.appendChild(slash);
    }
}

function update_user_count(json) {
    location_box_users.innerHTML = 
    json["online"] + '<i class="ph-fill ph-user"></i> ' + json["offline"] + '<i class="ph-bold ph-user"></i>';
}