class Star extends Shape {
    constructor(opts) {
        super(opts);
        this.createObject(opts.sizeX, opts.sizeY, opts.sizeZ);
    }
    createObject(sizeX, sizeY, sizeZ) {
        let step = Math.PI * 2 / 5;
        let start = Math.PI * 2 / 10;
        for (let i = 0; i < 5; i++) {
            let x1 = Math.sin(start + i * step) * sizeX * 0.5;
            let y1 = Math.cos(start + i * step) * sizeY * 0.5;
            let x2 = Math.sin(start + (i + 1) * step) * sizeX * 0.5;
            let y2 = Math.cos(start + (i + 1) * step) * sizeY * 0.5;
            let x3 = Math.sin(start + (i + 0.5) * step) * sizeX;
            let y3 = Math.cos(start + (i + 0.5) * step) * sizeY;
            let u1 = (x1 + sizeX) / (sizeX * 2);
            let v1 = (y1 + sizeY) / (sizeY * 2);
            let u2 = (x2 + sizeX) / (sizeX * 2);
            let v2 = (y2 + sizeY) / (sizeY * 2);
            let u3 = (x3 + sizeX) / (sizeX * 2);
            let v3 = (y3 + sizeY) / (sizeY * 2);
            this
                .addTriangle(x1, y1, -sizeZ, u1, v1, x2, y2, -sizeZ, u2, v2, 0, 0, -sizeZ, u3, v3)
                .addTriangle(x2, y2, -sizeZ, u2, v2, x1, y1, -sizeZ, u1, v1, x3, y3, 0, u3, v3)
                .addTriangle(x2, y2, sizeZ, u2, v2, x1, y1, sizeZ, u1, v1, 0, 0, sizeZ, 0.5, 0.5)
                .addTriangle(x1, y1, sizeZ, u1, v1, x2, y2, sizeZ, u2, v2, x3, y3, 0, u3, v3)
                .addTriangle(x1, y1, -sizeZ, u1, v1, x1, y1, sizeZ, u1, v1, x3, y3, 0, u3, v3)
                .addTriangle(x2, y2, sizeZ, u2, v2, x2, y2, -sizeZ, u2, v2, x3, y3, 0, u3, v3);
        }
        this.createBuffers();
    }
    ;
}
