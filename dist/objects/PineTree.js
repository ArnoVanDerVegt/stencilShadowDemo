class PineTree extends Shape {
    constructor(opts) {
        super(opts);
        this.createObject(opts.sizeX, opts.sizeY, opts.sizeZ);
    }
    setShadow(shadow) {
        this._shadow = shadow;
    }
    createObject(sizeX, sizeY, sizeZ) {
        sizeX /= 8;
        sizeZ /= 8;
        let steps = 16;
        let y1 = sizeY * 0.2;
        let y2 = sizeY;
        for (let i = 0; i < steps; i++) {
            let angle1 = Math.PI * 2 / steps * i;
            let angle2 = Math.PI * 2 / steps * (i + 1);
            let x1 = Math.sin(angle1);
            let z1 = Math.cos(angle1);
            let x2 = Math.sin(angle2);
            let z2 = Math.cos(angle2);
            let u1 = 0.1 + ((x1 + 1) / 2) * 0.3;
            let v1 = 0.1 + ((z1 + 1) / 2) * 0.3;
            let u2 = 0.1 + ((x2 + 1) / 2) * 0.3;
            let v2 = 0.1 + ((z2 + 1) / 2) * 0.3;
            x1 *= sizeX;
            x2 *= sizeX;
            z1 *= sizeZ;
            z2 *= sizeZ;
            let x3 = x1 * 4;
            let z3 = z1 * 4;
            let x4 = x2 * 4;
            let z4 = z2 * 4;
            this
                // Top, green
                .addTriangle(x3, y1, z3, u1, v1, x4, y1, z4, u2, v2, 0, y2, 0, 0.5, 0.5)
                // Under side of green
                .addTriangle(x1, y1, z1, u1, v1, x2, y1, z2, u2, v2, x4, y1, z4, u2, v2)
                .addTriangle(x3, y1, z3, u1, v1, x1, y1, z1, u1, v1, x4, y1, z4, u2, v2);
            u1 += 0.5;
            v1 += 0.5;
            u2 += 0.5;
            v2 += 0.5;
            this
                // Bottom
                .addTriangle(x2, 0, z2, u2, v2, x1, 0, z1, u1, v1, 0, 0, 0, 0.5, 0.5)
                // Trunk
                .addTriangle(x1, 0, z1, u1, v1, x2, 0, z2, u2, v2, x2, y1, z2, u2, v2)
                .addTriangle(x1, y1, z1, u1, v1, x1, 0, z1, u1, v1, x2, y1, z2, u2, v2);
        }
        this.createBuffers();
    }
}
