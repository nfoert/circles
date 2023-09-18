var conversations = document.getElementById("main-messages-box-conversations");
var messages = document.getElementById("main-messages-box-messages");

var button = document.getElementById("main-messages-box-input-conversations");
var button_text = document.getElementById("main-messages-box-input-conversations-text");

button.addEventListener("click", update)

var state = 0; // 0 = messages, 1 = conversations

function update() {
    if (state == 0) {
        state = 1;
        messages.style.display = "none";
        conversations.style.display = "flex";
        button_text.innerHTML = '<i class="ph-bold ph-x-circle"></i>'
    
    } else if (state == 1) {
        state = 0;
        conversations.style.display = "none";
        messages.style.display = "flex";
        button_text.innerHTML = '<i class="ph-bold ph-list"></i>'
    }
}