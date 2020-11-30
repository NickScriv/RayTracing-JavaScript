
class Triangle {

    // triangle is defined by 3 verticies 
    constructor(a, b, c, color, normalA, normalB, normalC) {

        this.a = a;
        this.b = b;
        this.c = c;
        this.color = color;
        this.ac = this.c.subtract(this.a);
        this.ab = this.b.subtract(this.a);
        this.bc = this.c.subtract(this.b);
        this.ca = this.a.subtract(this.c);
        this.name = "triangle";
        this.na = normalA;
        this.nb = normalB;
        this.nc = normalC;

        // compute normal vector of plane that triangle lies in
        var norm = this.ab.cross(this.ac);
        this.planeNorm = norm.unit();

        // compute area of triangle
        this.area = norm.length() / 2.0;

    }

    // normal of triangle face at the given point
    getNormalAt(point) {
        // perform barycentric interpolation
        // find area of all 3 triangles formed by the point and divide them all by the area of entire triangle
        var bp = point.subtract(this.b);
        var BCP = this.bc.cross(bp);
        var areaBCP = BCP.length() / 2.0;
        var u = areaBCP / this.area;


        var cp = point.subtract(this.c);
        var CAP = this.ca.cross(cp);
        var areaCAP = CAP.length() / 2.0;
        var v = areaCAP / this.area;

        var ap = point.subtract(this.a);
        var ABP = this.ab.cross(ap);
        var areaABP = ABP.length() / 2.0;
        var w = areaABP / this.area;

        // compute normal at point
        var normA = this.na.multiply(u);
        var normB = this.nb.multiply(v);
        var normC = this.nc.multiply(w);


        var norm = normA.add(normB.add(normC));
        norm = norm.unit();


        return norm;


    }

    // 
    findIntersection(ray) {

        // get intersection point of the plane that the triangle lies in

        var dotNorm = ray.direction.dot(this.planeNorm);
        if (dotNorm == 0) {
            //ray is parallel to the plane
            return -1;
        }

        var t = this.a.subtract(ray.origin).dot(this.planeNorm) / dotNorm;

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

        var abDot = (this.ab.cross(bp)).dot(this.planeNorm);

        var bcDot = (this.bc.cross(cp)).dot(this.planeNorm);

        var caDot = (this.ca.cross(ap)).dot(this.planeNorm);


        //check if intersection point lies within the triangle
        if (caDot >= 0 && bcDot >= 0 && abDot >= 0) {
            return t;
        }
        else {

            return -1;
        }



    }
}




