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
class Texture {
    constructor(opts) {
        this._renderer = opts.renderer;
        this._color1 = opts.color1;
        this._color2 = opts.color2;
    }
    createTexture() {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        context.fillStyle = this._color1;
        context.fillRect(0, 0, 128, 128);
        context.fillStyle = this._color2;
        context.fillRect(0, 0, 64, 64);
        context.fillRect(64, 64, 64, 64);
        this._canvas = canvas;
    }
    createGlTexture() {
        let gl = this._renderer.getGl();
        this._texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    getTexture() {
        return this._texture;
    }
}
