function Camera(pos, dir, right, down) {
    this.position = pos || new Vector(0, 0, 0);
    this.direction = dir || new Vector(0, 0, 1);
    this.right = right || new Vector(0, 0, 0);
    this.down = down || new Vector(0, 0, 0);
}

Camera.prototype = {
    getPosition: function () {
        return this.position;
    },
    getDir: function () {
        return this.direction;
    },
    getRight: function () {
        return this.right;
    },
    getDown: function () {
        return this.down;
    },
};


