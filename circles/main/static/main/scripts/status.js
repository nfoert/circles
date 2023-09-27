let status_box = document.getElementById("main-status-box")
let status_box_notifications = document.getElementById("main-status-box-notifications")
let status_box_status = document.getElementById("main-status-box-status")
let status_box_time = document.getElementById("main-status-box-time")

let spin = false;
let spin_number = 0

function status_done() {
    console.log("Done!")
    status_box_status.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-check-circle"></i>'
}

function status_loading() {
    console.log("Loading!")
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
    console.log("Error!")
    status_box_status.innerHTML = '<i id="main-status-box-status" class="ph-bold ph-warning"></i>'
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

time();