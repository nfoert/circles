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

function update_small_buttons_column() {
    if (small_buttons_open) {
        console.log("close")
        small_buttons_open = false;
        small_buttons_column.style.maxHeight = "0px";
        small_buttons_column.style.filter = "blur(10px)";
        small_buttons_expand.style.transform = "rotate(180deg)"
    
    } else if (!small_buttons_open) {
        console.log("open")
        small_buttons_open = true;
        small_buttons_column.style.maxHeight = "400px";
        small_buttons_column.style.filter = "blur(0px)";
        small_buttons_expand.style.transform = "rotate(0deg)"
    }
}