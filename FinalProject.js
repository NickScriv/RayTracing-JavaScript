// Final Project: Ray Tracing
// Name: Nick Scrivanich
// NetId: ns1284
// Goal:...

// HTML elements we need
const canvas = document.getElementById("canvas");
const help = document.getElementById("help");
const input = document.getElementById("commands");
const color_div = document.getElementById("color");
const sizer = document.getElementById("size");

// Some variables
const color = [0, 0, 0, 255];

let drawPointsGPU = undefined;
let drawLineGPU = undefined;
let drawTriangleGPU = undefined;

// Load regl module into the canvas element on the page.  For this assignment,
// we turn off antialiasing (so we do it manually) and auto clearing the draw
// buffer (so our drawing is preserved between calls).
const regl = createREGL({
    canvas: canvas,
    attributes: {
        antialias: false,
        preserveDrawingBuffer: true
    }
});

// Two data elements loaded from "web server": the two shader programs
let vertexSource = undefined;
let fragmentSource = undefined;

// Set up two Fetch calls for the resources and process accordingly. 
// Each one calls the init() function; this function only completes when
// all resources are loaded. Always re-fetch so caching doesn't hurt us.
function load() {
    fetch('FinalProject.vert.glsl', { cache: "no-store" })
        .then(function (response) {
            return response.text();
        })
        .then(function (txt) {
            vertexSource = txt;
            init();
        });

    fetch('FinalProject.frag.glsl', { cache: "no-store" })
        .then(function (response) {
            return response.text();
        })
        .then(function (txt) {
            fragmentSource = txt;
            init();
        });
}

// The initialization function. Checks for all resources before continuing.
function init() {
    // Is everything loaded?
    if (vertexSource === undefined
        || fragmentSource === undefined)
        return;

    // regl draw commands for the assignment. We have two:
    // - reglPoints: Draws points to the screen directly. Used primarily
    //               by undergraduates, who do calculations in JS (this file).
    // - reglBox:    Forces entire box to be drawn. The GPU is then used to
    //               determine if pixel is drawn or not. Used by graduate 
    //               students for parallel line/triangle rendering.
    const reglPoints = regl({
        // viewport
        viewport: {
            x: 0,
            y: 0,
            width: ({ viewportWidth }) => viewportWidth,
            height: ({ viewportHeight }) => viewportHeight
        },

        blend: { enable: true },

        // fragment shader
        frag: fragmentSource,

        // vertex shader
        vert: vertexSource,

        // attributes
        attributes: {
            // Draw a bunch of points with a bunch of colors
            position: (context, { points }) => points.flat(),
            inColor: (context, { colors }) => colors.flat(),
        },

        // vertices to draw: One per point
        count: (context, { points }) => points.length,

        primitive: 'points',

        // uniforms
        uniforms: {
            viewport: ({ viewportWidth, viewportHeight }) => [viewportWidth, viewportHeight],
            mode: 0, // Points
            dpi: window.devicePixelRatio,
            'vertices[0]': [0., 0.],
            'vertices[1]': [0., 0.],
            'vertices[2]': [0., 0.]
        }
    });
    drawPointsGPU = (points, colors) => {
        // Update the canvas size. Correct for window DPI.
        width = canvas.clientWidth * window.devicePixelRatio;
        height = canvas.clientHeight * window.devicePixelRatio;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            regl.poll();
        }
        // Draw the points-based code.
        reglPoints({ points: points, colors: colors });
    };

    const reglBox = regl({
        // viewport
        viewport: {
            x: 0,
            y: 0,
            width: ({ viewportWidth }) => viewportWidth,
            height: ({ viewportHeight }) => viewportHeight
        },

        // fragment shader
        frag: fragmentSource,

        // vertex shader
        vert: vertexSource,

        // attributes
        attributes: {
            // A quad big enough to hold all the control vertices
            position: {
                buffer: (context, { vertices }) => {
                    // Bounding box of primitive. Grow by 1 pix in every direction
                    // to correct for horizontal/vertical lines and add room for 
                    // antialiasing.
                    let min_i = Math.min(...vertices.flat().filter((n, i) => i % 2 == 0));
                    let min_j = Math.min(...vertices.flat().filter((n, i) => i % 2 == 1));
                    let max_i = Math.max(...vertices.flat().filter((n, i) => i % 2 == 0));
                    let max_j = Math.max(...vertices.flat().filter((n, i) => i % 2 == 1));
                    console.log(vertices, min_i, max_i, min_j, max_j);
                    return regl.buffer(new Int16Array([
                        min_i - 1, min_j - 1, max_i + 1, min_j - 1, max_i + 1, max_j + 1,
                        min_i - 1, min_j - 1, max_i + 1, max_j + 1, min_i - 1, max_j + 1
                    ]));
                },
                size: 2
            },

            inColor: { constant: (context, { color }) => color }
        },

        // vertices to draw
        count: 6,

        // uniforms
        uniforms: {
            viewport: ({ viewportWidth, viewportHeight }) => [viewportWidth, viewportHeight],
            mode: (context, { mode }) => mode, // Lines or Triangles
            dpi: window.devicePixelRatio,
            'vertices[0]': (context, { vertices }) => vertices[0],
            'vertices[1]': (context, { vertices }) => vertices[1],
            'vertices[2]': (context, { mode, vertices }) =>
                mode === 1 ? [0, 0] : vertices[2]
        }
    });
    drawLineGPU = (vertices, color) => {
        // Update the canvas size. Correct for DPI.
        width = canvas.clientWidth * window.devicePixelRatio;
        height = canvas.clientHeight * window.devicePixelRatio;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            regl.poll();
        }

        // Draw the GPU-based code
        reglBox({ mode: 1, color: color, vertices: vertices });
    };
    drawTriangleGPU = (vertices, color) => {
        // Update the canvas size. Correct for DPI
        width = canvas.clientWidth * window.devicePixelRatio;
        height = canvas.clientHeight * window.devicePixelRatio;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            regl.poll();
        }

        // Draw the GPU-based code
        reglBox({ mode: 2, color: color, vertices: vertices });
    };
}

// Call load when loaded
window.addEventListener("load", load);

// Handle window resizing
function resized() {
    sizer.innerHTML = "(" + canvas.clientWidth + ", " + canvas.clientHeight + ")";
}
window.addEventListener("resize", resized);
window.addEventListener("load", resized);

// Show or hide the help
function toggle_help() {
    help.style.display = (help.style.display == "none" ? "block" : "none");
}

// We will need to change or remove this section.
function parse(value) {
    const tokens = value.split(" ");
    if (tokens.length < 1)
        return;

    switch (tokens[0]) {
        case "line":
            drawLine(...tokens.slice(1).map(x => window.devicePixelRatio * parseInt(x)));
            break;
        case "poly":
            drawPolygon(tokens.slice(1).map(x => window.devicePixelRatio * parseInt(x)));
            break;
        case "clear":
            regl.clear({ color: [1, 1, 1, 1], depth: 1 });
            break;
        case "color":
            color[0] = parseInt(tokens[1]);
            color[1] = parseInt(tokens[2]);
            color[2] = parseInt(tokens[3]);
            color_div.style.backgroundColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            break;
        case "circle":
            drawCircle(...tokens.slice(1).map(x => window.devicePixelRatio * parseInt(x)));
            break;
        case "curve":
            drawCurve(tokens[1], tokens.slice(2).map(x => window.devicePixelRatio * parseInt(x)), false);
            break;
        case "closed":
            drawCurve(tokens[1], tokens.slice(2).map(x => window.devicePixelRatio * parseInt(x)), true);
            break;
        default:
            input.value = "<Invalid Input>";
            return;
    }
    input.value = "";
}



