let conversations_box_manager = document.getElementById("main-messages-box-conversations");
let messages_box_manager = document.getElementById("main-messages-box-messages");

let button = document.getElementById("main-messages-box-input-conversations");
let button_text = document.getElementById("main-messages-box-input-conversations-text");

button.addEventListener("click", update_messages_conversations)

let conversations_messages_state = 0; // 0 = messages, 1 = conversations

function update_messages_conversations() {
    if (conversations_messages_state == 0) {
        conversations_messages_state = 1;

        messages_box_manager.style.display = "none";
        conversations_box_manager.style.display = "flex";
        button_text.innerHTML = '<i class="ph-bold ph-x-circle"></i>'
    
    } else if (conversations_messages_state == 1) {
        conversations_messages_state = 0;
        conversations_box_manager.style.display = "none";
        messages_box_manager.style.display = "flex";
        button_text.innerHTML = '<i class="ph-bold ph-list"></i>'
    }
}

function update_messages_conversations_hide_conversations() {
    conversations_messages_state = 1;
    update_messages_conversations();
}