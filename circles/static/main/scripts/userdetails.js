/*
userdetails.js

Manages things relating to user details, including
- Showing and hiding the user details box
- Generating the user details box when a user is clicked
*/

var userdetails_box = document.getElementById("menu-userdetails");
var userdetails_close = document.getElementById("menu-userdetails-close");

var userdetails_profilepicture = document.getElementById("menu-userdetails-profilepicture");

var userdetails_message = document.getElementById("menu-userdetails-button-message")
// var userdetails_follow = document.getElementById("userdetails-follow"); TODO
// var userdetails_report = document.getElementById("userdetails-report"); TODO
// var userdetails_more = document.getElementById("userdetails-more"); TODO

userdetails_message.addEventListener("click", dm_user);

var userdetails_displayname = document.getElementById("menu-userdetails-displayname");
var userdetails_username = document.getElementById("menu-userdetails-username");
var userdetails_pronouns = document.getElementById("menu-userdetails-pronouns");
var userdetails_joined = document.getElementById("menu-userdetails-joined");

var userdetails_bio = document.getElementById("menu-userdetails-bio");

userdetails_close.addEventListener("click", close_userdetails);

var userdetails_open = false;
var close_userdetails_timeout = undefined;


function open_userdetails() {
    userdetails_open = true;

    try {
        clearTimeout(close_userdetails_timeout);
    } catch {
        null;
    }

    if (window.mobile_check() == false) {
        userdetails_box.style.left = window.mouseX + "px";
        userdetails_box.style.top = window.mouseY + "px";
    }

    userdetails_box.style.display = "block";
    
    userdetails_box.classList.remove("menu-userdetails-hide");
    userdetails_box.classList.add("menu-userdetails-show");

    show_background_blur(false);
}

function close_userdetails() {

    userdetails_open = false;

    userdetails_box.classList.add("menu-userdetails-hide");
    userdetails_box.classList.remove("menu-userdetails-show");

    close_userdetails_timeout = setTimeout(function() {
        userdetails_box.style.display = "none";
    }, 1000);

    hide_background_blur();
}

function request_userdetails(username) {
    const get_userdetails_json = {
        "type": "get_userdetails",
        "username": username,
    }
    
    server_socket.send(JSON.stringify(get_userdetails_json));
}

function render_userdetails(json) {
    userdetails_box.setAttribute("username", json["username"]);
    
    userdetails_displayname.innerText = json["display_name"];
    userdetails_username.innerText = json["username"] + "@" + "circles.media"; // TODO: Change server name based off of actual server name
    userdetails_pronouns.innerText = json["pronouns"];
    userdetails_bio.innerText = json["bio"];
    log_info(json["bio"]);
    userdetails_joined.innerHTML = '<i class="ph-bold ph-calendar-blank"></i> Joined ' + json["date_created"];

    userdetails_profilepicture.style.backgroundColor = json["primary_color"];
    userdetails_box.style.backgroundColor = json["secondary_color"] + "40";
    open_userdetails();
}

function dm_user() {
    const username = userdetails_box.getAttribute("username");

    const dm_user_json = {
        "type": "dm_user",
        "username": username
    }

    server_socket.send(JSON.stringify(dm_user_json));
}