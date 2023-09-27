var notification = document.getElementById("main-notification")
var notifications_box = document.getElementById("main-notifications-box")

let notifications_box_notifications = document.getElementById("main-notifications-box-notifications")
let notifications_box_clear = document.getElementById("main-notifications-box-clear")
let notifications_box_mute = document.getElementById("main-notifications-box-mute")

notifications_box_clear.addEventListener("click", clear_notifications)
notifications_box_mute.addEventListener("click", update_mute_notifications)

let notifications_open = false;
let notification_shown = false;
var notifications_muted = false;
let notifications_yet = false;

function hide_notification() {
    notification.classList.remove("expand-notification")

    notification.classList.add("hide-notification")   

    notification_shown = false;

    notification_unread(); // Make it show unread messages
}

function show_notification(title, text, style, save) {
    if (save == null) {
        save = true;
    }


    let notification_title = notification.getElementsByClassName("notification-title")[0];
    let notification_text = notification.getElementsByClassName("notification-text")[0];

    notification.classList.remove("hide-notification")

    set_notification_color(211, 211, 211)

    notification_shown = true;
    notifications_yet = true;

    if (style == "normal" || !style) {

        notification_title.innerHTML = title;
        notification_text.innerHTML = text;

        notification_title.style.textAlign = "left";
        notification_text.style.display = "block";
    
    } else if (style == "status") {

        notification_title.innerHTML = title;

        notification_title.style.textAlign = "center";
        notification_text.style.display = "none";

    }
    
    if (notifications_open == false && notifications_muted == false) {
        notification.classList.add("expand-notification")
        setTimeout(hide_notification, 5000);
        notification_shown = false;
    
    } else {
        null
    }

    if (save == true) {
        add_notification(title, text, style)
    }
}

function add_notification(title, text, style) {
    if (notifications_yet == true) {
        notifications_box_notifications.replaceChildren() // Clear children to remove the "No Notifications" label

    }

    let notification = document.createElement("div")
    notification.classList.add("notification-list")

    let notification_title = document.createElement("p")
    notification_title.classList.add("notification-title")
    notification_title.innerHTML = title

    let notification_text = document.createElement("p")
    notification_text.classList.add("notification-text")
    notification_text.innerHTML = text

    if (style == "status") {
        notification_title.style.textAlign = "center";
        notification.appendChild(notification_title)

    } else {
        notification.appendChild(notification_title)
        notification.appendChild(notification_text)

    }

    notifications_box_notifications.appendChild(notification)

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

function update_notifications_box() {
    if (notification_shown == false) {
        null
        
    } else {
        hide_notification();
    }

    if (notifications_open == false) {
        notifications_open = true;

        notifications_box.classList.remove("hide-notification")
        notifications_box.classList.add("expand-notification")

        notification_open();


    } else if (notifications_open == true) {
        notifications_open = false;

        notifications_box.classList.remove("expand-notification")
        notifications_box.classList.add("hide-notification")

        notification_none();

    }
}

function clear_notifications() {
    notifications_box_notifications.replaceChildren() // Clear children

    let no_notifications_label = document.createElement("p")
    no_notifications_label.innerText = "No Notifications"
    no_notifications_label.classList.add("text-small")

    notifications_box_notifications.appendChild(no_notifications_label)

}

function update_mute_notifications() {
    if (notifications_muted == false) {
        notifications_muted = true;
        notifications_box_mute.innerHTML = '<i class="ph-bold ph-bell"></i> Unmute Notifications'
        notification_open();
    
    } else if (notifications_muted == true) {
        notifications_muted = false;
        notifications_box_mute.innerHTML = '<i class="ph-bold ph-bell-slash"></i> Mute Notifications'
        notification_open();

    } 
}