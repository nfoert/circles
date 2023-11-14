/*
copied.js
Handles the action of clicking the User's username and copying it to the clipboard
*/

var copied_box = document.getElementById("main-copied-box");
var username_text = document.getElementById("main-user-box-profile-text-username");

username_text.addEventListener("click", copy);

async function copy() {
    let text = username_text.innerHTML;
    const copy_content = async () => {
        try {
            await navigator.clipboard.writeText(text);
            log_info(`Copied to clipboard '${text}'`)

        } catch (err) {
            console.error('Failed to copy: ', err); // TODO: Change appearance if copy fail

        }
    }

    copy_content();

    copied_box.classList.add("copied");
    
    setTimeout(() => {
        copied_box.classList.remove("copied");
    }, 5000);
    
}

