// Final Project: Ray Tracing
// Name: Nick Scrivanich
// NetId: ns1284
// Goal:...

var vec = new Vector(22, 22, 22);
console.log(vec.getX());
// create an offscreen canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

const WIDTH = 1280;
const HEIGHT = 720;

var X = new Vector(1, 0, 0);
var Y = new Vector(0, 1, 0);
var Z = new Vector(0, 0, 1);

// size the canvas to your desired image
canvas.width = WIDTH;
canvas.height = HEIGHT;

// get the imageData and pixel array from the canvas
var imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
var data = imgData.data;

// manipulate some pixel elements
for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
        var pos = (y * WIDTH + x) * 4; // position in buffer based on x and y
        if ((x > 200 && x < 440) && (y > 200 && y < 280)) {
            data[pos] = 23;           // some R value [0, 255]
            data[pos + 1] = 222;           // some G value
            data[pos + 2] = 10;           // some B value
            data[pos + 3] = 255;             // set alpha channel

        }
        else {
            data[pos] = 0;           // some R value [0, 255]
            data[pos + 1] = 0;           // some G value
            data[pos + 2] = 0;           // some B value
            data[pos + 3] = 255;
        }


    }
}

/*var pos = (y * WIDTH + x) * 4; // position in buffer based on x and y
data[pos  ] = 255;           // some R value [0, 255]
data[pos+1] = ...;           // some G value
data[pos+2] = ...;           // some B value
data[pos+3] = 255;      
*/

// put the modified pixels back on the canvas
ctx.putImageData(imgData, 0, 0);

// create a new img object
var image = new Image();

// set the img.src to the canvas data url
image.src = canvas.toDataURL();

// append the new img object to the page
document.body.appendChild(image);



