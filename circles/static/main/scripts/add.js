/*
add.js
Controls the add menu and all the behaviors for it
- Open and close the menu
- Do actions when the add menu is opened

May also contain code for certain objects and how they're added
*/

var background_blur = document.getElementById("main-backgroundblur")

var add_menu = document.getElementById("main-addmenu")
var add_menu_button = document.getElementById("main-addmenubutton")
var add_menu_button_text = document.getElementById("main-addmenubutton-text")

var add_circle = document.getElementById("add-circle")
var add_conversation = document.getElementById("add-conversation")

var add_circle_box = document.getElementById("dialog-createcircle")

var add_circle_name = document.getElementById("circle-box-name-input")
var add_circle_button = document.getElementById("circle-box-button")
add_circle_button.disabled = true;
add_circle_name.addEventListener("input", update_add_circle)

add_circle_button.addEventListener("click", create_circle)

add_circle.addEventListener("click", function () {
    open_add_circle();
})

add_menu_button.addEventListener("click", update_add_menu)

add_conversation.addEventListener("click", add_conversation_func)

var add_menu_open = false;
var add_converation_open = false;

function update_add_menu() {
    if (add_menu_open == true) {
        add_menu_open = false;

        add_menu.classList.remove("show-addmenu")
        add_menu.classList.add("hide-addmenu")

        add_menu_button_text.innerHTML = '<i class="ph-bold ph-plus-circle"></i> Add'
    
    } else if (add_menu_open == false) {
        add_menu_open = true;

        add_menu.classList.remove("hide-addmenu")
        add_menu.classList.add("show-addmenu")
        
        add_menu_button_text.innerHTML = '<i class="ph-bold ph-x-circle"></i> Close'
    }
}

function add_conversation_func() {
    update_add_menu();
    show_conversation_box();
}

function open_add_circle() {
    render_dialog("createcircle");
    show_dialog();
}

function update_add_circle() {
    if (add_circle_name.value == "") {
        add_circle_button.disabled = true;
    
    } else {
        add_circle_button.disabled = false;
    }
}

function create_circle() {
    hide_dialog();

    create_circle_packet = {
        "type": "create_circle",
        "name": add_circle_name.value,
        "x": me.x,
        "y": me.y,
    }

    server_socket.send(JSON.stringify(create_circle_packet));

    var new_circle = new Circle();
    new_circle.x = me.x;
    new_circle.y = me.y;
    new_circle.name = add_circle_name.value;

    circles.push(new_circle);

    new_circle.draw();

    add_circle_name.value = "";


}