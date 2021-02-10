class GlStar extends Shape {
    constructor(opts: IShapeOpts) {
        super(opts);
        this.createObject(opts.sizeX, opts.sizeY, opts.sizeZ);
    }

    createObject(sizeX: number, sizeY: number, sizeZ: number): void {
        let step:  number = Math.PI * 2 / 5;
        let start: number = Math.PI * 2 / 10;
        for (let i: number = 0; i < 5; i++) {
            let x1: number = Math.sin(start +  i        * step) * sizeX * 0.5;
            let y1: number = Math.cos(start +  i        * step) * sizeY * 0.5;
            let x2: number = Math.sin(start + (i + 1)   * step) * sizeX * 0.5;
            let y2: number = Math.cos(start + (i + 1)   * step) * sizeY * 0.5;
            let x3: number = Math.sin(start + (i + 0.5) * step) * sizeX;
            let y3: number = Math.cos(start + (i + 0.5) * step) * sizeY;
            let u1: number = (x1 + sizeX) / (sizeX * 2);
            let v1: number = (y1 + sizeY) / (sizeY * 2);
            let u2: number = (x2 + sizeX) / (sizeX * 2);
            let v2: number = (y2 + sizeY) / (sizeY * 2);
            let u3: number = (x3 + sizeX) / (sizeX * 2);
            let v3: number = (y3 + sizeY) / (sizeY * 2);
            this
                .addTriangle(x1, y1, -sizeZ,   u1,v1, x2, y2, -sizeZ,   u2,v2, 0,  0,  -sizeZ,   u3,v3)
                .addTriangle(x2, y2, -sizeZ,   u2,v2, x1, y1, -sizeZ,   u1,v1, x3, y3,  0,       u3,v3)
                .addTriangle(x2, y2,  sizeZ,   u2,v2, x1, y1,  sizeZ,   u1,v1, 0,  0,   sizeZ,   0.5,0.5)
                .addTriangle(x1, y1,  sizeZ,   u1,v1, x2, y2,  sizeZ,   u2,v2, x3, y3,  0,       u3,v3)
                .addTriangle(x1, y1, -sizeZ,   u1,v1, x1, y1,  sizeZ,   u1,v1, x3, y3,  0,       u3,v3)
                .addTriangle(x2, y2,  sizeZ,   u2,v2, x2, y2, -sizeZ,   u2,v2, x3, y3,  0,       u3,v3);
        }
        this.createBuffers();
    };
}
