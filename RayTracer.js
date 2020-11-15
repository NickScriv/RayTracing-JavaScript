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

const ambientLight = 0.2;

// TODO: Make camera position user defined.
var cameraPosition = new Vector(14, 13, 2);

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
var camera = new Camera(cameraPosition, cameraForward, cameraRight, cameraUp, Math.PI / 8, aspectRatio);

// add colors
var whiteLight = new Color(1.0, 1.0, 1.0);
var green = new Color(0.5, 1.0, 0.5, 0.3);
var floorColor = new Color(0, 0, 0, 0, true);
var maroon = new Color(0.25, 0.25, 0.25);

//--------------OBJECTS/LIGHTS------------------------------------------------
var objects = [];
var lights = [];

//position if lights, TODO: make this user defined
var light1Pos = new Vector(-2, 7, 13);

//define lights
var light1 = new Light(light1Pos, whiteLight);


// sphere position, TODO: make this user defined
var centerSphere = new Vector(0, 2, 0);
var centerSphere2 = new Vector(2, 2, -2);


// create spheres
var sphere = new Sphere(centerSphere, 1, green);
var sphere2 = new Sphere(centerSphere2, 0.5, maroon);

// create plane
var floor = new Plane(new Vector(0, 0, 0), Y, floorColor);

/*objects.push(sphere);
objects.push(sphere2);*/
objects.push(floor);

lights.push(light1);

//--------------------------------------------------------------

// manipulate some pixel elements
for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {

        // start firing rays where the origin of the ray is the camera's origin.
        // translate pixel coordinate so it is in the range of [-1, 1]
        var u = (2.0 * x) / WIDTH - 1.0;
        var v = (-2.0 * y) / HEIGHT + 1.0;
        //console.log(u + " " + v)

        // shoot the ray
        var ray = camera.shootRay(u, v);

        var intersections = [];

        // loop through all objects defined in the scene and determine if there is an intersection with the current ray
        objects.forEach(function (o) {

            intersections.push(o.findIntersection(ray));
        });


        // find closest intersection to the camera, this is analogous to a z buffer
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
            // get point of intersection and direction vectors
            var intersectPosition = ray.origin.add(ray.direction.multiply(intersections[firstObjectIndex]))
            var intersectDirection = ray.direction;

            var colorIntersect = colorAt(intersectPosition, intersectDirection, firstObjectIndex);


            //var color = objects[firstObjectIndex].color;
            data[pos] = colorIntersect.red * 255;           // some R value [0, 255]
            data[pos + 1] = colorIntersect.green * 255;           // some G value
            data[pos + 2] = colorIntersect.blue * 255;           // some B value
            data[pos + 3] = 255;
        }


    }
}

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

// Phong Shading
function colorAt(intersectPosition, intersectDirection, firstObjectIndex) {

    // color of the closest object 
    var objectColor = objects[firstObjectIndex].color;


    // normal vector of the closest object 
    var objectNormal = objects[firstObjectIndex].getNormalAt(intersectPosition);

    // check if we hit the floor
    if (objectColor.checkered) {

        var squareValue = Math.floor(intersectPosition.z) + Math.floor(intersectPosition.x);
        // This will make a 1 X 1 checkerboard patter on the floor
        if ((squareValue % 2) == 0) {
            objectColor = new Color(0, 0, 0, 0, true)
        }
        else {
            objectColor = new Color(1, 1, 1, 0, true)
        }

    }


    // factor in the ambient light coefficient
    var finalColor = objectColor.scaleColor(ambientLight);

    if (objectColor.specular > 0 && objectColor.specular <= 1) {
        // calculate reflection ray: reflection direction = I - 2(I . n)n 
        var objNorm = objectNormal.unit();
        var incident = intersectDirection.unit();
        var d = objNorm.dot(incident);
        var norm2 = d * 2;
        var reflectionDir = incident.subtract(objNorm.multiply(norm2));

        var reflectionRay = new Ray(intersectPosition, reflectionDir);
        var reflectIntersections = [];


        // check to see what the reflection ray intersects with
        for (var i = 0; i < objects.length; i++) {
            reflectIntersections.push(objects[i].findIntersection(reflectionRay));
        }

        // get the first intersection from the z buffer
        var firstReflectIndex = findFirstObject(reflectIntersections);

        // check if there was an intersection at all
        if (firstReflectIndex != -1) {
            // there was, so get position of intersection
            var reflectIntersectionPosition = intersectPosition.add(reflectionDir.multiply(reflectIntersections[firstReflectIndex]));

            // get the color of reflection by calling this function recursively
            var reflectedColor = colorAt(reflectIntersectionPosition, reflectionRay.direction, firstReflectIndex)

            // add reflected color to final color scaled by the reflectivity of the current object color
            finalColor = finalColor.addColor(reflectedColor.scaleColor(objectColor.specular))



        }

    }






    for (var j = 0; j < lights.length; j++) {


        // get the direction of the light
        var lightDirection = (lights[j].position.subtract(intersectPosition)).unit();

        // angle of intesection point and light
        var cosAngle = objectNormal.dot(lightDirection);


        if (cosAngle > 0) { // intersection point is in view of the light

            var shadow = false;

            var distanceToLight = (lights[j].position.subtract(intersectPosition)).length();


            // create a new ray from the interesection point to the light source and check if anything is blocking it
            var shadowRay = new Ray(intersectPosition, (lights[j].position.subtract(intersectPosition)).unit())

            var secondaryIntersections = [];

            for (var i = 0; i < objects.length && !shadow; i++) {
                secondaryIntersections.push(objects[i].findIntersection(shadowRay))
            }

            for (let curIntersection of secondaryIntersections) {

                // if an intersection is smaller than the distance to the light source, then there is something in the way
                if (curIntersection <= distanceToLight && curIntersection >= 0) {
                    shadow = true;

                    break;
                }
            }

            if (!shadow) {

                finalColor = finalColor.addColor(objectColor.multiplyColor(lights[j].color).scaleColor(cosAngle))

                // check for shininess
                if (objectColor.specular > 0 && objectColor.specular <= 1) {

                    var d1 = objectNormal.dot(intersectDirection.negative())
                    var scale1 = objectNormal.multiply(d1);
                    var a1 = scale1.add(intersectDirection);
                    var scale2 = a1.multiply(2);
                    var s1 = scale2.subtract(intersectDirection);
                    var reflectionDirection = s1.unit();

                    var specular = reflectionDirection.dot(lightDirection);

                    if (specular > 0) {
                        specular = Math.pow(specular, 10)
                        finalColor = finalColor.addColor(lights[j].color.scaleColor(specular * objectColor.specular))
                    }


                }

            }




        }



    }

    return finalColor;
}
