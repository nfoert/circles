/*
logging.js
A simple way to log information for the client.
*/

// Thanks to christianvuering's answer here https://stackoverflow.com/questions/7505623/colors-in-javascript-console

function log_date() {
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, "timeZone": "EST" };
    var now = new Date;
    var string = now.toLocaleTimeString("en-us", options);
    return string;
}

function log_info(text) {
    let date = log_date();
    console.log("%c[" + date + "] [INFO] > " + text, "color: #99A7F7; font-weight: bold;")
}

function log_warn(text) {
    let date = log_date();
    console.log("%c[" + date + "] [WARN] > " + text, "color: #FFCF1E; font-weight: bold;")
}

function log_critical(text) {
    let date = log_date();
    console.log("%c[" + date + "] [CRITICAL] > " + text, "color: #FF401E; font-weight: bold;")
}

function log_connection(text) {
    let date = log_date();
    console.log("%c[" + date + "] [CONNECTION] > " + text, "color: #1AF87F; font-weight: bold;")
}