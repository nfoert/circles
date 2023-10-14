/*
location.js
Manages things for the Location Box, including:
- Displaying the location of the user
- Displaying the number of users online and offline
- Catching when a button is pressed on the box, and navigating the user to the necessary Circle
*/

var location_box = document.getElementById("main-location-box-location")
var location_box_users = document.getElementById("main-location-box-users")
var location_box_location = document.getElementById("main-location-box-location")

var changing_circle = false;


function set_event_listeners() {
    // Set event listeners to each clickable item in the box
    // Thanks to Anudeep Bulla's answer here https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
    location_items = location_box_location.getElementsByClassName("location-item");

    for (var i = 0; i < location_items.length; i++) {
        location_items[i].addEventListener("click", event => location_change_circle(event))
    }
}

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

    set_event_listeners();
}

function location_change_circle(event) {
    if (changing_circle == false) {
        changing_circle = true;

        location_items = location_box_location.getElementsByClassName("location-item");
        let position = [];

        for (item in location_items) {
            if (location_items[item].innerText != event.target.innerText) {
                position.push(location_items[item].innerText)
            
            } else {
                position.push(location_items[item].innerText)
                break;
            }
        }
        
        let change_circle_json = {
            "type": "change_circle",
            "direction": "absolute",
            "name": position,
        }

        server_socket.send(JSON.stringify(change_circle_json))

        me.location_circle = location; // TODO: What if you switch to the server?
        setTimeout(function() {
            update_position_indicator();
            changing_circle = false;
        }, 500)

    }
}

function update_user_count(json) {
    location_box_users.innerHTML = 
    json["online"] + '<i class="ph-fill ph-user"></i> ' + json["offline"] + '<i class="ph-bold ph-user"></i>';
}