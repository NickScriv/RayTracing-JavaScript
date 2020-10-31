// Final Project: Ray Tracing
// Name: Nick Scrivanich
// NetId: ns1284
// Goal:...

// create a canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// width and height of final image
const WIDTH = 900;
const HEIGHT = 900;
const aspectRatio = WIDTH / HEIGHT;

// size the canvas to your desired image
canvas.width = WIDTH;
canvas.height = HEIGHT;

// get the imageData and pixel array from the canvas
var imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
var data = imgData.data;

// basis vectors
var X = new Vector(1, 0, 0);
var Y = new Vector(0, 1, 0);
var Z = new Vector(0, 0, 1);

// origin
var O = new Vector(0, 0, 0);

// TODO: Make camera position user defined.
var cameraPosition = new Vector(3, 1.5, -4);

// position for camera to look at, TODO: make this user defined
var lookAt = new Vector(0, 0, 0);

// vector between camera position and position to look at
var btwVec = new Vector(cameraPosition.subtract(lookAt));

// direction in which the camera looks
var cameraDir = btwVec.negative().unit();

// right local axis of the camera
var cameraRight = Y.cross(cameraDir).unit();

// down local axis of camera
var cameraDown = cameraRight.cross(cameraDir);

//create camera with its coordinate frame
var camera = new Camera(cameraPosition, cameraDir, cameraRight, cameraDown);

// add colors
var whiteLight = new Color(1.0, 1.0, 1.0, 0);
var green = new Color(0.5, 1.0, 0.5, 0.3);
var gray = new Color(0.5, 0.5, 0.5, 0);
var black = new Color(0, 0, 0, 0);

//light position, TODO: make this user defined
var lightPos = new Vector(-7, 10, -10);

//define light
var light = new Light(lightPos, whiteLight);


// sphere position, TODO: make this user defined
var centerSphere = new Vector(0, 0, 0);

// create sphere
var sphere = new Sphere(centerSphere, 1, green);

// create plane
var plane = new Plane(Y, -1, gray);

// offset for each pixel
var xAmount;
var yAmount;

// manipulate some pixel elements
for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {

        // start firing rays where the origin of the ray is the camera's origin 
        //and the direction is the vector from the camera's origin to the center of the pixel
        xAmount = (x + 0.5) / WIDTH;
        yAmount = ((HEIGHT - y) + 0.5) / HEIGHT;

        var cameraRayOrigin = cameraPosition;
        var camRayDir = cameraDir.add(cameraRight.multiply(xAmount - 0.5).add(cameraDown.multiply(yAmount - 0.5))).unit();

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



