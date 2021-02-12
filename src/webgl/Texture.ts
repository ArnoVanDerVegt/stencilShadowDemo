/**
 * WebGL stencil shadow demo
 *
 * Copyright:
 * Arno van der Vegt, 2011
 *
 * Contact:
 * legoasimo@gmail.com
 *
 * Licence:
 * Creative Commons Attribution/Share-Alike license
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * The WebGL setup code was provided by: http://learningwebgl.com
**/

interface ITexture {
    _renderer: IRenderer;
    _texture:  IGlTexture;
    _canvas:   any;
    _color1:   string;
    _color2:   string;
    _src:      string;
    _ready:    boolean;
    getReady(): boolean;
    getTexture(): IGlTexture;
}

interface ITextureOpts {
    renderer:   IRenderer;
    color1?:    string;
    color2?:    string;
    src?:       string;
    magFilter?: number;
    minFilter?: number;
}

class Texture implements ITexture {
    _renderer:  IRenderer;
    _texture:   IGlTexture;
    _canvas:    any;
    _image:     any;
    _color1:    string;
    _color2:    string;
    _src:       string;
    _magFilter: number;
    _minFilter: number;
    _ready:     boolean;

    constructor(opts: ITextureOpts) {
        let gl = opts.renderer.getGl();
        this._renderer  = opts.renderer;
        this._color1    = opts.color1;
        this._color2    = opts.color2;
        this._src       = opts.src || '';
        this._magFilter = opts.magFilter || gl.LINEAR;
        this._minFilter = opts.minFilter || gl.LINEAR_MIPMAP_NEAREST;
        this._ready     = false;
        this.createTexture();
    }

    createTexture(): void {
        if (this._src === '') {
            let canvas  = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.width      = 128;
            canvas.height     = 128;
            context.fillStyle = this._color1;
            context.fillRect(0, 0, 128, 128);
            context.fillStyle = this._color2;
            context.fillRect( 0,  0, 64, 64);
            context.fillRect(64, 64, 64, 64);
            this._canvas = canvas;
            this.createGlTexture(canvas);
        } else {
            this._image = new Image();
            this._image.addEventListener('load', this.onLoadImage.bind(this));
            this._image.src = this._src;
        }
    }

    createGlTexture(image: any): void {
        let gl = this._renderer.getGl();
        this._texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._magFilter);// gl.NEAREST);//LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._minFilter);// gl.NEAREST);//LINEAR_MIPMAP_NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._ready = true;
    }

    onLoadImage() {
        this.createGlTexture(this._image);
    }

    getReady(): boolean {
        return this._ready;
    }

    getTexture(): IGlTexture {
        return this._texture;
    }
}
