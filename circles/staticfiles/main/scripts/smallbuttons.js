/*
smallbuttons.js
Handles everything for the small navigation and link buttons to the side.
- Click events
- Expand and hide
*/

var small_buttons_expand = document.getElementById("small-buttons-expand")
var small_buttons_column = document.getElementById("small-buttons-column")

small_buttons_expand.addEventListener("click", update_small_buttons_column)

var small_buttons_open = true;

document.getElementById("small-buttons-github").addEventListener("click", () => {
    window.open("https://github.com/nfoert/circles", "_blank") // TODO: Make this URL an attribute in Server
})

document.getElementById("small-buttons-issues").addEventListener("click", () => {
    window.open("https://github.com/nfoert/circles/issues", "_blank") // TODO: Make this URL an attribute in Server
})

document.getElementById("small-buttons-discord").addEventListener("click", () => {
    window.open("https://discord.com/invite/QBDw4UrGXX", "_blank") // TODO: Make this URL an attribute in Server
})

document.getElementById("small-buttons-zoomin").addEventListener("click", () => {
    console.log("It's zoomin")
    zoom_amount(5);
})

document.getElementById("small-buttons-zoomout").addEventListener("click", () => {
    zoom_amount(-5);
})

document.getElementById("small-buttons-me").addEventListener("click", () => {
    me.move_camera_to_me();
})

function update_small_buttons_column() {
    if (small_buttons_open) {
        small_buttons_open = false;
        small_buttons_column.style.maxHeight = "0px";
        small_buttons_column.style.filter = "blur(10px)";
        small_buttons_expand.style.transform = "rotate(180deg)"
    
    } else if (!small_buttons_open) {
        small_buttons_open = true;
        small_buttons_column.style.maxHeight = "400px";
        small_buttons_column.style.filter = "blur(0px)";
        small_buttons_expand.style.transform = "rotate(0deg)"
    }
}

function hide_small_buttons_expand() {
    small_buttons_open = true;
    update_small_buttons_column();
    small_buttons_expand.style.opacity = "0";

    setTimeout(() => {
        small_buttons_expand.style.display = "none";

    }, 100)
}

function show_small_buttons_expand() {
    small_buttons_expand.style.display = "block";
    small_buttons_expand.style.opacity = "0";


    setTimeout(() => {
        small_buttons_expand.style.opacity = "1"
    }, 500) 
}