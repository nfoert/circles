const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 5000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("main-canvas").appendChild(renderer.domElement);

const gui = new dat.GUI();


scene.background = new THREE.Color("rgb(53, 54, 62)");


const plane_geometry = new THREE.PlaneGeometry(50000, 30000);
const plane_material = new THREE.MeshBasicMaterial({ color: "rgb(54, 54, 62)" });
const plane = new THREE.Mesh(plane_geometry, plane_material)
scene.add(plane)
plane.recieveShadow = true;

camera.zoom = 0.5;
camera.updateProjectionMatrix();
camera.position.z = 1000;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

addEventListener("wheel", (event) => zoom(event))

document.getElementById("main-canvas").addEventListener('contextmenu', (event) => block_context_menu(event));
document.addEventListener('mousedown', right_click);
document.addEventListener('mouseup', right_click_up);


scale = 0.5; // 0 smallest, 1 largest

// Thanks to Shawn Whinnery's answer here https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


class User {
    constructor() {

    }

    draw() {
        const circle_geometry = new THREE.CircleGeometry(50, 50);
        const circle_material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.circle = new THREE.Mesh(circle_geometry, circle_material);
        scene.add(this.circle);
        this.circle.position.z = 1;

        this.circle.position.x = this.x;
        this.circle.position.y = this.y;
    }

    re_draw() {
        this.circle.position.x = this.x;
        this.circle.position.y = this.y;
    }
}

// Thanks to WestLangley's answer here https://stackoverflow.com/questions/20314486/how-to-perform-zoom-with-a-orthographic-projection
function zoom(e) {
    scale = Math.round(scale * 100) / 100;
    if (e.deltaY > 0) {
        scale = scale - 0.02;

    } else {
        scale = scale + 0.02;
    }

    if (scale > 1) {
        scale = 1;

    } else if (scale < 0.1) {
        scale = 0.1;
    }

    camera.zoom = scale;
    
    console.log(scale)
    console.log(camera.zoom)

    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

// Thanks to Chase Finch's answer here https://stackoverflow.com/questions/4235426/how-can-i-capture-the-right-click-event-in-javascript
function block_context_menu(event) {
    event.preventDefault();

    return false;
}

var right_mouse_down = false;
var mouse_now_x = 0;
var mouse_now_y = 0;

var camera_start_x = camera.position.x;
var camera_start_y = camera.position.y;

function right_click_logic(event) {
    if (right_mouse_down) {
        const moved_x = mouse_now_x - event.clientX;
        const moved_y = mouse_now_y - event.clientY;

        if (moved_x || moved_y) {
            camera.position.x = camera_start_x + moved_x;
            camera.position.y = camera_start_y - moved_y; // Note the subtraction here
            camera.updateProjectionMatrix();
        }
    }

    requestAnimationFrame(right_click_logic);
}

var right_click_mouse_move_function = function right_click_mouse_move(event) {
    mouse_now_x = event.clientX;
    mouse_now_y = event.clientY;

}

async function right_click(event) {
    if (event.button === 2) {
        right_mouse_down = true;
        mouse_now_x = event.clientX;
        mouse_now_y = event.clientY;
        camera_start_x = camera.position.x; // Update the starting camera position
        camera_start_y = camera.position.y; // Update the starting camera position
        document.addEventListener("mousemove", right_click_logic);
    }
    
    
}

function right_click_up(event) {
    if (event.button === 2 && right_mouse_down) {
        console.log("up")
        right_mouse_down = false;

        document.removeEventListener("mousemove", right_click_logic);
    }
}

var me = new User();

var main_connecting_box = document.getElementById("main-connecting-box")
var main_connecting_box_text = document.getElementById("main-connecting-box-text")
var background_blur = document.getElementById("main-backgroundblur")

main_connecting_box.style.display = "flex";
main_connecting_box.classList.add("slide_from_top");
main_connecting_box.style.backgroundColor = "rgba(53, 134, 255, 0.2)"

function hide_box() {
    main_connecting_box.classList.remove("slide_from_top");
    main_connecting_box.classList.add("slide_to_top");
    main_connecting_box.style.display = "flex";
};

const chatSocket = new WebSocket("ws://127.0.0.1:8000/main/");

chatSocket.onmessage = function (e) {

    const json = JSON.parse(e.data);

    if (json["type"] == "initial_message") {
        me.x = json["x"]
        me.y = json["y"]
        me.location_server = json["location_server"]
        me.location_circle = json["location_circle"]
        me.draw()

    } else if (json["type"] == "update") {

    }
};

chatSocket.onclose = function (e) {
    main_connecting_box.classList.add("slide_from_top");
    main_connecting_box_text.innerHTML = "Failed to connect ✘"
    main_connecting_box.style.backgroundColor = "rgba(252, 56, 56, 0.2)"
    background_blur.style.display = "inline";
    background_blur.classList.add("fade_in_bg")

    console.error('Chat socket closed unexpectedly');
};

chatSocket.onopen = async function (e) {

    main_connecting_box_text.innerHTML = "Connected ✔"
    main_connecting_box.style.backgroundColor = "rgba(4, 223, 33, 0.2)"
    setTimeout(() => hide_box(), 3000)
    main_connecting_box.classList.remove("slide_to_top");

}
