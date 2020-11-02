
class Sphere extends Object {


    constructor(center, r, color) {
        super();
        this.center = center || new Vector(0, 0, 0);
        this.radius = r || 1;
        this.color = color || new Color(0.5, 0.5, 0.5, 0); // gray color
    }

    // normal of a shphere at a point points away from the center
    getNormalAt(point) {
        super.getNormalAt(point);
        return point.add(this.center.negative()).unit();

    }

    // p = ro + rd * t, find t when colliding with the sphere
    findIntersection(ray) {
        super.findIntersection(ray);
        var localRay = ray.clone();
        localRay.origin = localRay.origin.subtract(this.center);

        var a = localRay.direction.length2();
        var b = 2 * localRay.direction.dot(localRay.origin);
        var c = localRay.origin.length2() - Math.pow(this.radius, 2);

        var discr = Math.pow(b, 2) - 4 * a * c;

        if (discr < 0.0) {
            return -1;
        }
        //console.log(discr + " " + a + " " + b + " " + c);
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


        /*var t = ray.direction.dot(this.center.subtract(ray.origin));
        var p = ray.origin.add(ray.direction.multiply(t));
        var y = this.center.subtract(p).length();
        if (y < this.radius) {
            var x = Math.sqrt((this.radius * this.radius) - (y * y));
            //console.log(t - x);
            return t - x;

        }
        else {
            // no intersection

            return -1;
        }*/




    }
}




