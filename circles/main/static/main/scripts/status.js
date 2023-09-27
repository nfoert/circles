let status_box = document.getElementById("main-status-box")
let status_box_notifications = document.getElementById("main-status-box-notifications")
let status_box_status = document.getElementById("main-status-box-status")
let status_box_time = document.getElementById("main-status-box-time")

status_box_notifications.addEventListener("click", update_notifications_box)

let spin = false;
let spin_number = 0;

function status_done() {
    status_box_status.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-check-circle"></i>'
}

function status_loading() {
    status_box_status.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-spinner-gap"></i>'
    // TODO: Seems to be offset all strange, maybe fix later? Use ph-circle-notch
    // spin = true;
    // status_spin_once();
}

function status_spin_once() {
    if (spin == true) {
        status_box_status.style.rotate = spin_number * 45 + "deg";
        spin_number ++;
        setTimeout(status_spin_once, 100)
    }
    
}

function status_error() {
    status_box_status.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-warning"></i>'
}

function notification_unread() {
    if (notifications_muted == false) {
        status_box_notifications.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-bell-ringing"></i>'
    
    } else {
        status_box_notifications.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-bell-slash"></i>'
    }
}

function notification_none() {
    if (notifications_muted == false) {
        status_box_notifications.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-bell"></i>'
    
    } else {
        status_box_notifications.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-bell-slash"></i>'
    }
}

function notification_open() {
    if (notifications_muted == false) {
        status_box_notifications.innerHTML = '<i id="main-status-box-status" class="ph-fill ph-bell"></i>'
    
    } else {
        status_box_notifications.innerHTML = '<i id="main-status-box-status" class="ph-fill ph-bell-slash"></i>'
    }
}

function notification_mute() {
    status_box_notifications.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-bell-slash"></i>'

}

function time() {
    // TODO: May not work for every timezone, needs localized
    const options = { hour: "2-digit", minute: "2-digit" };

    var date_time_created = new Date();
    let seconds_until = (60 - date_time_created.getSeconds()) * 1000
    setTimeout(time, seconds_until)

    date_string = date_time_created.toLocaleTimeString("en-us", options);
    status_box_time.classList.add("time_up")
    status_box_time.innerText = date_string;

    setTimeout(() => {
        status_box_time.classList.remove("time_up")
    }, 600)
}

// Start Looping Functions
time();