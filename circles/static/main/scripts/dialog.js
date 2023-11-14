/*
dialog.js
Handles everything for the dialog box system
- Opening a box
    - Inserting contents into that box
- Closing a box
*/

document.getElementById("dialog-close").addEventListener("click", hide_dialog);
document.getElementById("main-backgroundblur").addEventListener("click", hide_dialog);

function show_background_blur() {
    let darkness = document.getElementById("main-backgroundblur");
    darkness.setAttribute("style", "display: inline !important;");
    darkness.classList.remove("fade_out_bg");
    darkness.classList.add("fade_in_bg");
}

function hide_background_blur() {
    let darkness = document.getElementById("main-backgroundblur");
    darkness.classList.remove("fade_in_bg");
    darkness.classList.add("fade_out_bg");

    setTimeout(function () {
        darkness.setAttribute("style", "display: none !important;");
    }, 1000);
}

function render_dialog(name) {
    // Thanks to Taufik Nur Rahmanda's answer here https://stackoverflow.com/questions/20173101/copy-the-content-of-a-div-into-another-div
    try {
        var div = document.getElementById("dialog-" + name).cloneNode(true);
        div.style.display = "inline";
        document.getElementById("dialog-header").innerText = div.getAttribute("header");
        document.getElementById("dialog-subheader").innerText = div.getAttribute("subheader");
        document.getElementById("dialog").appendChild(div);

        log_info(`Rendered dialog '${name}'`)

    } catch {
        console.log("FAIL"); // TODO: need a logging system!
    }
    
}

function show_dialog() {
    let dialog = document.getElementById("dialog");
    show_background_blur();

    dialog.setAttribute("style", "display: inline !important;");
    dialog.classList.remove("hide-dialog");
    dialog.classList.add("show-dialog");

    log_info("Showed dialog")
}

function hide_dialog() {
    let dialog = document.getElementById("dialog");
    hide_background_blur();

    dialog.classList.remove("show-dialog");
    dialog.classList.add("hide-dialog");

    setTimeout(function () {
        dialog.setAttribute("style", "display: none !important;");

        let results = document.getElementById("dialog").querySelectorAll("#dialog > div:not(#dialog-top)");
        for (const result in results) {
            if (results[result].nodeName == "DIV") {
                results[result].remove();
            }
        }

        log_info("Hid and reset dialog")
    }, 1000);

    
}
