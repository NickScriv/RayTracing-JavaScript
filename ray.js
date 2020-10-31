function Ray(dir, origin) {
    this.origin = dir || new Vector(0, 0, 0);
    this.direction = origin || new Vector(1, 0, 0);
}

Ray.prototype = {
    getOrigin: function () {
        return this.origin;
    },
    getDir: function () {
        return this.origin;
    },

    init: function (dir, origin) {
        this.direction = dir; this.origin = origin;
        return this;
    }
};


