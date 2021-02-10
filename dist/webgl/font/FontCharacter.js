class FontCharacter {
    /**
     * Create buffers for an overlay...
    **/
    constructor(opts) {
        let renderer = opts.renderer;
        let gl = renderer.getGl();
        let shaderProgram = renderer.getShaderProgram();
        let ch = charInfo[65];
        let glVertices = [0, 0, 0, ch.width, 0, 0, ch.width, ch.height, 0, 0, ch.height, 0];
        let glIndices = [0, 1, 2, 2, 3, 0];
        let glTextureCoords = [ch.x, ch.y, ch.x + ch.width, ch.y, ch.x + ch.width, ch.y + ch.height, ch.x, ch.y + ch.height];
        for (let i = 0; i < glTextureCoords.length; i++) {
            glTextureCoords[i] /= 1024;
        }
        this._colorBuffer = new Buffer({ gl: gl, type: gl.ARRAY_BUFFER, itemSize: 0, attribute: shaderProgram.vertexColorAttribute });
        this._normalBuffer = new Buffer({ gl: gl, type: gl.ARRAY_BUFFER, itemSize: 0, attribute: shaderProgram.vertexNormalAttribute });
        this._positionBuffer = new Buffer({ gl: gl, type: gl.ARRAY_BUFFER, itemSize: 3, attribute: shaderProgram.vertexPositionAttribute }).create(glVertices);
        this._textureCoordBuffer = new Buffer({ gl: gl, type: gl.ARRAY_BUFFER, itemSize: 2, attribute: shaderProgram.textureCoordAttribute }).create(glTextureCoords);
        this._indexBuffer = new Buffer({ gl: gl, type: gl.ELEMENT_ARRAY_BUFFER, itemSize: 1, attribute: null }).create(glIndices);
        this._renderer = renderer;
    }
    /**
     * This function darkens the spots which are covered by shadows...
    **/
    render(texture) {
        if (!texture.getReady()) {
            return;
        }
        let renderer = this._renderer;
        let gl = renderer.getGl();
        renderer.mvPushMatrix();
        gl.depthMask(false);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        renderer.pPushMatrix();
        mat4.ortho(renderer.getPMatrix(), 0, renderer.getViewportWidth(), renderer.getViewportHeight(), 0, 0, -100);
        let mvMatrix = renderer.identity();
        //mat4.translate(mvMatrix, mvMatrix, [renderer.getViewportWidth() / 2, 0, 0]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.getTexture());
        gl.uniform1i(renderer.getSamplerUniform(), 0);
        gl.uniform1f(renderer.getModeUniform(), MODE_TEXTURE);
        gl.uniform1f(renderer.getAlphaUniform(), 1);
        renderer.setMatrixUniforms();
        this._colorBuffer.disable();
        this._normalBuffer.disable();
        this._positionBuffer.bind().enable();
        this._textureCoordBuffer.bind().enable();
        this._indexBuffer.bind().draw();
        renderer.pPopMatrix();
        gl.disable(gl.BLEND);
        gl.depthMask(true);
        renderer.mvPopMatrix();
    }
}
