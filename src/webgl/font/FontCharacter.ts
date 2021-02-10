interface IFontCharacter {
    _renderer:           IRenderer;
    _colorBuffer:        IBuffer;
    _normalBuffer:       IBuffer;
    _positionBuffer:     IBuffer;
    _textureCoordBuffer: IBuffer;
    _indexBuffer:        IBuffer;
    render(): void;
}

class FontCharacter implements IFontCharacter {
    _renderer:           IRenderer;
    _colorBuffer:        IBuffer;
    _normalBuffer:       IBuffer;
    _positionBuffer:     IBuffer;
    _textureCoordBuffer: IBuffer;
    _indexBuffer:        IBuffer;

    /**
     * Create buffers for an overlay...
    **/
    constructor(opts) {
        let renderer        = opts.renderer;
        let gl              = renderer.getGl();
        let shaderProgram   = renderer.getShaderProgram();
        let ch              = charInfo[opts.ch];
        let glVertices      = [0, 0, 0, ch.width, 0, 0, ch.width, ch.height, 0, 0, ch.height, 0];
        let glIndices       = [0, 1, 2,  2, 3, 0];
        let glTextureCoords = [ch.x, ch.y, ch.x + ch.width, ch.y, ch.x + ch.width, ch.y + ch.height, ch.x, ch.y + ch.height];
        for (let i = 0; i < glTextureCoords.length; i++) {
            glTextureCoords[i] /= 1024;
        }
        this._colorBuffer        = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 0, attribute: shaderProgram.vertexColorAttribute   });
        this._normalBuffer       = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 0, attribute: shaderProgram.vertexNormalAttribute  });
        this._positionBuffer     = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 3, attribute: shaderProgram.vertexPositionAttribute}).create(glVertices);
        this._textureCoordBuffer = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 2, attribute: shaderProgram.textureCoordAttribute  }).create(glTextureCoords);
        this._indexBuffer        = new Buffer({gl: gl, type: gl.ELEMENT_ARRAY_BUFFER, itemSize: 1, attribute: null                                 }).create(glIndices);
        this._renderer           = renderer;
    }

    /**
     * This function darkens the spots which are covered by shadows...
    **/
    render(): void {
        this._colorBuffer.disable();
        this._normalBuffer.disable();
        this._positionBuffer.bind().enable();
        this._textureCoordBuffer.bind().enable();
        this._indexBuffer.bind().draw();
    }
}
