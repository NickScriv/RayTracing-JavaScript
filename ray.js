
class Ray {

    constructor(origin, dir) {
        this.origin = origin || new Vector(0, 0, 0);
        this.direction = dir || new Vector(1, 0, 0);
        this.min = 0.0001;
        this.max = 1000000000000000000000000000000;

    }

    clone() {
        return new Ray(this.origin.clone(), this.direction.clone())
    }

}

