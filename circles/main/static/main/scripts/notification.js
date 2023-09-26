var notification = document.getElementById("main-notification-box")

function hide_notification() {
    notification.classList.remove("expand-notification")

    notification.classList.add("hide-notification")   
}

function show_notification(title, text, style) {
    let notification_title = notification.getElementsByClassName("notification-title")[0];
    let notification_text = notification.getElementsByClassName("notification-text")[0];

    if (style == "normal" || !style) {

        notification_title.innerHTML = title;
        notification_text.innerHTML = text;

        notification_title.style.textAlign = "left";
        notification_text.style.display = "block";

        notification.classList.add("expand-notification")

        setTimeout(hide_notification, 5000);
    
    } else if (style == "status") {

        notification_title.innerHTML = title;

        notification_title.style.textAlign = "center";
        notification_text.style.display = "none";

        notification.classList.add("expand-notification")

        setTimeout(hide_notification, 5000);
    }
}

function set_notification_color(r, g, b) {
    notification.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`
}

function set_notification_text(text) {
    let notification_text = notification.getElementsByClassName("notification-text")[0];
    notification_text.innerHTML = text;
}

function set_notification_title(title) {
    let notification_title = notification.getElementsByClassName("notification-title")[0];
    notification_title.innerHTML = title;
}