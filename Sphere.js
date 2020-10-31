
class Sphere extends Object {


    constructor(center, r, color) {
        super();
        this.center = center || new Vector(0, 0, 0);
        this.radius = r || 1;
        this.color = color || new Color(0.5, 0.5, 0.5, 0); // gray color
    }
}




