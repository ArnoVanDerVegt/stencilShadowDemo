class WaterTexture extends Texture {
    constructor(opts: ITextureOpts) {
        let gl = opts.renderer.getGl();
        opts.color1    = '#112288';
        opts.color2    = '#2244AA';
        opts.magFilter = gl.NEAREST;
        opts.minFilter = gl.NEAREST;
        super(opts);
    }
}
