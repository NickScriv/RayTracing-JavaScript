
class Sphere {


    constructor(center, r, color) {

        this.center = center || new Vector(0, 0, 0);
        this.radius = r || 1;
        this.color = color || new Color(0.5, 0.5, 0.5); // gray color
    }

    // normal of a sphere at a point points away from the center
    getNormalAt(point) {

        return point.add(this.center.negative()).unit();

    }

    // 
    findIntersection(ray) {

        var localRay = ray.clone();
        localRay.origin = localRay.origin.subtract(this.center);

        var a = localRay.direction.length2();
        var b = 2 * localRay.direction.dot(localRay.origin);
        var c = localRay.origin.length2() - Math.pow(this.radius, 2);

        var discr = Math.pow(b, 2) - 4 * a * c;

        if (discr < 0.0) {
            return -1;
        }

        // calculate both intersections points
        var t1 = (-b - Math.sqrt(discr)) / (2 * a);
        var t2 = (-b + Math.sqrt(discr)) / (2 * a);

        if (t1 > localRay.min && t1 < localRay.max) {

            return t1;

        }
        else if (t2 > localRay.min && t2 < localRay.max) {

            return t2;
        }
        else {
            return -1;
        }
    }
}




