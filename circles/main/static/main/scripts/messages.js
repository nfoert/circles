// Thanks to https://www.section.io/engineering-education/keyboard-events-in-javascript/

var message_box = document.getElementById("main-messages-box-input-textarea")
var message_button = document.getElementById("main-messages-box-input-send")
var main_messages_box = document.getElementById("main-messages-box-messages")

message_button.disabled = true;

message_button.addEventListener("click", send_message)
document.addEventListener("keydown", (event) => check_shift_down(event))
document.addEventListener("keyup", (event) => check_shift_up(event))
document.addEventListener("keydown", (event) => send_message_keybind(event))
message_box.addEventListener("input", check_messages_input)

var shift = false;

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
            const send_message_json = {
                "type": "send_message",
                "message": message_box.value,
            }

            server_socket.send(JSON.stringify(send_message_json))

            message_box.value = "";
        }

    }

}

function send_message_keybind(event) {
    if (shift == false && event.key == "Enter") {
        send_message();
    
    } else if (shift == true && event.key == "Enter") {
        // Insert whitespace
    }

}

function render_recent_messages(packet) {
    console.log("Rendering new messages")
    // Thanks to user1030503's answer here https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
    // Thanks to DVK's answer here https://stackoverflow.com/questions/9456138/how-can-i-get-seconds-since-epoch-in-javascript
    // Thanks to Michael Mrozek's answer here https://stackoverflow.com/questions/3367415/get-epoch-for-a-specific-date-using-javascript
    // Thanks to chovy's answer here https://stackoverflow.com/questions/13707333/javascript-convert-date-time-string-to-epoch
    // Thanks to rink.attendant.6's answer here https://stackoverflow.com/questions/23749464/reverse-the-order-of-elements-added-to-dom-with-javascript

    main_messages_box.replaceChildren() // Clear children


    for (message in packet["messages"]) {
        const text = packet["messages"][message]["text"];
        const user = packet["messages"][message]["user"];
        const id = packet["messages"][message]["id"];
        var date_string = "";

        var date_time_created_epoch = parseInt(packet["messages"][message]["date_time_created"]);
        var date_time_created = new Date(0);
        date_time_created.setUTCSeconds(date_time_created_epoch)

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

        let message_div_text = document.createElement("div")
        message_div_text.classList.add("message-content")
        message_div_text.innerText = text;

        let message_div_info = document.createElement("div")
        message_div_info.classList.add("message-info")
        message_div_info.innerText = user + " - " + date_string;

        message_div.appendChild(message_div_text);
        message_div.appendChild(message_div_info);

        message_div.setAttribute("id", id)
        
        main_messages_box.insertBefore(message_div, main_messages_box.firstChild)

    }
}

// Thanks to Felix Kling's answer here https://stackoverflow.com/questions/11796093/is-there-a-way-to-provide-named-parameters-in-a-function-call-in-javascript
function render_new_message({text, user, date, id}={}) {
    if (!date) {
        date = new Date();
    }

    let message_div = document.createElement("div")

    if (user == me.username) {
        message_div.classList.add("message-you")
    
    } else {
        message_div.classList.add("message")
    }

    let message_div_text = document.createElement("div")
    message_div_text.classList.add("message-content")
    message_div_text.innerText = text;

    let message_div_info = document.createElement("div")
    message_div_info.classList.add("message-info")
    message_div_info.innerText = user + " - " + "Just now";

    message_div.appendChild(message_div_text);
    message_div.appendChild(message_div_info);

    message_div.setAttribute("id", id)

    main_messages_box.insertBefore(message_div, main_messages_box.firstChild)
}

/**
 * Adds messages to the list of messages when we recieve them from the server
 * @param {*} json 
 */
function render_new_messages(json) {
    for (message in json["messages"]) {
        let msg = json["messages"][message];
        
        render_new_message({ text: msg["text"], user: msg["user"], id: msg["id"]})
    }
}

function check_messages_input() {
    if (message_box.value == "") {
        message_button.disabled = true;
    
    } else {
        message_button.disabled = false;
    }
}