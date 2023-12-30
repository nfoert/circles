/*
messages.js
Handles everything to do with Messages
- Send
- Render existing messages
- Render new messages
*/

// Thanks to https://www.section.io/engineering-education/keyboard-events-in-javascript/

var message_box = document.getElementById("main-messages-box-input-textarea");
var message_button = document.getElementById("main-messages-box-input-send");
var main_messages_box = document.getElementById("main-messages-box-messages");

var message_menu_box = document.getElementById("menu-message");
document.getElementById("menu-message-reactions").addEventListener("click", message_react);
document.getElementById("menu-message-reply").addEventListener("click", message_reply);
document.getElementById("menu-message-edit").addEventListener("click", message_edit);
document.getElementById("menu-message-delete").addEventListener("click", message_delete);
document.getElementById("menu-message-copy").addEventListener("click", message_copy);
document.getElementById("menu-message-close").addEventListener("click", hide_messages_menu);

message_button.disabled = true;

message_button.addEventListener("click", send_message);
document.addEventListener("keydown", (event) => check_shift_down(event));
document.addEventListener("keyup", (event) => check_shift_up(event));

document.addEventListener("keydown", (event) => send_message_keybind(event));
message_box.addEventListener("keydown", (event) => prevent_enter_key(event));
message_box.addEventListener("input", check_messages_input);

var shift = false;
var message_menu_open = false;
var close_message_menu_timeout = undefined;
var selected_message = undefined;

function check_shift_down(event) {
    if (event.key == "Shift") {
        shift = true;
    }
}

function check_shift_up(event) {
    if (event.key == "Shift") {
        shift = false;
    }
}

function send_message() {
    // Thanks to Johnride's answer here https://stackoverflow.com/questions/23369368/how-to-get-the-current-status-of-a-javascript-websocket-connection
    if (server_socket.readyState == server_socket.OPEN) {
        if (message_box.value) {
            status_loading();
            const send_message_json = {
                "type": "send_message",
                "message": message_box.value,
            }

            server_socket.send(JSON.stringify(send_message_json));

            message_box.value = "";

            status_done();
        }

    }

}

function send_message_keybind(event) {
    if (event.key == "Enter" && shift == false) {
        send_message();
    }
}

function prevent_enter_key(event) {
    if (event.key == "Enter" && shift == false) {
        event.preventDefault();
    }
}

function render_recent_messages(packet) {
    // Thanks to user1030503's answer here https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
    // Thanks to DVK's answer here https://stackoverflow.com/questions/9456138/how-can-i-get-seconds-since-epoch-in-javascript
    // Thanks to Michael Mrozek's answer here https://stackoverflow.com/questions/3367415/get-epoch-for-a-specific-date-using-javascript
    // Thanks to chovy's answer here https://stackoverflow.com/questions/13707333/javascript-convert-date-time-string-to-epoch
    // Thanks to rink.attendant.6's answer here https://stackoverflow.com/questions/23749464/reverse-the-order-of-elements-added-to-dom-with-javascript
    
    main_messages_box.replaceChildren() // Clear children

    for (message in packet["messages"]) {
        var text = packet["messages"][message]["text"];
        const user = packet["messages"][message]["user"];
        const id = packet["messages"][message]["id"];
        var date_string = "";

        var date_time_created_epoch = parseInt(packet["messages"][message]["date_time_created"]);
        var date_time_created = new Date(0);
        date_time_created.setUTCSeconds(date_time_created_epoch);

        const options = { hour: "2-digit", minute: "2-digit", "timeZone": "EST" };

        var now = Math.round(new Date / 1000); // Seconds
        var minutes_since_message = Math.round((now - date_time_created_epoch) / 60)
        
        if (minutes_since_message <= 60) {
            if (minutes_since_message == 0) {
                date_string = "Just now";
            
            } else {
                date_string = minutes_since_message + " min ago";
            }
            
        } else {
            date_string = date_time_created.toLocaleTimeString("en-us", options);
        }

        
        let message_div = document.createElement("div")

        if (user == me.username) {
            message_div.classList.add("message-you")
        
        } else {
            message_div.classList.add("message")
        }

        const mentions = [...text.matchAll("@[A-Za-z]*")];
        for (const mention in mentions) {
            if (mentions[mention][0].includes(me.username)) {
                let mention_button = document.createElement("button");
                mention_button.classList.add("mention-you");
                mention_button.innerText = mentions[mention][0];
                text = text.replace(mentions[mention][0], mention_button.outerHTML);

            } else {
                let mention_button = document.createElement("button");
                mention_button.classList.add("mention");
                mention_button.innerText = mentions[mention][0];
                text = text.replace(mentions[mention][0], mention_button.outerHTML);
            }
        }

        let message_div_text = document.createElement("div");
        message_div_text.classList.add("message-content");
        message_div_text.innerHTML = marked.parse(DOMPurify.sanitize(text));

        let message_div_info = document.createElement("div");
        message_div_info.classList.add("message-info");
        message_div_info.innerText = user + " - " + date_string;

        message_div.appendChild(message_div_text);
        message_div.appendChild(message_div_info);

        message_div.setAttribute("id", id);

        message_div.addEventListener("click", message_clicked); // Set event listener for the menu

        main_messages_box.insertBefore(message_div, main_messages_box.firstChild);


        try {
            let mentions_inmessage = message_div_text.getElementsByClassName("mention");
            for (const mention in mentions_inmessage) {
                mentions_inmessage[mention].addEventListener("click", mention_clicked);
            }
        } catch {
            null;
        }

        try {
            let mentionsyou_inmessage = message_div_text.getElementsByClassName("mention-you");
            for (const mention in mentionsyou_inmessage) {
                mentionsyou_inmessage[mention].addEventListener("click", mention_clicked);
            }
        } catch {
            null;
        }

    }

}

// Thanks to Felix Kling's answer here https://stackoverflow.com/questions/11796093/is-there-a-way-to-provide-named-parameters-in-a-function-call-in-javascript
function render_new_message({text, user, date, id}={}) {
    if (!date) {
        date = new Date();
    }

    let message_div = document.createElement("div");

    if (user == me.username) {
        message_div.classList.add("message-you");
    
    } else {
        message_div.classList.add("message");
    }

    const mentions = [...text.matchAll("@[A-Za-z]*")];
    for (const mention in mentions) {
        if (mentions[mention][0].includes(me.username)) {
            let mention_button = document.createElement("button");
            mention_button.classList.add("mention-you");
            mention_button.innerText = mentions[mention][0];
            text = text.replace(mentions[mention][0], mention_button.outerHTML);

        } else {
            let mention_button = document.createElement("button");
            mention_button.classList.add("mention");
            mention_button.innerText = mentions[mention][0];
            text = text.replace(mentions[mention][0], mention_button.outerHTML);
        }
    }

    let message_div_text = document.createElement("div");
    message_div_text.classList.add("message-content");
    message_div_text.innerHTML = marked.parse(DOMPurify.sanitize(text));

    let message_div_info = document.createElement("div");
    message_div_info.classList.add("message-info");
    message_div_info.innerText = user + " - " + "Just now";

    message_div.appendChild(message_div_text);
    message_div.appendChild(message_div_info);

    message_div.setAttribute("id", id);

    message_div.addEventListener("click", message_clicked); // Set event listener for the menu

    main_messages_box.insertBefore(message_div, main_messages_box.firstChild);

    try {
        let mentions_inmessage = message_div_text.getElementsByClassName("mention");
        for (const mention in mentions_inmessage) {
            mentions_inmessage[mention].addEventListener("click", mention_clicked);
        }
    } catch {
        null;
    }

    try {
        let mentionsyou_inmessage = message_div_text.getElementsByClassName("mention-you");
        for (const mention in mentionsyou_inmessage) {
            mentionsyou_inmessage[mention].addEventListener("click", mention_clicked);
        }
    } catch {
        null;
    }
}

/**
 * Adds messages to the list of messages when we recieve them from the server
 * @param {*} json 
 */
function render_new_messages(json) {
    for (message in json["messages"]) {
        let msg = json["messages"][message];
        
        render_new_message({ text: msg["text"], user: msg["user"], id: msg["id"]});
    }
}

function check_messages_input(event) {
    if (message_box.value == "") {
        message_button.disabled = true;
    
    } else {
        message_button.disabled = false;
    }
}

function mention_clicked(event) {
    request_userdetails(event.target.innerText.replace("@", ""));
}

function message_clicked(event) {
    let element = event.target.closest(".message, .message-you");

    selected_message = element.getAttribute("id");

    element.style.zIndex = "1000";
    show_background_blur(false);

    show_messages_menu();
}

function show_messages_menu() {
    message_menu_open = true;

    let selected_message_element = document.querySelector(`.message-you[id="${selected_message}"], .message[id="${selected_message}"]`);

    try {
        clearTimeout(close_message_menu_timeout);
    } catch {
        null;
    }

    if (window.mobile_check() == false) {
        const message_position = document.querySelector(`.message-you[id="${selected_message}"], .message[id="${selected_message}"]`).getBoundingClientRect();
        
        message_menu_box.style.display = "block";

        message_menu_box.style.left = message_position.left + "px";
        message_menu_box.style.top = message_position.top + message_position.height + 10 + "px";

        if (window.innerHeight <= message_position.top + message_position.height + message_menu_box.getBoundingClientRect().height) {
            message_menu_box.style.left = message_position.left + "px";
            message_menu_box.style.top = message_position.top - message_menu_box.getBoundingClientRect().height - 10 + "px";
        
        } else {
            message_menu_box.style.left = message_position.left + "px";
            message_menu_box.style.top = message_position.top + message_position.height + 10 + "px";
        }
    }

    message_menu_box.classList.remove("menu-hide");
    message_menu_box.classList.add("menu-show");

    show_background_blur(false);
}

function hide_messages_menu() {
    message_menu_open = false;
    const selected_message_old = selected_message;

    selected_message = undefined;


    message_menu_box.classList.add("menu-hide");
    message_menu_box.classList.remove("menu-show");

    close_message_menu_timeout = setTimeout(function() {
        message_menu_box.style.display = "none";

        document.querySelector(`.message-you[id="${selected_message_old}"], .message[id="${selected_message_old}"]`).style.zIndex = "unset";

    }, 1000);

    hide_background_blur();
}

function message_react() {
    log_info(selected_message);
}

function message_reply() {
    log_info(selected_message);
}

function message_edit() {
    log_info(selected_message);
}

function message_delete() {
    log_info(selected_message);
}

function message_copy() {
    log_info(selected_message);
}