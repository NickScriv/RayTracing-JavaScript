
class Color extends Object {


    constructor(r, g, b, s) {
        super();
        this.red = r || 0.5;
        this.green = g || 0.5;
        this.blue = b || 0.5;
        this.special = s || 0; // special is for shine and reflective properties
    }
}

