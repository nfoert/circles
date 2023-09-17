var background_blur = document.getElementById("main-backgroundblur")

const conversation_box = document.getElementById("create-conversation-box")
const conversation_box_close = document.getElementById("create-conversation-box-close")
const conversation_box_name = document.getElementById("conversation-box-name-input")
const conversation_box_search = document.getElementById("conversation-box-user-search")
const conversation_userstoadd = document.getElementById("conversation-box-userstoadd")
const conversation_confirm = document.getElementById("conversation-box-button")
conversation_confirm.disabled = true;

const conversation_list = document.getElementById("main-messages-box-conversations")

conversation_confirm.addEventListener("click", create_new_conversation)

conversation_box_close.addEventListener("click", hide_conversation_box)

conversation_box_name.addEventListener("input", check_name)
conversation_box_search.addEventListener("input", check_username)

var selected_users = [];


function show_conversation_box() {
    conversation_box.style.display = "flex";
    conversation_box.classList.remove("hide-create-conversation-box")
    conversation_box.classList.add("show-create-conversation-box")

    background_blur.classList.remove("fade_out_bg")
    background_blur.classList.add("fade_in_bg")
}

function hide_conversation_box() {
    conversation_box.style.opacity = 1;
    conversation_box.classList.remove("show-create-conversation-box")
    conversation_box.classList.add("hide-create-conversation-box")

    background_blur.classList.remove("fade_in_bg")
    background_blur.classList.add("fade_out_bg")
    
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
        "name": conversation_box_name.value,
        "users": selected_users,
    }

    const packet_json = JSON.stringify(packet);
    
    hide_conversation_box();

    conversation_box_search.value = "";
    conversation_box_name.value = "";
    conversation_userstoadd.replaceChildren() // Clear children

    server_socket.send(packet_json);

    get_users_conversations_request();

    
}

function get_users_conversations_request() {
    const packet = {
        "type": "get_users_conversations"
    }

    const packet_json = JSON.stringify(packet);
    console.log(packet_json)

    server_socket.send(packet_json);
}

function render_users_conversations(json) {
    conversation_list.replaceChildren() // Clear children

    var conversation_label = document.createElement("p");
    conversation_label.classList.add("text-small");
    conversation_label.classList.add("fade_in_conversations_label");
    conversation_label.style.textAlign = "left";
    conversation_label.innerText = "Conversations";

    conversation_list.appendChild(conversation_label);

    console.log(json)

    var conversations = json["conversations"]

    for (conversation in conversations) {
        var conversation_name = document.createElement("div")
        conversation_name.classList.add("conversation-name")
        conversation_name.innerText = conversations[conversation]["name"]

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
    conversation_all_of_server_name.innerText = "All of circles.media"

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
    conversation_all_of_circle_name.innerText = "Messages from current Circle"

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
    conversation_create_new_conversation_name.innerText = "Create new Conversation";

    var conversation_create_new_conversation = document.createElement("div")
    conversation_create_new_conversation.classList.add("conversation")
    conversation_create_new_conversation.id = "create-new-conversation-button";
    conversation_create_new_conversation.appendChild(conversation_create_new_conversation_name);
    conversation_create_new_conversation.addEventListener("click", show_conversation_box)

    conversation_list.appendChild(conversation_all_of_server);
    conversation_list.appendChild(conversation_all_of_circle);
    conversation_list.appendChild(conversation_create_new_conversation);


}

