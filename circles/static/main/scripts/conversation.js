/*
conversation.js
Handles everything relating to the Converstion list
- Gets the User's Conversations
- Renders them
- Handles click events
*/


var background_blur = document.getElementById("main-backgroundblur")

const conversation_box = document.getElementById("dialog-createconversation")
const conversation_box_name = document.getElementById("conversation-box-name-input")
const conversation_box_search = document.getElementById("conversation-box-user-search")
const conversation_userstoadd = document.getElementById("conversation-box-userstoadd")
const conversation_confirm = document.getElementById("conversation-box-button")
conversation_confirm.disabled = true;

const conversation_list = document.getElementById("main-messages-box-conversations")

conversation_confirm.addEventListener("click", create_new_conversation)

conversation_box_name.addEventListener("input", check_name)
conversation_box_search.addEventListener("input", check_username)

var selected_users = [];


function show_conversation_box() {
    render_dialog("createconversation");
    show_dialog();
}

function check_name() {
    if (conversation_box_name.value != "") {
        conversation_confirm.disabled = false;

    
    } else {
        conversation_confirm.disabled = true;

    }
}

function check_username() {
    if (conversation_box_search.value != "") {
        const json = {
            "type": "username_search",
            "string": conversation_box_search.value,
        }

        var username_search_json = JSON.stringify(json)

        server_socket.send(username_search_json)
    
    } else {
        conversation_userstoadd.replaceChildren() // Clear children
        render_username_search();
    }
}

// Thanks to Mason Freed's answer here https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
function render_username_search(usernames) {

    conversation_userstoadd.replaceChildren() // Clear children

    for (user in selected_users) {
        child = document.createElement("div");
        child.classList.add("user-in-conversation-confirm");
        child.innerText = selected_users[user];
        child.addEventListener("click", (event) => remove_user(event))

        conversation_userstoadd.appendChild(child);
    }

    for (user in usernames) {
        if (!selected_users.includes(usernames[user])) {
            child = document.createElement("div");
            child.classList.add("user-in-conversation-search");
            child.innerText = usernames[user];
            child.addEventListener("click", (event) => select_user(event))

            conversation_userstoadd.appendChild(child);
        }
    }
}

// Thanks to mixel's answer here https://stackoverflow.com/questions/7627161/get-id-of-element-that-called-a-function
function select_user(event) {
    if (!selected_users.includes(event.target.innerText)) {
        selected_users.push(event.target.innerText)
        render_username_search();
        conversation_box_search.value = "";
    }
}

function remove_user(event) {
    selected_users.splice(selected_users.indexOf(event.target.innerText), 1)
    render_username_search();
}

function create_new_conversation() {
    const packet = {
        "type": "create_conversation",
        "name": conversation_box_name.value.trim(),
        "users": selected_users,
    }

    const packet_json = JSON.stringify(packet);
    
    hide_dialog();

    conversation_box_search.value = "";
    conversation_box_name.value = "";
    conversation_userstoadd.replaceChildren() // Clear children

    server_socket.send(packet_json);

    get_users_conversations_request();

    
}
/**
 * Sends a request to the server asking for the list of the user's conversations
 */
function get_users_conversations_request() {
    
    const packet = {
        "type": "get_users_conversations"
    }

    const packet_json = JSON.stringify(packet);

    server_socket.send(packet_json);
}

/**
 * Iterates through all of the conversations recieved in the request and renders them in the user's list of conversations
 * @param {json} json 
 */
function render_users_conversations(json) {
    conversation_list.replaceChildren() // Clear children

    var conversation_label = document.createElement("p");
    conversation_label.classList.add("text-small");
    conversation_label.classList.add("fade_in_conversations_label");
    conversation_label.style.textAlign = "left";
    conversation_label.innerText = "Conversations";

    conversation_list.appendChild(conversation_label);

    var conversations = json["conversations"]

    for (conversation in conversations) {
        var conversation_name = document.createElement("div")
        conversation_name.classList.add("conversation-name")
        conversation_name.innerHTML = '<i class="ph-bold ph-chat-teardrop-text" style="vertical-align:middle;"></i> ' + conversations[conversation]["name"]

        var conversation_info = document.createElement("div")
        conversation_info.classList.add("conversation-info")

        if (conversations[conversation]["number_of_users"] === 1) {
            conversation_info.innerText = conversations[conversation]["number_of_users"] + " Person"
        
        } else {
            conversation_info.innerText = conversations[conversation]["number_of_users"] + " People"
        }

        child = document.createElement("div");
        child.classList.add("conversation");
        child.appendChild(conversation_name);
        child.appendChild(conversation_info)

        conversation_list.appendChild(child);
    }

    var conversation_all_of_server_name = document.createElement("div")
    conversation_all_of_server_name.classList.add("conversation-name")
    conversation_all_of_server_name.innerHTML = '<i class="ph-bold ph-hard-drives" style="vertical-align:middle;"></i> ' + "All of circles.media"

    var conversation_all_of_server_info = document.createElement("div")
    conversation_all_of_server_info.classList.add("conversation-info")

    if (json["total_online"] === 1) {
        conversation_all_of_server_info.innerText = json["total_online"] + " User in circles.media" // TODO: Change based off of server name
        
    } else {
        conversation_all_of_server_info.innerText = json["total_online"] + " Users in circles.media" // TODO: Change based off of server name
    }

    var conversation_all_of_server = document.createElement("div")
    conversation_all_of_server.classList.add("conversation")
    conversation_all_of_server.appendChild(conversation_all_of_server_name);
    conversation_all_of_server.appendChild(conversation_all_of_server_info);

    var conversation_all_of_circle_name = document.createElement("div")
    conversation_all_of_circle_name.classList.add("conversation-name")
    conversation_all_of_circle_name.innerHTML = '<i class="ph-bold ph-circle" style="vertical-align:middle;"></i> ' + "Messages from current Circle"
    

    var conversation_all_of_circle_info = document.createElement("div")
    conversation_all_of_circle_info.classList.add("conversation-info")

    if (json["total_online_in_circle"] === 1) {
        conversation_all_of_circle_info.innerText = json["total_online_in_circle"] + " Person in your current Circle"
    
    } else {
        conversation_all_of_circle_info.innerText = json["total_online_in_circle"] + " People in your current Circle"

    }

    var conversation_all_of_circle = document.createElement("div")
    conversation_all_of_circle.classList.add("conversation")
    conversation_all_of_circle.appendChild(conversation_all_of_circle_name);
    conversation_all_of_circle.appendChild(conversation_all_of_circle_info);

    var conversation_create_new_conversation_name = document.createElement("div");
    conversation_create_new_conversation_name.classList.add("conversation-name");
    conversation_create_new_conversation_name.innerHTML = '<i class="ph-bold ph-plus" style="vertical-align:middle;"></i> ' + "Create new Conversation";

    var conversation_create_new_conversation = document.createElement("div")
    conversation_create_new_conversation.classList.add("conversation2")
    conversation_create_new_conversation.id = "create-new-conversation-button";
    conversation_create_new_conversation.appendChild(conversation_create_new_conversation_name);
    conversation_create_new_conversation.addEventListener("click", show_conversation_box)

    conversation_list.appendChild(conversation_all_of_server);
    conversation_list.appendChild(conversation_all_of_circle);
    conversation_list.appendChild(conversation_create_new_conversation);

    conversation_all_of_server.id = "conversation-all-of-server";
    conversation_all_of_circle.id = "conversation-current-circle";


    var conversation_elements = document.getElementsByClassName("conversation");
    for (conversation_element in conversation_elements) {
        try {
            conversation_elements[conversation_element].addEventListener("click", (event) => select_conversation(event));
        
        } catch {
            null;
        }
    }


}

function select_conversation(event) {
    const messages_entry = document.getElementById("main-messages-box-input-textarea")

    if (event.target.children.length == 2) {
        var conversation = event.target;

    } else if (event.target.children.length == 1) {
        var conversation = event.target.parentElement;

    }


    if (conversation.id == "conversation-all-of-server") {
        var switch_conversation_packet = {
            "type": "switch_conversation",
            "conversation_type": "server",
            "name": false,
        }

        server_socket.send(JSON.stringify(switch_conversation_packet))

        messages_entry.placeholder = "All of circles.media"; // TODO: Change depending on actual server name
    
    } else if (conversation.id == "conversation-current-circle") {
        var switch_conversation_packet = {
            "type": "switch_conversation",
            "conversation_type": "circle",
            "name": false,
        }

        server_socket.send(JSON.stringify(switch_conversation_packet))

        messages_entry.placeholder = "Messages from current Circle";

    } else {
        try {
            var name = conversation.children[0].innerText;
        
        } catch {
            var name = conversation.innerText;

        }
        var switch_conversation_packet = {
            "type": "switch_conversation",
            "conversation_type": "normal",
            "name": name.trim(),
        }

        server_socket.send(JSON.stringify(switch_conversation_packet))

        messages_entry.placeholder = name;
    }

    document.getElementById("main-messages-box-messages").replaceChildren(); // Clear children
    update_messages_conversations_hide_conversations();
    log_info("Switched conversation")
}

