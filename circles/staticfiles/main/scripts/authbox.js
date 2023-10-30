/*
authbox.js
Handles everything for the main signup and login boxes
- Switches pages
- Handles buttons
- Makes requests for sign up and log in
*/


var background = document.getElementById("background-darkness")
var authbox = document.getElementById("auth-box")

var button_signup = document.getElementById("button_signup")
var button_login = document.getElementById("button_login")
var button_close = document.getElementById("auth-box-close")


var button_authbox_login = document.getElementById("auth-box-buttonbox-login")

var button_authbox_next_username = document.getElementById("auth-box-buttonbox-next-username")

var button_authbox_back_email = document.getElementById("auth-box-buttonbox-back-email")
var button_authbox_next_email = document.getElementById("auth-box-buttonbox-next-email")

var button_authbox_back_password = document.getElementById("auth-box-buttonbox-back-password")
var button_authbox_createaccount_password = document.getElementById("auth-box-buttonbox-createaccount-password")

button_authbox_login.disabled = true;
button_authbox_next_username.disabled = true;
button_authbox_next_email.disabled = true;
button_authbox_createaccount_password.disabled = true;

var box_login = document.getElementById("auth-box-login")
var box_username = document.getElementById("auth-box-username")
var box_email = document.getElementById("auth-box-email")
var box_password = document.getElementById("auth-box-password")

var header_label = document.getElementById("auth-box-text-label")
var header_server = document.getElementById("auth-box-text-server")

var textarea_login_username  = document.getElementById("auth-box-textarea-login-username")
var textarea_login_password  = document.getElementById("auth-box-textarea-login-password")
var textarea_username_username  = document.getElementById("auth-box-textarea-username-username")
var textarea_email_email  = document.getElementById("auth-box-textarea-email-email")
var textarea_password_password  = document.getElementById("auth-box-textarea-password-password")
var textarea_password_confirmpassword = document.getElementById("auth-box-textarea-password-confirmpassword")


var warning_box = document.getElementById("auth-box-login-warning")
var warning_box_text = document.getElementById("auth-box-login-warning-text")
warning_box.style.display = "none";

box_login.style.display = "none";
box_username.style.display = "none";
box_email.style.display = "none";
box_password.style.display = "none";

button_signup.addEventListener("click", signup)
button_login.addEventListener("click", login)
button_close.addEventListener("click", hide_auth_box)
background.addEventListener("click", hide_auth_box)

button_authbox_next_username.addEventListener("click", update_value_next)
button_authbox_next_email.addEventListener("click", update_value_next)

button_authbox_back_email.addEventListener("click", update_value_back)
button_authbox_back_password.addEventListener("click", update_value_back)

button_authbox_createaccount_password.addEventListener("click", create_account)
button_authbox_login.addEventListener("click", log_in)

textarea_username_username.addEventListener("input", check_username)
textarea_email_email.addEventListener("input", check_email)
textarea_password_password.addEventListener("input", check_password)
textarea_password_confirmpassword.addEventListener("input",confirm_password)

textarea_login_username.addEventListener("input", check_log_in)
textarea_login_password.addEventListener("input", check_log_in)

// window.addEventListener("keypress", check_enter_key(e)) Add enter key to advance

var screen = null; // 0 is login, 1 is username, 2 is email, 3 is password



function update_value_next() {
    if (screen == 1) { // in username, so go next
        box_username.style.display = "none";
        box_email.style.display = "inline";
    }

    if (screen == 2) { // in email, so go next
        box_email.style.display = "none";
        box_password.style.display = "inline";
    }

    if (screen == 3) { // Done with password, so create account
        box_password.style.display = "none";
    }

    screen++;
}

function update_value_back() {
    if (screen == 2) { // in email, so go back
        box_email.style.display = "none";
        box_username.style.display = "inline";
    }

    if (screen == 3) { // in password, so go back
        box_password.style.display = "none";
        box_email.style.display = "inline";
        
    }

    screen--;
}

function login() {
    show_auth_box()
    if (screen == null || screen != 0) {
        screen = 0;
        box_username.style.display = "none";
        box_email.style.display = "none";
        box_password.style.display = "none";
        box_login.style.display = "inline";
        header_label.innerHTML = "Log in to Circles"
        header_server.innerHTML = "Logging in to " + server_name;
    }   
}

function signup() {
    show_auth_box()
    if (screen == null || screen == 0) {
        screen = 1;
        box_login.style.display = "none";
        box_username.style.display = "inline"
        header_label.innerHTML = "Join Circles"
        header_server.innerHTML = "Creating an account at " + server_name;
    }
}


function show_auth_box() {   
    background.classList.remove("fade_out");
    authbox.classList.remove("fade_out_scale");

    background.style.display = "inline";
    authbox.style.display = "inline";


    background.classList.add("fade_in");
    authbox.classList.add("fade_in_scale");

}

function hide_auth_box() {
    background.classList.remove("fade_in");
    authbox.classList.remove("fade_in_scale");
    
    background.classList.add("fade_out");
    authbox.classList.add("fade_out_scale")

}

function check_username() {
    if (textarea_username_username.value == "") {
        button_authbox_next_username.disabled = true;
    }

    else {
        button_authbox_next_username.disabled = false;
    }
}

function check_email() {
    if (textarea_email_email.value != "") {
        if (textarea_email_email.value.includes("@")) {
            button_authbox_next_email.disabled = false;
        }
    }

    else {
        button_authbox_next_email.disabled = true;
    }
}


// 8 characters (0) capital (1) number (2) symbol (3)
function check_password() {
    var pwd = textarea_password_password.value;
    var strength = 0;
    const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "[", "]", "{", "}", "|", "/", "\\", "?", "~", "`", ">", "<", ":", ";", "\"", "'"];
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const capitals = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    var contains_symbols = symbols.some(el => pwd.includes(el))
    var contains_numbers = numbers.some(el => pwd.includes(el))
    var contains_capitals = capitals.some(el => pwd.includes(el))

    var segment_1 = document.getElementById("auth-box-password-validate-1")
    var segment_2 = document.getElementById("auth-box-password-validate-2")
    var segment_3 = document.getElementById("auth-box-password-validate-3")
    var segment_4 = document.getElementById("auth-box-password-validate-4")
    var password_strength = document.getElementById("auth-box-password-strength")

    button_authbox_createaccount_password.disabled = true;


    if (pwd.length >= 8) {
        strength++;
    }

    if (contains_symbols) {
        strength++;
    }

    if (contains_numbers) {
        strength++;
    }

    if (contains_capitals) {
        strength++;
    }

    var original_color = "rgba(66, 66, 66, 0.2)"

    if (strength == 1) {
        var background_color = "rgba(255, 82, 0, 0.2)"
        segment_1.style.backgroundColor = background_color
        segment_2.style.backgroundColor = original_color
        segment_3.style.backgroundColor = original_color
        segment_4.style.backgroundColor = original_color
        password_strength.innerHTML = "Weak Password"


    } else if (strength == 2) {
        var background_color = "rgba(255, 171, 0, 0.2)"
        segment_1.style.backgroundColor = background_color
        segment_2.style.backgroundColor = background_color
        segment_3.style.backgroundColor = original_color
        segment_4.style.backgroundColor = original_color
        password_strength.innerHTML = "Moderate Password"
        button_authbox_createaccount_password.disabled = false;

    } else if (strength == 3) {
        var background_color = "rgba(146, 255, 0, 0.2)"
        segment_1.style.backgroundColor = background_color
        segment_2.style.backgroundColor = background_color
        segment_3.style.backgroundColor = background_color
        segment_4.style.backgroundColor = original_color
        password_strength.innerHTML = "Good Password"
        button_authbox_createaccount_password.disabled = false;

    } else if (strength == 4) {
        var background_color = "rgba(11, 219, 0, 0.2)"
        segment_1.style.backgroundColor = background_color
        segment_2.style.backgroundColor = background_color
        segment_3.style.backgroundColor = background_color
        segment_4.style.backgroundColor = background_color
        password_strength.innerHTML = "Great Password"
        button_authbox_createaccount_password.disabled = false;

    }

    if (textarea_password_password.value == "") {
        password_strength.innerHTML = "No Password"
        segment_1.style.backgroundColor = original_color
        segment_2.style.backgroundColor = original_color
        segment_3.style.backgroundColor = original_color
        segment_4.style.backgroundColor = original_color
    }

    confirm_password();
}

function confirm_password(){
    var pwd = textarea_password_password.value;
    var conf = textarea_password_confirmpassword.value;

    if(conf !== pwd && pwd !== ''){
        button_authbox_createaccount_password.disabled = true;
    }else{
        button_authbox_createaccount_password.disabled = false;
    }

}

function check_log_in() {
    if (textarea_login_username.value != "" && textarea_login_password.value != "") {
        button_authbox_login.disabled = false;

    }

    else {
        button_authbox_login.disabled = true;
    }
}


function check_enter_key(e) { // TODO: Not working.
    if (e.enterKey) {
        if (screen == 1) {
            button_authbox_next_username.click()
        }
    }
}

async function create_account() {
    var username = textarea_username_username.value;
    var password = textarea_password_password.value;
    var email = textarea_email_email.value;
    

    var warning_box = document.getElementById("createaccount_warning_box")

    const response = await fetch(server_ip + "/authentication/createaccount", {
        method: "GET",
        headers: {
            "X-CSRFToken": document.querySelector('input[name="csrfmiddlewaretoken"]').value,
            "username": username,
            "password": password,
            "email": email
        }
    })

    response.text().then(function (text) {
        if (text.includes("<html>")) {
            window.location.href = server_ip + "/main";

        } else if (text == "Not whitelisted") {
            warning_box.innerHTML = "Your email is not whitelisted."
            warning_box.style.display = "block";
        }
    });
}

async function log_in() {
    var username = textarea_login_username.value;
    var password = textarea_login_password.value;
    const response = await fetch(server_ip + "/authentication/signin", {
        method: "GET",
        headers: {
            "X-CSRFToken": document.querySelector('input[name="csrfmiddlewaretoken"]').value,
            "username": username,
            "password": password,
        }
    })


    response.text().then(function (text) {

        if (text.includes("<html>")) {
            window.location.href = server_ip + "/main";

        } else if (text == "incorrect password") {
            warning_box_text.innerHTML = "Your password is incorrect."
            warning_box.style.display = "block";

        } else if (text == "no accounts exist") {
            warning_box_text.innerHTML = "That username does not exist!"
            warning_box.style.display = "block";
            
        } else if (text == "multiple accounts exist") {
            warning_box_text.innerHTML = "Uhhhhh somehow multiple accounts with that username exist. That shouldn't happen! Please contact me I'll fix it!"
            warning_box.style.display = "block";
            
        } else if (text == "missing headers and no session") {
            warning_box_text.innerHTML = "Something went wrong when signing you in. (Missing headers and no session token)"
            warning_box.style.display = "block";
            
        } else if (text == "request is not a get or post request") {
            warning_box_text.innerHTML = "For some reason your request wasn't a proper GET or POST request. This shouldn't happen, as I've specifically told it to make a GET request. Contact me, I don't know what's going on!"
            warning_box.style.display = "block";
            
        } else {
            warning_box_text.innerHTML = "There was a problem signing you in."
            warning_box.style.display = "block";
            
        }
    });


    
}
