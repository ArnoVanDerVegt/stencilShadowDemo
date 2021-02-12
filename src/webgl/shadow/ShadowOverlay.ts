declare var vec3: any;

interface IShadowOverlay {
    _renderer:           IRenderer;
    _positionBuffer:     IBuffer;
    _colorBuffer:        IBuffer;
    _textureCoordBuffer: IBuffer;
    _normalBuffer:       IBuffer;
    _indexBuffer:        IBuffer;
    render(): void;
}

class ShadowOverlay implements IShadowOverlay {
    _renderer:           IRenderer;
    _positionBuffer:     IBuffer;
    _colorBuffer:        IBuffer;
    _textureCoordBuffer: IBuffer;
    _normalBuffer:       IBuffer;
    _indexBuffer:        IBuffer;

    /**
     * Create buffers for an overlay...
    **/
    constructor(opts) {
        let renderer      = opts.renderer;
        let gl            = renderer.getGl();
        let shaderProgram = renderer.getShaderProgram();
        let width         = renderer.getViewportWidth();
        let height        = renderer.getViewportHeight();
        let glVertices    = [0, 0, 0, width, 0, 0, width, height, 0, 0, height, 0];
        let glIndices     = [0, 1, 2,  2, 3, 0];
        let glColors      = [0, 0, 0, 1,  0, 0, 0, 1,  0, 0, 0, 1,  0, 0, 0, 1];
        // Create a rectangle...
        this._textureCoordBuffer = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 0, attribute: shaderProgram.textureCoordAttribute  });
        this._normalBuffer       = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 0, attribute: shaderProgram.vertexNormalAttribute  });
        this._colorBuffer        = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 4, attribute: shaderProgram.vertexColorAttribute   }).create(glColors);
        this._positionBuffer     = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 3, attribute: shaderProgram.vertexPositionAttribute}).create(glVertices);
        this._indexBuffer        = new Buffer({gl: gl, type: gl.ELEMENT_ARRAY_BUFFER, itemSize: 1, attribute: null                                 }).create(glIndices);
        this._renderer           = renderer;
    }

    /**
     * This function darkens the spots which are covered by shadows...
    **/
    render(): void {
        let renderer = this._renderer;
        let gl       = renderer.getGl();
        renderer.mvPushMatrix();
            gl.disable(gl.DEPTH_TEST);               // No depth test...
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP); // Don't change the stencil buffer...
            this._textureCoordBuffer.disable();
            this._normalBuffer.disable();
            this._positionBuffer.bind().enable();
            this._colorBuffer.bind().enable();
            this._indexBuffer.bind();
            gl.depthMask(false);                                 // Don't write to the depth buffer...
            gl.blendFunc(gl.ONE, gl.SRC_ALPHA);                  // Enable blending...
            gl.enable(gl.STENCIL_TEST);                          // The stencil buffer contains the shadow values...
            gl.enable(gl.BLEND);
            gl.uniform1f(renderer.getModeUniform(), ColorMode.Color); // Enable color...
            // Render 2D...
            renderer.pPushMatrix();
                mat4.ortho(renderer.getPMatrix(), 0, renderer.getViewportWidth(), renderer.getViewportHeight(), 0, 0, -100);
                let mvMatrix = renderer.identity();
                //mat4.translate(mvMatrix, mvMatrix, [renderer.getViewportWidth() / 2, 0, 0]);
                renderer.setMatrixUniforms();
                // Render 3 passes, each pas with a darker alpha value...
                let stencil = 128;
                while (stencil < 132) {
                    stencil++;
                    // The stencil value controls the darkness,
                    // with each shadow the stencil buffer is increased.
                    // When more shadows overlap the shadow gets darker.
                    gl.stencilFunc(gl.EQUAL, stencil, 255);
                    gl.uniform1f(renderer.getAlphaUniform(), 0.8 - (stencil - 129) * 0.1);
                    this._indexBuffer.draw();
                }
                gl.depthMask(true); // Enable depth buffer updates again...
                gl.disable(gl.BLEND);
                gl.disable(gl.STENCIL_TEST);
            renderer.pPopMatrix();
        renderer.mvPopMatrix();
    }
}
