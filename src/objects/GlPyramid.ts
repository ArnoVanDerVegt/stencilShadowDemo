class GlPyramid extends GlShape {
    _shadow: IGlShadowBuilder;

    constructor(opts: IGlShapeOpts) {
        super(opts);
        this.createObject(opts.sizeX, opts.sizeY, opts.sizeZ);
    }

    setShadow(shadow: IGlShadowBuilder) {
        this._shadow = shadow;
    }

    createObject(sizeX: number, sizeY: number, sizeZ: number): void {
        this
            .addTriangle(-sizeX, -sizeY,  sizeZ, 1.0,0.0,  sizeX, -sizeY,  sizeZ, 0.0,0.0,  0,      sizeY,  0,      0.5,1.0)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 0.0,0.0,  0,      sizeY,  0,     0.5,1.0,  sizeX, -sizeY, -sizeZ,  1.0,0.0)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 0.0,0.0,  sizeX, -sizeY, -sizeZ, 1.0,0.0,  sizeX, -sizeY,  sizeZ,  1.0,1.0)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 0.0,0.0,  sizeX, -sizeY,  sizeZ, 1.0,1.0, -sizeX, -sizeY,  sizeZ,  0.0,1.0)
            .addTriangle( sizeX, -sizeY, -sizeZ, 1.0,0.0,  0,      sizeY,  0,     0.5,1.0,  sizeX, -sizeY,  sizeZ,  0.0,0.0)
            .addTriangle(-sizeX, -sizeY, -sizeZ, 0.0,0.0, -sizeX, -sizeY,  sizeZ, 1.0,0.0,  0,      sizeY,  0,      0.5,1.0)
            .createBuffers();
    }
}
