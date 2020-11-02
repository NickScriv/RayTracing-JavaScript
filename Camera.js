class Camera {


    constructor(pos, forward, right, up, fov, aspectRatio) {
        this.position = pos || new Vector(0, 0, 0);
        this.forward = forward || new Vector(0, 0, 1);
        this.right = right || new Vector(0, 0, 0);
        this.up = up || new Vector(0, 0, 0);
        this.h = Math.tan(fov);
        this.w = aspectRatio * this.h;
    }

    // shoots a ray from camera into the 3d scene given an x and y in the range of -1 to 1 represented by screen space
    shootRay(x, y) {
        var u = this.right.multiply(x * this.w);
        var v = this.up.multiply(y * this.h);
        var direction = this.forward.add(u);
        var direction2 = direction.add(v);
        return new Ray(this.position, direction2.unit())

    }
}



