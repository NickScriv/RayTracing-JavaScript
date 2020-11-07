
class Color {


    constructor(r, g, b, spec, checkered) {

        this.red = r;
        this.green = g;
        this.blue = b;
        this.specular = spec || 0; // This is for shine and to calculate reflectivity
        this.checkered = checkered || false;
    }

    // brightness of the color
    brightness() {
        return (this.red + this.green + this.blue) / 3;
    }

    // scale a color by a given scalar
    scaleColor(scalar) {
        return new Color(this.red * scalar, this.green * scalar, this.blue * scalar, this.special)
    }

    // add 2 colors
    addColor(color) {
        return new Color(this.red + color.red, this.green + color.green, this.blue + color.blue, this.special);

    }

    // multiply 2 colors
    multiplyColor(color) {
        return new Color(this.red * color.red, this.green * color.green, this.blue * color.blue, this.special);

    }
    // average of 2 colors is the average of their components
    avgColor(color) {
        return new Color((this.red + color.red) / 2, (this.green + color.green) / 2, (this.blue + color.blue) / 2, this.special)
    }


}


