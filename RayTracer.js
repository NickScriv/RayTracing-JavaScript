// Final Project: Ray Tracing
// Name: Nick Scrivanich
// NetId: ns1284
// Goal:...

// create a canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// width and height of final image
const WIDTH = 1280;
const HEIGHT = 720;
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
var cameraPosition = new Vector(-3, 2, 4);

// position for camera to look at, TODO: make this user defined
var target = new Vector(0, 2, 0);

// vector between camera position and position to look at
var diffVec = new Vector(target.subtract(cameraPosition));

// forwad vector of camera
var cameraForward = diffVec.unit();

// right vector of the camera
var cameraRight = cameraForward.cross(Y).unit();

// up vector of camera
var cameraUp = cameraRight.cross(cameraForward);

//create camera with its coordinate frame
var camera = new Camera(cameraPosition, cameraForward, cameraRight, cameraUp, Math.PI / 4, aspectRatio);

// add colors
var whiteLight = new Color(1.0, 1.0, 1.0, 0);
var green = new Color(0.5, 1.0, 0.5, 0.3);
var gray = new Color(0.5, 0.5, 0.5, 0);
var black = new Color(0, 0, 0, 0);

//--------------OBJECTS------------------------------------------------
var objects = [];

//light position, TODO: make this user defined
var lightPos = new Vector(-7, 10, -10);

//define light
var light = new Light(lightPos, whiteLight);


// sphere position, TODO: make this user defined
var centerSphere = new Vector(0, 2, 0);

// create sphere
var sphere = new Sphere(centerSphere, 1, green);

// create plane
var plane = new Plane(new Vector(0, 0, 0), Y, gray);

objects.push(sphere);
objects.push(plane);
//--------------------------------------------------------------

// manipulate some pixel elements
for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {

        // start firing rays where the origin of the ray is the camera's origin 
        //and the direction is the vector from the camera's origin to the center of the pixel
        /*xAmount = (x + 0.5) / WIDTH;
        yAmount = ((HEIGHT - y) + 0.5) / HEIGHT;

        var cameraRayOrigin = cameraPosition;
        var camRayDir = cameraDir.add(cameraRight.multiply(xAmount - 0.5).add(cameraDown.multiply(yAmount - 0.5))).unit();*/
        // translate pixel coordinate so it is in the range of [-1, 1]
        var u = (2.0 * x) / WIDTH - 1.0;
        var v = (-2.0 * y) / HEIGHT + 1.0;
        //console.log(u + " " + v)

        // shoot the ray
        var ray = camera.shootRay(u, v);
        //console.log(ray.direction.x + " " + ray.direction.y + " " + ray.direction.z)
        var intersections = [];

        // loop through all objects defined in the scene and determine if there is an intersection with the current ray
        objects.forEach(function (o) {
            // console.log(o.findIntersection(ray))
            intersections.push(o.findIntersection(ray));
        });


        // find closest intersection to the camera
        var firstObjectIndex = findFirstObject(intersections);




        var pos = (y * WIDTH + x) * 4; // position in buffer based on x and y
        if (firstObjectIndex == -1) {
            // This pixel did not hit an object
            data[pos] = 0;           // some R value [0, 255]
            data[pos + 1] = 0;           // some G value
            data[pos + 2] = 0;           // some B value
            data[pos + 3] = 255;             // set alpha channel

        }
        else {

            var color = objects[firstObjectIndex].color;
            //console.log(currentObject);
            //console.log(color.red * 255)
            data[pos] = color.red * 255;           // some R value [0, 255]
            data[pos + 1] = color.green * 255;           // some G value
            data[pos + 2] = color.blue * 255;           // some B value
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


//----------------Functions-------------------------
// returns the index of the closest object to the camera
function findFirstObject(intersections) {
    var minValue;
    if (intersections.length < 1) {
        return -1;
    }
    else if (intersections.length == 1) {
        if (intersections[0] > 0) {
            return 0;
        }
        else {
            return -1;
        }
    }
    else {

        var max = -1;
        intersections.forEach(function (num) {
            if (max < num) {
                max = num;
            }
        });

        if (max > 0) {
            for (var i = 0; i < intersections.length; i++)
                if (intersections[i] > 0 && intersections[i] <= max) {
                    max = intersections[i];
                    minValue = i;

                }

            return minValue;
        }
        else {
            return -1;
        }


    }
}
