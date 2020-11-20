class Light {
    // light source is defined by its position and the color of light that it emits
    constructor(pos, color) {

        this.color = color || new Color(1, 1, 1, 0); // white color
        this.position = pos || new Vector(0, 0, 0);
    }
};


