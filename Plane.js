
class Plane extends Object {


    constructor(pos, norm, color) {
        super();
        this.normal = norm || new Vector(0, 1, 0); // normal in y direction by default
        this.position = pos || new Vector(0, 0, 0);// distance from plane to origin
        this.color = color || new Color(0.5, 0.5, 0.5, 0); // gray color
    }

    getNormalAt(point) {
        super.getNormalAt(point);
        return this.normal; // since the normal at any point of the plane is the same.
    }

    findIntersection(ray) { //return distance of intersection from ray origin
        super.findIntersection(ray);

        var dotNorm = ray.direction.dot(this.normal);


        if (dotNorm == 0) {
            //ray is parallel to the plane
            return -1;
        }

        var t = this.position.subtract(ray.origin).dot(this.normal) / dotNorm;

        if (t <= ray.min || t >= ray.max) {
            return -1;
        }

        return t;
        /*var rayDir = ray.direction;
        var vecA = rayDir.dot(this.normal);
        if (vecA == 0) // parallel
        {
            return -1; // cant intersect
        }
        else {
            // compute the distance
            var vecB = this.normal.dot(ray.origin.add(this.normal.multiply(this.distance).negative()));
            //console.log(-1 * vecB / vecA);
            return -1 * vecB / vecA;


        }*/

    }
}




