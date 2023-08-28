var params = {
    fullscreen: true
};

var canvas = document.getElementById("main-canvas");
var two = new Two(params).appendTo(canvas);

var radius = 40;
var x = 200;
var y = 300;
var circle = two.makeCircle(x, y, radius);

console.log(two.width);
console.log(two.height);

// The object returned has many stylable properties:
circle.fill = 'orangered';
// And accepts all valid CSS color:
circle.stroke = 'red';
circle.linewidth = 2;

// Don’t forget to tell two to draw everything to the screen
two.update();