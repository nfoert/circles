/*
dialog.js
Handles everything for the dialog box system
- Opening a box
    - Inserting contents into that box
- Closing a box
*/

document.getElementById("dialog-close").addEventListener("click", hide_dialog)
document.getElementById("main-backgroundblur").addEventListener("click", hide_dialog)

function show_background_blur() {
    let darkness = document.getElementById("main-backgroundblur")
    darkness.setAttribute("style", "display: inline !important;")
    darkness.classList.remove("fade_out_bg")
    darkness.classList.add("fade_in_bg")
}

function hide_background_blur() {
    let darkness = document.getElementById("main-backgroundblur")
    darkness.classList.remove("fade_in_bg")
    darkness.classList.add("fade_out_bg")

    setTimeout(function () {
        darkness.setAttribute("style", "display: none !important;")
    }, 1000)
}

function show_dialog() {
    let dialog = document.getElementById("dialog")
    show_background_blur();

    dialog.setAttribute("style", "display: inline !important;")
    dialog.classList.remove("hide-dialog")
    dialog.classList.add("show-dialog")
}

function hide_dialog() {
    let dialog = document.getElementById("dialog")
    hide_background_blur();

    dialog.classList.remove("show-dialog")
    dialog.classList.add("hide-dialog")

    setTimeout(function () {
        dialog.setAttribute("style", "display: none !important;")
    }, 1000)
}
