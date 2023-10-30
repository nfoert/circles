/*
mobilewarning.js
Warns the user if the screen is really small
*/

var mobile_warning = document.getElementById("mobile-warning")
var mobile_warning_button = document.getElementById("mobile-warning-button")

mobile_warning_button.addEventListener("click", hide_mobile_warning)

addEventListener("resize", (event) => {
    if (window.innerWidth <= 1200) {
        show_mobile_warning();
    
    } else {
        hide_mobile_warning();
    }
});

function show_mobile_warning() {
    mobile_warning.style.display = "inline";
}

function hide_mobile_warning() {
    mobile_warning.style.display = "none";
}