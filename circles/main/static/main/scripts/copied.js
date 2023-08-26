function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

var copied_box = document.getElementById("main-copied-box")
var username_text = document.getElementById("main-user-box-profile-text-username")

username_text.addEventListener("click", copy)

async function copy() {
    let text = username_text.innerHTML;
    const copy_content = async () => {
        try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied to clipboard');
        } catch (err) {
        console.error('Failed to copy: ', err); // TODO: Change appearance if copy fail
        }
    }

    copy_content()

    copied_box.classList.add("copied")
    await sleep(5);
    copied_box.classList.remove("copied")
}

