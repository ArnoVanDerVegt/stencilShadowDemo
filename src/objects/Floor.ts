class Floor extends Shape {
    constructor(opts: IShapeOpts) {
        super(opts);
        this.createObject(opts.sizeX, opts.sizeY, opts.sizeZ);
    }

    createObject(sizeX: number, sizeY: number, sizeZ: number): void {
        let tileSize = 1;
        let x1;
        let z1;
        let x2;
        let z2;
        let maxLength = (Math.sqrt(sizeX * sizeX + sizeZ * sizeZ) / 4) * tileSize;
        const getY = (x, z) => {
                let l = Math.sqrt(x * x + z * z);
                return Math.min(Math.sin(Math.PI * 0.5 * (1 - Math.max(Math.min(l, maxLength), 0) / maxLength)) * 4, 1.5);
            };
        const getUV = (n) => {
                return (n / ((sizeX + 1) / 4)) % 1;
            };
        for (let z = 0; z < sizeZ; z++) {
            z1 = sizeZ * tileSize * -0.5 + z * tileSize;
            z2 = z1 + tileSize;
            for (let x = 0; x < sizeX; x++) {
                x1 = sizeX * tileSize * -0.5 + x * tileSize;
                x2 = x1 + tileSize;
                this
                    .addTriangle(
                        x1, getY(x1, z2), z2, getUV(x),     getUV(z + 1),
                        x2, getY(x2, z2), z2, getUV(x + 1), getUV(z + 1),
                        x2, getY(x2, z1), z1, getUV(x + 1), getUV(z)
                    )
                    .addTriangle(
                        x1, getY(x1, z2), z2, getUV(x),     getUV(z + 1),
                        x2, getY(x2, z1), z1, getUV(x + 1), getUV(z),
                        x1, getY(x1, z1), z1, getUV(x),     getUV(z)
                    );
            }
        }
        z1 = sizeZ * tileSize * -0.5;
        z2 = sizeZ * tileSize *  0.5;
        for (let x = 0; x < sizeX; x++) {
            x1 = sizeX * tileSize * -0.5 + x * tileSize;
            x2 = x1 + tileSize;
            this
                .addTriangle(
                    x1, -tileSize, z2, getUV(x),     0.5,
                    x2, -tileSize, z2, getUV(x + 1), 0.5,
                    x2,  0,        z2, getUV(x + 1), 1
                )
                .addTriangle(
                    x1, -tileSize, z2, getUV(x),     0.5,
                    x2,  0,        z2, getUV(x + 1), 1,
                    x1,  0,        z2, getUV(x),     1
                )
                .addTriangle(
                    x1, -tileSize, z1, getUV(x + 1), 0,
                    x1,  0,        z1, getUV(x),     0,
                    x2,  0,        z1, getUV(x),     0.5)
                .addTriangle(
                    x1, -tileSize, z1, getUV(x + 1), 0,
                    x2,  0,        z1, getUV(x),     0.5,
                    x2, -tileSize, z1, getUV(x + 1), 0.5
                );
        }
        x1 = sizeX * tileSize * -0.5;
        x2 = sizeX * tileSize *  0.5;
        for (let z = 0; z < sizeZ; z++) {
            z1 = sizeZ * tileSize * -0.5 + z * tileSize;
            z2 = z1 + tileSize;
            this
                .addTriangle(
                    x2, -tileSize, z1, 1,   getUV(z),
                    x2,  0,        z1, 0.5, getUV(z),
                    x2,  0,        z2, 0.5, getUV(z + 1)
                )
                .addTriangle(
                    x2, -tileSize, z1, 1,   getUV(z),
                    x2,  0,        z2, 0.5, getUV(z + 1),
                    x2, -tileSize, z2, 1,   getUV(z + 1)
                )
                .addTriangle(
                    x1, -tileSize, z1, 0.5, getUV(z),
                    x1, -tileSize, z2, 0,   getUV(z),
                    x1,  0,        z2, 0,   getUV(z + 1)
                )
                .addTriangle(
                    x1, -tileSize, z1, 0.5, getUV(z),
                    x1,  0,        z2, 0,   getUV(z + 1),
                    x1,  0,        z1, 0.5, getUV(z + 1)
                );
        }
        this.createBuffers();
    }
}
