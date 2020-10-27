//
// Name: Nick Scrivanich
// NetId: ns1284
// Goal:

precision highp float;

// Uniform variables are constant over image

uniform vec2 vertices[3];

// Varying variables change per pixel
varying vec4 color;

void main()
{
    
    gl_FragColor=vec4(vec3(color/255.),1.);
    
}
