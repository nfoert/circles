var background_blur = document.getElementById("main-backgroundblur")

const conversation_box = document.getElementById("create-conversation-box")
const conversation_box_close = document.getElementById("create-conversation-box-close")
const conversation_box_name = document.getElementById("conversation-box-name-input")
const conversation_box_search = document.getElementById("conversation-box-user-search")
const conversation_userstoadd = document.getElementById("conversation-box-userstoadd")
const conversation_confirm = document.getElementById("conversation-box-button")
conversation_confirm.disabled = true;

conversation_confirm.addEventListener("click", create_new_conversation)

const conversation_button = document.getElementById("create-new-conversation-button")

conversation_button.addEventListener("click", show_conversation_box)
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

    
}