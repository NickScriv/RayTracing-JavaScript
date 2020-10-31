class Light extends Object {

    constructor(color, pos) {
        super();
        this.color = color || new Color(1, 1, 1, 0); // white color
        this.position = pos || new Vector(0, 0, 0);
    }
};


