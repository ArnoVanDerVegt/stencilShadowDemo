class Cube extends Shape {
    constructor(opts) {
        super(opts);
        this.createObject(opts.sizeX, opts.sizeY, opts.sizeZ);
    }
    createObject(sizeX, sizeY, sizeZ) {
        this
            .addTriangle(-sizeX, -sizeY, sizeZ, 0, 0, sizeX, -sizeY, sizeZ, 1, 0, sizeX, sizeY, sizeZ, 1, 1)
            .addTriangle(-sizeX, -sizeY, sizeZ, 0, 0, sizeX, sizeY, sizeZ, 1, 1, -sizeX, sizeY, sizeZ, 0, 1)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 1, 0, -sizeX, sizeY, -sizeZ, 0, 0, sizeX, sizeY, -sizeZ, 0, 1)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 1, 0, sizeX, sizeY, -sizeZ, 0, 1, sizeX, -sizeY, -sizeZ, 1, 1)
            .addTriangle(-sizeX, sizeY, -sizeZ, 0, 0, -sizeX, sizeY, sizeZ, 1, 0, sizeX, sizeY, sizeZ, 1, 1)
            .addTriangle(-sizeX, sizeY, -sizeZ, 0, 0, sizeX, sizeY, sizeZ, 1, 1, sizeX, sizeY, -sizeZ, 0, 1)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 1, 0, sizeX, -sizeY, -sizeZ, 0, 0, sizeX, -sizeY, sizeZ, 0, 1)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 1, 0, sizeX, -sizeY, sizeZ, 0, 1, -sizeX, -sizeY, sizeZ, 1, 1)
            .addTriangle(sizeX, -sizeY, -sizeZ, 0, 0, sizeX, sizeY, -sizeZ, 1, 0, sizeX, sizeY, sizeZ, 1, 1)
            .addTriangle(sizeX, -sizeY, -sizeZ, 0, 0, sizeX, sizeY, sizeZ, 1, 1, sizeX, -sizeY, sizeZ, 0, 1)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 1, 0, -sizeX, -sizeY, sizeZ, 0, 0, -sizeX, sizeY, sizeZ, 0, 1)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 1, 0, -sizeX, sizeY, sizeZ, 0, 1, -sizeX, sizeY, -sizeZ, 1, 1)
            .createBuffers();
    }
}
