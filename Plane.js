
class Plane extends Object {


    constructor(norm, dist, color) {
        super();
        this.normal = norm || new Vector(0, 1, 0); // normal in y direction by default
        this.distance = dist || 0; // distance from plane to origin
        this.color = color || new Color(0.5, 0.5, 0.5, 0); // gray color
    }

    normalAt(point) {
        return this.normal; // since the normal at any point of the plane is the same.
    }

    intersectionDist(ray) { //return distance of intersection from ray origin
        var rayDir = ray.direction;
        var vecA = rayDir.dot(normal);
        if (vecDot == 0) // parallel
        {
            return -1; // cant intersect
        }
        else {
            // compute the distance
            var vecB = normal.dot(ray.origin.add(normal.multiply(this.distance).negative()));
            return -1 * vecB / vecA;

        }

    }
}




