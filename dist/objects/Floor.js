class Floor extends Shape {
    constructor(opts) {
        super(opts);
        this.createObject(opts.sizeX, opts.sizeY, opts.sizeZ);
    }
    createObject(sizeX, sizeY, sizeZ) {
        let x1;
        let z1;
        let x2;
        let z2;
        let tileSize = 1;
        let maxLength = (Math.sqrt(sizeX * sizeX + sizeZ * sizeZ) / 4) * tileSize;
        const getY = (x, z) => {
            let l = Math.sqrt(x * x + z * z);
            return Math.min(Math.sin(Math.PI * 0.5 * (1 - Math.max(Math.min(l, maxLength), 0) / maxLength)) * 4, 1.5);
        };
        const getUV = (n) => {
            return (n / ((sizeX + 1) / 4)) % 1;
        };
        const addTriangle = (v1, v2, v3, v4) => {
            if (Math.abs(v1[1] - v3[1]) < Math.abs(v2[1] - v4[1])) {
                this
                    .addTriangle(v1[0], v1[1], v1[2], v1[3], v1[4], v2[0], v2[1], v2[2], v2[3], v2[4], v3[0], v3[1], v3[2], v3[3], v3[4])
                    .addTriangle(v1[0], v1[1], v1[2], v1[3], v1[4], v3[0], v3[1], v3[2], v3[3], v3[4], v4[0], v4[1], v4[2], v4[3], v4[4]);
            }
            else {
                this
                    .addTriangle(v1[0], v1[1], v1[2], v1[3], v1[4], v2[0], v2[1], v2[2], v2[3], v2[4], v4[0], v4[1], v4[2], v4[3], v4[4])
                    .addTriangle(v2[0], v2[1], v2[2], v2[3], v2[4], v3[0], v3[1], v3[2], v3[3], v3[4], v4[0], v4[1], v4[2], v4[3], v4[4]);
            }
        };
        for (let z = 0; z < sizeZ; z++) {
            z1 = sizeZ * tileSize * -0.5 + z * tileSize;
            z2 = z1 + tileSize;
            for (let x = 0; x < sizeX; x++) {
                x1 = sizeX * tileSize * -0.5 + x * tileSize;
                x2 = x1 + tileSize;
                let v1 = [x1, getY(x1, z2), z2, getUV(x), getUV(z + 1)];
                let v2 = [x2, getY(x2, z2), z2, getUV(x + 1), getUV(z + 1)];
                let v3 = [x2, getY(x2, z1), z1, getUV(x + 1), getUV(z)];
                let v4 = [x1, getY(x1, z1), z1, getUV(x), getUV(z)];
                addTriangle(v1, v2, v3, v4);
            }
        }
        z1 = sizeZ * tileSize * -0.5;
        z2 = sizeZ * tileSize * 0.5;
        for (let x = 0; x < sizeX; x++) {
            x1 = sizeX * tileSize * -0.5 + x * tileSize;
            x2 = x1 + tileSize;
            this
                .addTriangle(x1, -tileSize, z2, getUV(x), 0.5, x2, -tileSize, z2, getUV(x + 1), 0.5, x2, 0, z2, getUV(x + 1), 1)
                .addTriangle(x1, -tileSize, z2, getUV(x), 0.5, x2, 0, z2, getUV(x + 1), 1, x1, 0, z2, getUV(x), 1)
                .addTriangle(x1, -tileSize, z1, getUV(x + 1), 0, x1, 0, z1, getUV(x), 0, x2, 0, z1, getUV(x), 0.5)
                .addTriangle(x1, -tileSize, z1, getUV(x + 1), 0, x2, 0, z1, getUV(x), 0.5, x2, -tileSize, z1, getUV(x + 1), 0.5);
        }
        x1 = sizeX * tileSize * -0.5;
        x2 = sizeX * tileSize * 0.5;
        for (let z = 0; z < sizeZ; z++) {
            z1 = sizeZ * tileSize * -0.5 + z * tileSize;
            z2 = z1 + tileSize;
            this
                .addTriangle(x2, -tileSize, z1, 1, getUV(z), x2, 0, z1, 0.5, getUV(z), x2, 0, z2, 0.5, getUV(z + 1))
                .addTriangle(x2, -tileSize, z1, 1, getUV(z), x2, 0, z2, 0.5, getUV(z + 1), x2, -tileSize, z2, 1, getUV(z + 1))
                .addTriangle(x1, -tileSize, z1, 0.5, getUV(z), x1, -tileSize, z2, 0, getUV(z), x1, 0, z2, 0, getUV(z + 1))
                .addTriangle(x1, -tileSize, z1, 0.5, getUV(z), x1, 0, z2, 0, getUV(z + 1), x1, 0, z1, 0.5, getUV(z + 1));
        }
        this.createBuffers();
    }
}
