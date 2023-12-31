/*
emoji.js
Handles everything for the emoji picker, including:
- Showing and hiding
- Placing the returned emoji into the correct place based on the current state
*/

var emoji_state = "none"; // none, reaction, message
var emojipicker_open = false;

var menu_emojipicker = document.getElementById("menu-emoji");
document.getElementById("menu-emoji-close").addEventListener("click", close_emojipicker);
document.querySelector('emoji-picker').addEventListener('emoji-click', event => insert_emoji(event));

function open_emojipicker(state) {
    if (state == undefined) {
        log_warn("State is required when opening the emojipicker");
        return false;
    } else {
        emoji_state = state;
    }

    emojipicker_open = true;

    try {
        clearTimeout(close_userdetails_timeout);
    } catch {
        null;
    }

    menu_emojipicker.style.display = "block";
    
    menu_emojipicker.classList.remove("menu-hide");
    menu_emojipicker.classList.add("menu-show");

    return true;
}

function close_emojipicker() {
    emojipicker_open = false;

    menu_emojipicker.classList.add("menu-hide");
    menu_emojipicker.classList.remove("menu-show");

    close_userdetails_timeout = setTimeout(function() {
        menu_emojipicker.style.display = "none";
    }, 1000);

    emoji_state = "none";

    return true;
}

function insert_emoji(event) {
    if (emoji_state == "message") {
        const text_input = document.getElementById("main-messages-box-input-textarea");
        text_input.value = text_input.value + event.detail["unicode"];
    } else if (emoji_state == "reaction") {
        log_info("Coming soon");
    } else {
        log_warn("An emoji was clicked, but the state isn't valid.")
    }
}