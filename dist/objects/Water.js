class Water extends Shape {
    constructor(opts) {
        super(opts);
        this.createObject(opts.sizeX, opts.sizeY, opts.sizeZ);
    }
    createObject(sizeX, sizeY, sizeZ) {
        let tileSize = 1;
        let x1;
        let z1;
        let x2;
        let z2;
        let y = 1;
        for (let z = 0; z < sizeZ; z++) {
            z1 = sizeZ * tileSize * -0.5 + z * tileSize;
            z2 = z1 + tileSize;
            for (let x = 0; x < sizeX; x++) {
                x1 = sizeX * tileSize * -0.5 + x * tileSize;
                x2 = x1 + tileSize;
                this
                    .addTriangle(x1, y, z2, 1, 0, x2, y, z2, 0, 0, x2, y, z1, 0, 1)
                    .addTriangle(x1, y, z2, 1, 0, x2, y, z1, 0, 1, x1, y, z1, 1, 1);
            }
        }
        z1 = sizeZ * tileSize * -0.5;
        z2 = sizeZ * tileSize * 0.5;
        for (let x = 0; x < sizeX; x++) {
            x1 = sizeX * tileSize * -0.5 + x * tileSize;
            x2 = x1 + tileSize;
            this
                .addTriangle(x1, 0, z2, 0, 0, x2, 0, z2, 1, 0, x2, y, z2, 1, 1)
                .addTriangle(x1, 0, z2, 0, 0, x2, y, z2, 1, 1, x1, y, z2, 0, 1)
                .addTriangle(x1, 0, z1, 1, 0, x1, y, z1, 0, 0, x2, y, z1, 0, 1)
                .addTriangle(x1, 0, z1, 1, 0, x2, y, z1, 0, 1, x2, 0, z1, 1, 1);
        }
        x1 = sizeX * tileSize * -0.5;
        x2 = sizeX * tileSize * 0.5;
        for (let x = 0; x < sizeX; x++) {
            z1 = sizeZ * tileSize * -0.5 + x * tileSize;
            z2 = z1 + tileSize;
            this
                .addTriangle(x2, 0, z1, 0, 0, x2, y, z1, 1, 0, x2, y, z2, 1, 1)
                .addTriangle(x2, 0, z1, 0, 0, x2, y, z2, 1, 1, x2, 0, z2, 0, 1)
                .addTriangle(x1, 0, z1, 1, 0, x1, 0, z2, 0, 0, x1, y, z2, 0, 1)
                .addTriangle(x1, 0, z1, 1, 0, x1, y, z2, 0, 1, x1, y, z1, 1, 1);
        }
        this.createBuffers();
    }
}
