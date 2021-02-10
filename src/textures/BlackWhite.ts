class BlackWhite extends Texture {
    constructor(opts: ITextureOpts) {
        opts.color1 = '#FFFFFF';
        opts.color2 = '#000000';
        super(opts);
    }
}
