const FONT_HALIGN_LEFT   = 0;
const FONT_HALIGN_CENTER = 1;
const FONT_HALIGN_RIGHT  = 2;
const FONT_VALIGN_TOP    = 0;
const FONT_VALIGN_CENTER = 1;
const FONT_VALIGN_BOTTOM = 2;

interface IFontCharacterList {
    [index:number]: IFontCharacter;
    length:         number;
    push(...args: any[]);
}

interface IFontCharacters {
    _renderer:   IRenderer;
    _texture:    ITexture;
    _characters: IFontCharacterList;
    _halign:     number;
    _valign:     number;
    _scaleX:     number;
    _scaleY:     number;
    setHAlign(halign: number): IFontCharacters;
    setVAlign(valign: number): IFontCharacters;
    setScaleX(scaleX: number): IFontCharacters;
    setScaleY(scaleY: number): IFontCharacters;
    getWidth(s: string): number;
    getHeight(): number;
    render(xPerc: number, yPerc: number, s: string): void;
}

interface IFontCharactersOpts {
    renderer: IRenderer;
    texture:  ITexture;
}

class FontCharacters implements IFontCharacters {
    _renderer:   IRenderer;
    _texture:    ITexture;
    _characters: IFontCharacterList;
    _halign:     number;
    _valign:     number;
    _scaleX:     number;
    _scaleY:     number;

    constructor(opts: IFontCharactersOpts) {
        this._renderer   = opts.renderer;
        this._texture    = opts.texture;
        this._halign     = FONT_HALIGN_LEFT;
        this._halign     = FONT_VALIGN_TOP;
        this._scaleX     = 1;
        this._scaleY     = 1;
        this._characters = [];
        for (let ch = 33; ch < 127; ch++) {
            this._characters.push(new FontCharacter({renderer: this._renderer, ch: ch}));
        }
    }

    setHAlign(halign: number): IFontCharacters {
        this._halign = halign;
        return this;
    }

    setVAlign(valign: number): IFontCharacters {
        this._valign = valign;
        return this;
    }

    setScaleX(scaleX: number): IFontCharacters {
        this._scaleX = scaleX;
        return this;
    }

    setScaleY(scaleY: number): IFontCharacters {
        this._scaleY = scaleY;
        return this;
    }

    getWidth(s: string): number {
        let width = 0;
        for (let i = 0; i < s.length; i++) {
            let ch             = s.charCodeAt(i);
            let characterWidth = 0
            if (ch === 32) {
                characterWidth = charInfo['a'.charCodeAt(0)].width;
            } else if ((ch >= 33) && (ch < 127)) {
                characterWidth = charInfo[ch].width;
                if (i < s.length - 1) {
                    characterWidth += charInfo[ch].kerning[s.charCodeAt(i + 1)] || 0;
                }
            }
            width += characterWidth;
        }
        return width * this._scaleX;
    }

    getHeight(): number {
        return charInfo['a'.charCodeAt(0)].height * this._scaleY;
    }

    render(xPerc: number, yPerc: number, s: string): void {
        if (!this._texture.getReady()) {
            return;
        }
        let renderer = this._renderer;
        let gl       = renderer.getGl();
        let width    = renderer.getScreenWidth();
        let height   = renderer.getScreenHeight();
        let x        = xPerc * width  / 100;
        let y        = yPerc * height / 100;
        switch (this._halign) {
            case FONT_HALIGN_CENTER: x -= this.getWidth(s) / 2; break;
            case FONT_HALIGN_RIGHT:  x -= this.getWidth(s);     break;
        }
        switch (this._valign) {
            case FONT_VALIGN_CENTER: y -= this.getHeight() / 2; break;
            case FONT_VALIGN_BOTTOM: y -= this.getHeight();     break;
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
        let scaleX   = this._scaleX;
        let scaleY   = this._scaleY;
        mat4.translate(mvMatrix, mvMatrix, [x, y, 0]);
        mat4.scale(mvMatrix, mvMatrix, [scaleX, scaleY, 0]);
        for (let i = 0; i < s.length; i++) {
            let ch             = s.charCodeAt(i);
            let characterWidth = 0
            if (ch === 32) {
                characterWidth = charInfo['a'.charCodeAt(0)].width;
            } else if ((ch >= 33) && (ch < 127)) {
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
