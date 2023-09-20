// Thanks to https://www.section.io/engineering-education/keyboard-events-in-javascript/

var message_box = document.getElementById("main-messages-box-input-textarea")
var message_button = document.getElementById("main-messages-box-input-send")

message_button.addEventListener("click", send_message)
document.addEventListener("keydown", (event) => check_shift_down(event))
document.addEventListener("keyup", (event) => check_shift_up(event))
document.addEventListener("keydown", (event) => send_message_keybind(event))

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
        console.log("Sending")
        const send_message_json = {
            "type": "send_message",
            "message": message_box.value,
        }

        server_socket.send(JSON.stringify(send_message_json))
    }

}

function send_message_keybind(event) {
    if (shift == false && event.key == "Enter") {
        send_message();
    
    } else if (shift == true && event.key == "Enter") {
        // Insert whitespace
    }

}