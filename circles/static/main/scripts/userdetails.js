/*
userdetails.js

Manages things relating to user details, including
- Showing and hiding the user details box
- Generating the user details box when a user is clicked
*/

var userdetails_box = document.getElementById("user-details")
var userdetails_close = document.getElementById("user-details-bottom-close")

var userdetails_profilepicture = document.getElementById("user-details-profilepicture")
var userdetails_top = document.getElementById("user-details-top")

var userdetails_message = document.getElementById("userdetails-message")
var userdetails_follow = document.getElementById("userdetails-follow")
var userdetails_report = document.getElementById("userdetails-report")
var userdetails_more = document.getElementById("userdetails-more")

userdetails_message.addEventListener("click", dm_user)

var userdetails_username = document.getElementById("user-details-textdetails-username")
var userdetails_server = document.getElementById("user-details-textdetails-server")
var userdetails_bio = document.getElementById("userdetails-bio")

userdetails_close.addEventListener("click", close_userdetails)

var userdetails_open = false;

function open_userdetails() {
    userdetails_open = true;
    
    userdetails_box.classList.remove("hide-user-details")
    userdetails_box.classList.add("show-user-details")
}

function close_userdetails() {
    userdetails_open = false;

    userdetails_box.classList.remove("show-user-details")
    userdetails_box.classList.add("hide-user-details")
}

function request_userdetails(username) {
    const get_userdetails_json = {
        "type": "get_userdetails",
        "username": username
    }
    
    server_socket.send(JSON.stringify(get_userdetails_json))
}

function render_userdetails(json) {
    close_userdetails();
    
    userdetails_username.innerText = json["display_name"];
    userdetails_server.innerText = json["username"] + "@" + "circles.media"; // TODO: Change server name based off of actual server name
    userdetails_bio.innerText = json["bio"];
    userdetails_profilepicture.style.backgroundColor = json["primary_color"] + "20";
    userdetails_top.style.backgroundColor = json["secondary_color"] + "20";
    open_userdetails();
}

function dm_user() {
    const username = userdetails_username.innerText

    const dm_user_json = {
        "type": "dm_user",
        "username": username
    }

    server_socket.send(JSON.stringify(dm_user_json))
}