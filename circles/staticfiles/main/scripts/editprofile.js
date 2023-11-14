/*
editprofile.js
Handles everything for the user details box
- Set current values
- Change values
- Sign out
*/

var edit_profile = document.getElementById("edit-profile");
var edit_profile_close = document.getElementById("edit-profile-close");
var edit_profile_open = document.getElementById("main-user-box-profile-circle");
var background_blur = document.getElementById("main-backgroundblur");

var edit_profile_save = document.getElementById("edit-profile-save");
var edit_profile_signout = document.getElementById("edit-profile-signout");
var edit_profile_changepassword = document.getElementById("edit-profile-changepassword");
var edit_profile_deleteaccount = document.getElementById("edit-profile-deleteaccount");

var edit_profile_top = document.getElementById("editprofile-top");
var edit_profile_profilepicture = document.getElementById("editprofile-profilepicture");
var edit_profile_username = document.getElementById("editprofile-username");
var edit_profile_server = document.getElementById("editprofile-server");
var edit_profile_bio_text = document.getElementById("editprofile-bio");

var edit_profile_displayname = document.getElementById("edit-profile-displayname");
var edit_profile_bio = document.getElementById("edit-profile-bio");
var edit_profile_primary = document.getElementById("edit-profile-primary");
var edit_profile_secondary = document.getElementById("edit-profile-secondary");

edit_profile_open.addEventListener("click", get_profile_details);
edit_profile_close.addEventListener("click", close_edit_profile);

edit_profile_displayname.addEventListener("input", render_profile_details_from_fields);
edit_profile_bio.addEventListener("input", render_profile_details_from_fields);
edit_profile_primary.addEventListener("input", render_profile_details_from_fields);
edit_profile_secondary.addEventListener("input", render_profile_details_from_fields);

edit_profile_save.addEventListener("click", save_profile_details);
edit_profile_signout.addEventListener("click", sign_out);
edit_profile_changepassword.addEventListener("click", not_implemented);
edit_profile_deleteaccount.addEventListener("click", not_implemented);

var settings = document.getElementsByClassName("setting");

function not_implemented() {
    show_notification("<i class='ph-bold ph-warning'></i> Not Implemented", "That feature has not been implemented yet. Check the Issues page for more information at github.com/nfoert/circles/issues", "normal", true);
    set_notification_color(255, 0, 0);
}

function get_profile_details() {
    let get_profile_details_request = {
        "type": "get_profile_details"
    }

    server_socket.send(JSON.stringify(get_profile_details_request));
}

function render_profile_details(json) {
    edit_profile_username.innerText = json["display_name"];
    edit_profile_server.innerText = json["username"] + "@" + "circles.media"; // TODO: Change server name based off of actual server name

    edit_profile_profilepicture.style.backgroundColor = json["primary_color"] + "40";
    edit_profile_top.style.backgroundColor = json["secondary_color"] + "40";
    edit_profile_bio_text.innerText = json["bio"];

    edit_profile_displayname.value = json["display_name"];
    edit_profile_bio.value = json["bio"];
    edit_profile_primary.value = json["primary_color"];
    edit_profile_secondary.value = json["secondary_color"];

    var settings = document.getElementsByClassName("setting")

    for (const setting in settings) {
        if (settings[setting].nodeName == "INPUT") {
            if (settings[setting].getAttribute("setting") in json["settings"]) {
                settings[setting].checked = json["settings"][settings[setting].getAttribute("setting")];
            }

            else {
                settings[setting].checked = settings[setting].getAttribute("default"); 
            }
        }
    }

    open_edit_profile();
}

function render_profile_details_from_fields() {
    edit_profile_username.innerText = edit_profile_displayname.value;
    edit_profile_bio_text.innerText = edit_profile_bio.value;

    edit_profile_profilepicture.style.backgroundColor = edit_profile_primary.value + "40";
    edit_profile_top.style.backgroundColor = edit_profile_secondary.value + "40";
}

function save_profile_details() {
    var settings = document.getElementsByClassName("setting")
    let settings_json = {}

    for (const setting in settings) {
        if (settings[setting].nodeName == "INPUT") {
            settings_json[settings[setting].getAttribute("setting")] = settings[setting].checked;
        }
    }


    let save_profile_details_request = {
        "type": "save_profile_details",
        "display_name": edit_profile_displayname.value,
        "bio": edit_profile_bio.value,
        "primary_color": edit_profile_primary.value,
        "secondary_color": edit_profile_secondary.value,
        "settings": settings_json
    }

    server_socket.send(JSON.stringify(save_profile_details_request));

    show_notification("<i class='ph-bold ph-check-circle'></i> Changes saved", "Saved your profile changes", "normal", true);
    set_notification_color(0, 255, 0);
}

function sign_out() {
    let sign_out_request = {
        "type": "sign_out"
    }

    server_socket.send(JSON.stringify(sign_out_request));

    close_edit_profile();

    background_blur.classList.remove("fade_out_bg");
    background_blur.classList.add("fade_in_bg");

    setTimeout(() => {
        show_notification("<i class='ph-bold ph-user-circle-minus'></i> Signed out", "<i class='ph-bold ph-timer'></i> Exiting in five seconds...", "normal", true);
    }, 100);

    setTimeout(() => {
        location.reload(); /* Reloads the page to return to the home screen */
    }, 5000);
}

function open_edit_profile() {
    edit_profile.style.display = "inline";

    edit_profile.classList.remove("hide-edit-profile");
    edit_profile.classList.add("show-edit-profile");

    background_blur.classList.remove("fade_out_bg");
    background_blur.classList.add("fade_in_bg");
}

function close_edit_profile() {
    edit_profile.classList.remove("show-edit-profile");
    edit_profile.classList.add("hide-edit-profile");

    background_blur.classList.remove("fade_in_bg");
    background_blur.classList.add("fade_out_bg");

    setTimeout(function() {
        edit_profile.style.display = "none";
    }, 500);
}