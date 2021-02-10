const FONT_HALIGN_LEFT = 0;
const FONT_HALIGN_CENTER = 1;
const FONT_HALIGN_RIGHT = 2;
const FONT_VALIGN_TOP = 0;
const FONT_VALIGN_CENTER = 1;
const FONT_VALIGN_BOTTOM = 2;
class FontCharacters {
    constructor(opts) {
        this._renderer = opts.renderer;
        this._texture = opts.texture;
        this._halign = FONT_HALIGN_LEFT;
        this._halign = FONT_VALIGN_TOP;
        this._characters = [];
        for (let ch = 33; ch < 127; ch++) {
            this._characters.push(new FontCharacter({ renderer: this._renderer, ch: ch }));
        }
    }
    setHAlign(halign) {
        this._halign = halign;
        return this;
    }
    setVAlign(valign) {
        this._valign = valign;
        return this;
    }
    getWidth(s) {
        let width = 0;
        for (let i = 0; i < s.length; i++) {
            let ch = s.charCodeAt(i);
            let characterWidth = 0;
            if (ch === 32) {
                characterWidth = charInfo['a'.charCodeAt(0)].width;
            }
            else if ((ch >= 33) && (ch < 127)) {
                characterWidth = charInfo[ch].width;
                if (i < s.length - 1) {
                    characterWidth += charInfo[ch].kerning[s.charCodeAt(i + 1)] || 0;
                }
            }
            width += characterWidth;
        }
        return width;
    }
    getHeight() {
        return charInfo['a'.charCodeAt(0)].height;
    }
    render(xPerc, yPerc, s) {
        if (!this._texture.getReady()) {
            return;
        }
        let renderer = this._renderer;
        let gl = renderer.getGl();
        let width = renderer.getScreenWidth();
        let height = renderer.getScreenHeight();
        let x = xPerc * width / 100;
        let y = yPerc * height / 100;
        switch (this._halign) {
            case FONT_HALIGN_CENTER:
                x -= this.getWidth(s) / 2;
                break;
            case FONT_HALIGN_RIGHT:
                x -= this.getWidth(s);
                break;
        }
        switch (this._valign) {
            case FONT_VALIGN_CENTER:
                y -= this.getHeight() / 2;
                break;
            case FONT_VALIGN_BOTTOM:
                y -= this.getHeight();
                break;
        }
        gl.depthMask(false);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture.getTexture());
        gl.uniform1i(renderer.getSamplerUniform(), 0);
        gl.uniform1f(renderer.getModeUniform(), MODE_TEXTURE);
        gl.uniform1f(renderer.getAlphaUniform(), 1);
        renderer
            .pPushMatrix()
            .mvPushMatrix();
        mat4.ortho(renderer.getPMatrix(), 0, width, height, 0, 0, -100);
        let mvMatrix = renderer.identity();
        mat4.translate(mvMatrix, mvMatrix, [x, y, 0]);
        for (let i = 0; i < s.length; i++) {
            let ch = s.charCodeAt(i);
            let characterWidth = 0;
            if (ch === 32) {
                characterWidth = charInfo['a'.charCodeAt(0)].width;
            }
            else if ((ch >= 33) && (ch < 127)) {
                renderer.setMatrixUniforms();
                this._characters[ch - 33].render();
                characterWidth = charInfo[ch].width;
                if (i < s.length - 1) {
                    characterWidth += charInfo[ch].kerning[s.charCodeAt(i + 1)] || 0;
                }
            }
            mat4.translate(mvMatrix, mvMatrix, [characterWidth, 0, 0]);
        }
        renderer
            .mvPopMatrix()
            .pPopMatrix();
        gl.disable(gl.BLEND);
        gl.depthMask(true);
    }
}
