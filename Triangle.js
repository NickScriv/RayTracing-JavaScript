
class Triangle {

    // triangle is defined by 3 verticies 
    constructor(a, b, c, color, normal) {

        this.a = a;
        this.b = b;
        this.c = c;
        this.color = color;
        this.ac = this.c.subtract(this.a);
        this.ab = this.b.subtract(this.a);
        this.name = "triangle";

        if (normal === undefined) {
            // compute normal vector of plane that triangle lies in
            var res = this.ac.cross(this.ab);
            this.normal = res.unit();

        }
        else {

            this.normal = normal;
        }


    }

    // normal of triangle face
    getNormalAt(point) {
        return this.normal;
    }

    // 
    findIntersection(ray) {

        // get intersection point of the plane that the triangle lies in

        var dotNorm = ray.direction.dot(this.normal);
        if (dotNorm == 0) {
            //ray is parallel to the plane
            return -1;
        }

        var t = this.a.subtract(ray.origin).dot(this.normal) / dotNorm;

        if (t <= ray.min || t >= ray.max) {
            return -1;
        }


        // get the point of intersection
        var p = (ray.direction.multiply(t)).add(ray.origin);

        var ap = p.subtract(this.a);
        var bp = p.subtract(this.b);
        var cp = p.subtract(this.c);

        // for each edge of the triangle, calculate their vectors and the vector to the point.
        // if the cross product of those 2 vectors is pointing in the same direction a the triangles normal,then the point is on the correct side of the edge
        var ba = this.a.subtract(this.b);
        var baDot = (ba.cross(bp)).dot(this.normal);
        var cb = this.b.subtract(this.c);
        var cbDot = (cb.cross(cp)).dot(this.normal);
        var ac = this.c.subtract(this.a);
        var acDot = (ac.cross(ap)).dot(this.normal);


        //check if intersection point lies within the triangle
        if (acDot >= 0 && cbDot >= 0 && baDot >= 0) {

            // point of intersection is inside of all the edges in the triangle


            return t;
        }
        else {

            return -1;
        }



    }
}




