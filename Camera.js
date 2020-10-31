class Camera {


    constructor(pos, dir, right, down) {
        this.position = pos || new Vector(0, 0, 0);
        this.direction = dir || new Vector(0, 0, 1);
        this.right = right || new Vector(0, 0, 0);
        this.down = down || new Vector(0, 0, 0);
    }
}



