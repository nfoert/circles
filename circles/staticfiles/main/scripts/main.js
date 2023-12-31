/*
main.js
Handles the main stuff for the client
- Recieving packets
- Three.js stuff
- Creating Users and Circles
- Handling user interaction (left click, right click, scroll)
*/


// Thanks to https://discoverthreejs.com/book/first-steps/responsive-design/

console.log(`

Circles

- github.com/nfoert/circles

Hello to all of us hackers who likes to open the console! Hack away! (Nicely)


`)

// ----------
// Initial functions
// ----------

// Thanks to Michael Zaporozhets' answer here https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
window.mobile_check = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function error(event) {
    show_notification("Exception Occured", event.message + "\n File: " + event.filename + " \nLine " + event.lineno + " Column " + event.colno, "normal", true);
    set_notification_color(255, 0, 0);
};

window.addEventListener("error", (event) => error(event));

request_system_notification_permission();

// Thanks to PurkkaKoodari's answer here https://stackoverflow.com/questions/23181243/throttling-a-mousemove-event-to-fire-no-more-than-5-times-a-second
var mouse_coordinates_wait = false;

document.addEventListener("mousemove", (event) => {
    if (!mouse_coordinates_wait) {
        window.mouseX = event.clientX;
        window.mouseY = event.clientY;

        mouse_coordinates_wait = true;

        setTimeout(() => {
            mouse_coordinates_wait = false;

        }, 1000 / 5); // Number of times per second
        
    }
    
});

// ----------
// three.js
// ----------

// Main
const scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 5000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("main-canvas").appendChild(renderer.domElement);

scene.background = new THREE.Color("rgb(53, 54, 62)");

// Create base plane
const plane_geometry = new THREE.PlaneGeometry(50000, 30000);
const plane_material = new THREE.MeshBasicMaterial({ color: "rgb(54, 54, 62)" });
const plane = new THREE.Mesh(plane_geometry, plane_material)
scene.add(plane)

// Camera zoom setup
camera.zoom = 0.5;
camera.updateProjectionMatrix();
camera.position.z = 1000;

// Start the loop
// Thanks to mrdoob's answer here https://stackoverflow.com/questions/11285065/limiting-framerate-in-three-js-to-increase-performance-requestanimationframe
// Thanks to Cory Gross's answer here https://stackoverflow.com/questions/11170952/threejs-orthographic-camera-adjusting-size-of-scene-to-window
function animate() {
    if (!(document.hidden)) {
        setTimeout(() => {
            requestAnimationFrame(animate);
    
        }, 1000 / 60); // Limit to 60 fps

    } else if (document.hidden) {
        log_info("Fps reduced")
        setTimeout(() => {
            requestAnimationFrame(animate);
    
        }, 1000 / 1); // Limit to 1 fps
    }
    
    renderer.render(scene, camera);
}
animate();

// ----------
// Interaction Events
// ----------
// Click
document.getElementById("main-canvas").addEventListener("wheel", (event) => zoom(event))

document.getElementById("main-canvas").addEventListener('contextmenu', (event) => block_context_menu(event));
document.getElementById("main-canvas").addEventListener('mousedown', right_click);
document.getElementById("main-canvas").addEventListener("mousedown", left_click);
document.addEventListener('mouseup', right_click_up);

// Touch
addEventListener("touchstart", touch_start);
addEventListener("touchend", touch_end);
addEventListener("touchcancel", touch_cancel);
addEventListener("touchmove", touch_move);

// ----------
// Initial Variables
// ----------
var scale = 0.5; // 0 smallest, 1 largest
var users = [];
var circles = [];

// ----------
// Window Resize
// ----------
// Thanks to Shawn Whinnery's answer here https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    const camFactor = 2;

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.left = -window.innerWidth / camFactor;
    camera.right = window.innerWidth / camFactor;
    camera.top = window.innerHeight / camFactor;
    camera.bottom = -window.innerHeight / camFactor;

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ----------
// Classes
// ----------

class User {
    constructor() {

    }

    draw() {
        const circle_geometry = new THREE.CircleGeometry(55, 55);
        const circle_material = new THREE.MeshBasicMaterial({ color: this.primary_color });
        this.circle = new THREE.Mesh(circle_geometry, circle_material);

        this.group = new THREE.Group();
        this.group.add(this.circle)
        scene.add(this.group);

        this.circle.position.z = 2;
        this.circle.scale.set(0, 0, 0);

        var scale = { x: 0, y: 0, z: 0 }

        let isAnimating = true;

        const scale_animation = new TWEEN.Tween(scale)
            .to({ x: 1, y: 1, z: 1 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                this.circle.scale.set(scale.x, scale.y, scale.z)
            })
            .delay(0)
            .start()
            .onComplete(() => {
                isAnimating = false;
            })


        function animate(time) {
            if (isAnimating) {
                TWEEN.update(time)
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate)

        this.circle.position.x = this.x;
        this.circle.position.y = this.y;

        update_position_indicator();
    }

    move() {
        this.server_update_position();

        let isAnimating = true;

        const move_animation = new TWEEN.Tween(this.coords_before_move)
            .to({ x: this.x, y: this.y }, 250)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.circle.position.x = this.coords_before_move.x;
                this.circle.position.y = this.coords_before_move.y;
            })
            .start()
            .onComplete(() => {
                isAnimating = false;
            })

        function animate(time) {
            if (isAnimating) {
                TWEEN.update(time)
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate)


        for (circle in circles) {
            const difference_x = Math.abs(this.x - circles[circle].x)
            const difference_y = Math.abs(this.y - circles[circle].y)

            if (difference_x < 150 && difference_y < 150) {
                if (this.switching_circle == false || this.switching_circle == undefined) {

                    const change_circle_json = {
                        "type": "change_circle",
                        "direction": "forwards",
                        "name": circles[circle].name
                    }

                    server_socket.send(JSON.stringify(change_circle_json))
                
                } else {
                    this.x = this.x + 100
                }


            }
        }
    }

    server_update_position() {
        const json = {
            "type": "position_update",
            "x": Math.round(this.x),
            "y": Math.round(this.y),
        }

        var position_json = JSON.stringify(json)

        server_socket.send(position_json)
    }

    move_camera_to_me() {
        let isAnimating = true;
        var camera_position = { x: camera.position.x, y: camera.position.y }

        const move_animation = new TWEEN.Tween(camera_position)
            .to({ x: this.x, y: this.y }, 250)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                camera.position.x = camera_position.x;
                camera.position.y = camera_position.y;
            })
            .start()
            .onComplete(() => {
                isAnimating = false;
            })

        function animate(time) {
            if (isAnimating) {
                TWEEN.update(time)
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate)
    }

    get_setting(key, normal) {
        if (me.settings[key] != undefined) {
            return me.settings[key];
        
        } else {
            this.set_setting(key, normal);
            return normal;
        }
    }

    set_setting(key, value) {
        this.settings[key] = value;

        let set_setting_json = {
            "type": "set_setting",
            "key": key,
            "value": value,
        }

        server_socket.send(JSON.stringify(set_setting_json));

        return value;
    }

    get_stat(key, normal) {
        if (me.stats[key] != undefined) {
            return me.stats[key];
        
        } else {
            this.set_stat(key, normal);
            return normal;
        }
    }

    set_stat(key, value) {
        this.stats[key] = value;

        let set_stat_json = {
            "type": "set_stat",
            "key": key,
            "value": value,
        }

        server_socket.send(JSON.stringify(set_stat_json));

        return value;
    }

}
class OtherUser {
    constructor() {

    }

    draw() {
        const circle_geometry = new THREE.CircleGeometry(50, 50);
        const circle_material = new THREE.MeshBasicMaterial({ color: this.primary_color });
        const text_material = new THREE.MeshBasicMaterial({ color:0xffffff, transparent: true, opacity: 0.7 })
        this.circle = new THREE.Mesh(circle_geometry, circle_material);

        this.group = new THREE.Group();
        this.group.position.x = this.x;
        this.group.position.y = this.y;

        const loader = new FontLoader();

        loader.load("/static/main/fonts/Arciform_Regular.json", (font) => {

            const text_geometry = new TextGeometry( this.username, { 
                font: font, 
                size: 20,
                curveSegments: 30,
                bevelEnabled: false,
            });

            this.text = new THREE.Mesh(text_geometry, text_material)
            
            // TODO: Center the text inside the circle!
            this.group.add(this.text);

            this.text.position.x = this.circle.position.x - 50;
            this.text.position.y = this.circle.position.y + 60;

        });


        this.group.add(this.circle);
        scene.add(this.group);

        this.circle.position.z = 1;

        this.group.scale.set(0, 0, 0);

        var scale = { x: 0, y: 0, z: 0 }

        let isAnimating = true;

        const scale_animation = new TWEEN.Tween(scale)
            .to({ x: 1, y: 1, z: 1 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                this.group.scale.set(scale.x, scale.y, scale.z)
            })
            .delay(Math.random() * 1000)
            .start()
            .onComplete(() => {
                isAnimating = false;
            })

        function animate(time) {
            if (isAnimating) {
                TWEEN.update(time)
            }

            requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)

        this.group.position.x = this.x;
        this.group.position.y = this.y;

    }

    move() {
        let isAnimating = true;

        const move_animation = new TWEEN.Tween(this.coords_before_move)
            .to({ x: this.x, y: this.y }, 250)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.group.position.x = this.coords_before_move.x;
                this.group.position.y = this.coords_before_move.y;
            })
            .start()
            .onComplete(() => {
                isAnimating = false;
            })
        

        function animate(time) {
            if (isAnimating) {
                TWEEN.update(time)
            }

            requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }

    dispose() {
        this.group.scale.set(1, 1, 1);

        var scale = { x: 1, y: 1, z: 1 }

        let isAnimating = true;

        const scale_animation = new TWEEN.Tween(scale)
            .to({ x: 0, y: 0, z: 0 }, 1000)
            .easing(TWEEN.Easing.Elastic.In)
            .onUpdate(() => {
                this.group.scale.set(scale.x, scale.y, scale.z)
            })
            .delay(Math.random() * 500)
            .start()
            .onComplete(() => {
                isAnimating = false;
                this.circle.geometry.dispose();
                this.circle.material.dispose();

                this.text.geometry.dispose();
                this.text.material.dispose();

                scene.remove(this.group);
            })

        
        function animate(time) {
            if (isAnimating) {
                TWEEN.update(time)
                requestAnimationFrame(animate);
            }
        }

        log_info(`Removed user ${this.username}`);

    }
}
class Circle {
    constructor() {

    }

    check_other_circle_proximity() {
        // If a neighboring Circle is too close, move me so they don't intersect
        const move_distance = 300; // 250 is minimum with the curerent size of the Circle, make this larger for more space in between them

        for (circle in circles) {
                if (circles[circle].name != this.name) {
                const difference_x = Math.abs(this.x - circles[circle].x)
                const difference_y = Math.abs(this.y - circles[circle].y)

                if (difference_x < move_distance) {
                    this.x = this.x + (move_distance - difference_x);
                }

                if (difference_y < move_distance) {
                    this.y = this.y + (move_distance - difference_y);
                }
            }
        }
    }

    draw() {
        this.check_other_circle_proximity();

        const loader = new FontLoader();

        const circle_geometry = new THREE.RingGeometry(150, 170, 50);
        const circle_material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        this.circle = new THREE.Mesh(circle_geometry, circle_material);

        this.group = new THREE.Group();
        this.group.position.x = this.x;
        this.group.position.y = this.y;

        
        loader.load("/static/main/fonts/Arciform_Regular.json", (font) => {

            const text_geometry = new TextGeometry( this.name, { 
                font: font, 
                size: 30,
                curveSegments: 30,
                bevelEnabled: false,
            });

            this.text = new THREE.Mesh(text_geometry, circle_material)
            
            this.group.add(this.text);

            // TODO: Position in center of circle
            this.text.position.x = this.circle.position.x - 130;
            this.text.position.y = this.circle.position.y;
            
        });

        this.group.add(this.circle);
        scene.add(this.group);
        
        this.circle.position.z = 1;

        this.group.scale.set(0, 0, 0);

        var scale = { x: 0, y: 0, z: 0 }

        let isAnimating = true;

        const scale_animation = new TWEEN.Tween(scale)
            .to({ x: 1, y: 1, z: 1 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                this.group.scale.set(scale.x, scale.y, scale.z)
            })
            .delay(Math.random() * 1000)
            .start()
            .onComplete(() => {
                isAnimating = false;
            })


        function animate(time) {
            if (isAnimating) {
                TWEEN.update(time)
            }

            requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)

    }

    dispose() {
        this.group.scale.set(1, 1, 1);

        var scale = { x: 1, y: 1, z: 1 }

        let isAnimating = true;

        const dispose_animation = new TWEEN.Tween(scale)
            .to({ x: 0, y: 0, z: 0 }, 1000)
            .easing(TWEEN.Easing.Elastic.In)
            .onUpdate(() => {
                this.group.scale.set(scale.x, scale.y, scale.z)
            })
            .start()
            .onComplete(() => {
                isAnimating = false;
                this.circle.geometry.dispose();
                this.circle.material.dispose();

                scene.remove(this.group);
            })



        function animate(time) {
            if (isAnimating) {
                TWEEN.update(time)
            }

            requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }
}

// ----------
// Utility Functions
// ----------

function render_circles(json) {
    for (circle in json["circles"]) {
        var new_circle = new Circle();
        new_circle.x = json["circles"][circle]["x"]
        new_circle.y = json["circles"][circle]["y"]
        new_circle.name = json["circles"][circle]["name"]

        circles.push(new_circle)
    }


    for (circle in circles) {
        circles[circle].draw();
    }
}

function set_user_box_colors(primary, secondary) {
    let profile_circle = document.getElementById("main-user-box-profile-circle")
    let profile_background = document.getElementById("main-user-box")

    profile_circle.style.backgroundColor = primary + "40";
    // profile_background.style.backgroundColor = secondary + "20"; // Don't change the background color. Change this eventually?
}

// ----------
// Interaction Event Functions
// ----------

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

    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

// Thanks to WestLangley's answer here https://stackoverflow.com/questions/20314486/how-to-perform-zoom-with-a-orthographic-projection
function zoom_amount(amount) { // TODO: Animate
    scale = Math.round(scale * 100) / 100;
    scale = scale + (amount/100)

    if (scale > 1) {
        scale = 1;

    } else if (scale < 0.1) {
        scale = 0.1;
    }

    camera.zoom = scale;

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

        close_userdetails();

        document.addEventListener("mousemove", right_click_logic);

        
    }


}

function right_click_up(event) {
    if (event.button === 2 && right_mouse_down) {
        right_mouse_down = false;

        document.removeEventListener("mousemove", right_click_logic);
    }
}

function left_click(event) {
    if (event.button === 0) {

        try {
            me.coords_before_move = { x: me.circle.position.x, y: me.circle.position.y }

            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
    
            const intersects = raycaster.intersectObject(plane);
    
            if (users.length == 0) {
                const intersectionPoint = intersects[0].point;
    
                if (intersects.length > 0) {
                    const intersectionPoint = intersects[0].point;
        
                    me.x = Math.round(intersectionPoint.x);
                    me.y = Math.round(intersectionPoint.y);
        
                    me.move();
        
                }
            }
    
            for (user in users) {
                const intersectionPoint = intersects[0].point;
    
                if (Math.abs(users[user].x - intersectionPoint.x) < 50 && Math.abs(users[user].y - intersectionPoint.y) < 50) { // Is there a user close to the cursor position?
                    request_userdetails(users[user].username);
                    break;
                
                } else {
                    if (intersects.length > 0) {
                        const intersectionPoint = intersects[0].point;
            
                        me.x = Math.round(intersectionPoint.x);
                        me.y = Math.round(intersectionPoint.y);
            
                        me.move();
            
                    }
                }
            } 
        } catch (TypeError) {
            return false;
        }
        
    }
}

// ----------
// Touch Event Functions
// ----------

const touches = [];

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < touches.length; i++) {
        const id = touches[i].identifier;

        if (id === idToFind) {
            return i;
        }
    }
    return -1; // not found
}

function touch_start(event) {    
    log_info("Touch start")
    touches.push(event.changedTouches[0])
}

function touch_end(event) {
    if (event.changedTouches.length == 1) {
        log_info("Tap end")

        let index = ongoingTouchIndexById(event.changedTouches[0].identifier);
        touches.splice(index, 1)

        left_click(event);

    } else if (event.changedTouches.length == 2) {
        log_info("pinch end")
    }
    
}

function touch_move(event) {
    const touches_changed = event.changedTouches;

    if (event.changedTouches.length == 1) {
        log_info("Touch drag " + touches_changed[0].identifier)
    }

}

function touch_cancel(event) {
    log_info("Touch canceled")
}

// ----------
// WebSocket
// ----------

var me = new User();
var circle_to_switch_to = "";
var background_blur = document.getElementById("main-backgroundblur")

show_notification('<i class="ph-bold ph-spinner-gap"></i> Connecting..', "Connecting...", "status", false);
set_notification_color(53, 134, 255);
status_loading();

function user_exists_in_client(username) {
    return users.some(user => user.username === username);
}

function get_user_exists_in_client(username) {
    return users.find(user => user.username === username);
}
let url;

if (production == "True") {
    url = "wss://" + server_ip.replace("http://", "").replace("https://", "") + "/main/";

} else if (production == "False") {
    url = "ws://" + server_ip.replace("http://", "").replace("https://", "") + "/main/";
}

log_connection("Creating WebSocket...");
var server_socket = new WebSocket(url);

server_socket.onmessage = function (e) {
    const json = JSON.parse(e.data);
    log_connection_packet(`Recieved packet '${json["type"]}'`)

    if (json["type"] == "initial_message") {
        let messages_input_box = document.getElementById("main-messages-box-input-textarea");
        me.x = json["x"];
        me.y = json["y"];
        me.location_server = json["location_server"];
        me.location_circle = json["location_circle"];
        me.username = json["username"];
        me.display_name = json["display_name"];
        me.bio = json["bio"];
        me.pronouns = json["pronouns"];
        me.primary_color = json["primary_color"];
        me.secondary_color = json["secondary_color"];
        me.settings = json["settings"];
        me.stats = json["stats"];
        me.draw();

        set_user_box_colors(json["primary_color"], json["secondary_color"]);

        if (json["current_conversation"]["type"] == "normal") {
            messages_input_box.placeholder = json["current_conversation"]["name"];
        
        } else if (json["current_conversation"]["type"] == "circle") {
            messages_input_box.placeholder = "Messages from current Circle";

        } else if (json["current_conversation"]["type"] == "server") {
            messages_input_box.placeholder = "Messages from circles.media"; // TODO: Change based off of actual server name
        }

        render_circles(json);

        if (me.get_setting("show_version_warning", true) == false) {
            document.getElementById("version-warning").style.opacity = "0";
        }

        if (me.get_setting("show_controls_on_start", true) == false) {
            document.getElementById("controls").style.display = "none";
        }


    } else if (json["type"] == "users_update") {
        var users_used = [];
        // If user in list "users" doesn't exist already, create it
        for (const user in json["users"]) { // For each user object in the server's message
            if (!user_exists_in_client(json["users"][user]["username"])) {
                user_class = new OtherUser();
                user_class.username = json["users"][user]["username"];
                user_class.display_name = json["users"][user]["display_name"]
                user_class.primary_color = json["users"][user]["primary_color"]
                user_class.secondary_color = json["users"][user]["secondary_color"]
                user_class.x = json["users"][user]["x"];
                user_class.y = json["users"][user]["y"];
                user_class.location_circle = me.location_circle;

                users.push(user_class);
                users_used.push(user_class);

                user_class.draw();
                log_info(`Created user '${user_class.username}'`)

            } else if (user_exists_in_client(json["users"][user]["username"])) { // User is online
                var user_that_exists = json["users"][user];
                var existing_user = get_user_exists_in_client(user_that_exists["username"]);

                get_user_exists_in_client(user_that_exists["username"]).coords_before_move = { x: existing_user.x, y: existing_user.y } // set the last coords first
                get_user_exists_in_client(user_that_exists["username"]).x = user_that_exists["x"] // set the coords of it now
                get_user_exists_in_client(user_that_exists["username"]).y = user_that_exists["y"]
                get_user_exists_in_client(user_that_exists["username"]).move();

                users_used.push(existing_user)

            }

        }

        for (user in users) {
            try {
                if (users_used[user].username == users[user].username) {
                    null

                } else {
                    users[user].dispose();
                    users.splice(users.indexOf(users[user]), 1);
                }

            } catch {
                users[user].dispose();
                users.splice(users.indexOf(users[user]), 1);
            }
        }


    } else if (json["type"] == "username_search_results") {
        render_username_search(json["users"])

    } else if (json["type"] == "user_conversations") {
        render_users_conversations(json)

    } else if (json["type"] == "recent_messages") {
        render_recent_messages(json)

    } else if (json["type"] == "new_messages") {
        render_new_messages(json)

    } else if (json["type"] == "circles_in_circle") {
        me.switching_circle = true;
        for (circle in circles) {
            circles[circle].dispose();
        }

        circles = [];

        setTimeout(function () {
            render_circles(json);
        }, 750);
        
        me.x = 0;
        me.y = 0;
        setTimeout(function () {
            me.move();
        }, 500);

        me.switching_circle = false;

    } else if (json["type"] == "current_location") {
        me.location_server = json["server"]
        me.location_circle = json["circle"]
        update_position_indicator();

        
    } else if (json["type"] == "user_counts") {
        update_user_count(json);

    } else if (json["type"] == "userdetails") {
        render_userdetails(json);

    } else if (json["type"] == "notification") {
        show_notification(json["title"], json["text"], json["style"])

    } else if (json["type"] == "new_conversations") {
        if (json["conversations"].length != 0) {
            get_users_conversations_request();
            show_notification("New Conversation", "You've been added to a new Conversation", "normal");
        
        } else {
            get_users_conversations_request();
            show_notification("Conversation Deleted", "You were removed from a Conversation", "normal");

        }

    } else if (json["type"] == "profile_details") {
        render_profile_details(json);

    } else if (json["type"] == "all_settings") {
        me.settings = json["settings"];

    } else if (json["type"] == "all_stats") {
        me.stats = json["stats"];

    } else if (json["type"] == "notifications") {
        render_notifications(json["notifications"])

    } else {
        log_warn("[WARN] Recieved a packet from the server that is not known: " + json["type"])
    }
};

server_socket.onclose = function (e) {
    log_connection_close("Connection closed.")
    log_critical("Websocket disconnected.")
    if (e.wasClean) {
        background_blur.style.display = "inline";
        background_blur.classList.add("fade_in_bg")

        show_notification('<i class="ph-bold ph-x-circle"></i> Disconnected', "Disconnected", "status", false);
        set_notification_color(252, 56, 56);
        status_error();

        console.error('Chat socket closed unexpectedly');

        document.getElementById("loading-screen").classList.add("hide-loading-screen");
        setTimeout(function() {
            document.getElementById("loading-screen").style.display = "none";
        }, 1600)
    } else {
        background_blur.style.display = "inline";
        background_blur.classList.add("fade_in_bg")

        show_notification('<i class="ph-bold ph-x-circle"></i> Failed to connect', "Failed to connect.", "status", false);
        set_notification_color(252, 56, 56);
        status_error();

        console.error('Chat socket closed unexpectedly');

        document.getElementById("loading-screen").classList.add("hide-loading-screen");
        setTimeout(function() {
            document.getElementById("loading-screen").style.display = "none";
        }, 1600)
    }
};

server_socket.onopen = async function (e) {
    log_connection("Connection opened");
    set_notification_title("<i class='ph-bold ph-check-circle'></i> Connected");
    set_notification_color(4, 223, 33);
    status_done();

    // Temorary Holiday Notification
    setTimeout(function() {
        show_notification('<i class="ph-bold ph-gift"></i> Happy Holidays!', "Happy Holidays!", "status", false);
        set_notification_color(254, 141, 141);
    }, 3000);

    get_users_conversations_request();

    document.getElementById("loading-screen").classList.add("hide-loading-screen");

    setTimeout(function() {
        document.getElementById("loading-screen").style.display = "none";
    }, 1600)

    // Show information for the Open Alpha
    setTimeout(function() {
        render_dialog("alpha"); 
        show_dialog();
    }, 1000)
    

};
