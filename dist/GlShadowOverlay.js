class GlShadowOverlay {
    /**
     * Create buffers for an overlay...
    **/
    constructor(opts) {
        let renderer = opts.renderer;
        let gl = renderer.getGl();
        let size = 200;
        let glVertices = [
            0, 0, 0,
            renderer.getViewportWidth(), 0, 0,
            renderer.getViewportWidth(), renderer.getViewportHeight(), 0,
            0, renderer.getViewportHeight(), 0
        ];
        let glIndices = [0, 1, 2, 2, 3, 0];
        let glColors = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1];
        // Create a rectangle...
        this._glPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glVertices), gl.STATIC_DRAW);
        this._glPositionBuffer.itemSize = 3;
        this._glIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(glIndices), gl.STATIC_DRAW);
        this._glIndexBuffer.itemSize = 1;
        this._glIndexBuffer.numItems = glIndices.length;
        this._glColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glColors), gl.STATIC_DRAW);
        this._glColorBuffer.itemSize = 4;
        this._renderer = renderer;
    }
    /**
     * This function darkens the spots which are covered by shadows...
    **/
    render() {
        let renderer = this._renderer;
        let gl = renderer.getGl();
        let shaderProgram = renderer.getShaderProgram();
        let stencil;
        renderer.mvPushMatrix();
        gl.disable(gl.DEPTH_TEST); // No depth test...
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP); // Don't change the stencil buffer...
        // Enable the color attribute, disable texture coords and normals...
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
        gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        gl.depthMask(false); // Don't write to the depth buffer...
        // The stencil buffer contains the shadow values...
        gl.enable(gl.STENCIL_TEST);
        // Enable blending...
        gl.blendFunc(gl.ONE, gl.SRC_ALPHA);
        gl.enable(gl.BLEND);
        // Enable color...
        gl.uniform1i(shaderProgram.useColorUniform, 1);
        // Disable lighting...
        gl.uniform1i(shaderProgram.useLightingUniform, 0);
        // Render 2D...
        renderer.pPushMatrix();
        mat4.ortho(renderer.getPMatrix(), 0, renderer.getViewportWidth(), renderer.getViewportHeight(), 0, 0, -100);
        //let mvMatrix = renderer.getMvMatrix();
        //mat4.identity(mvMatrix, mvMatrix);
        //renderer.setMvMatrix(mvMatrix);
        let mvMatrix = renderer.identity();
        // Set the buffers...
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this._glPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this._glColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glIndexBuffer);
        renderer.setMatrixUniforms();
        // Render 3 passes, each pas with a darker alpha value...
        stencil = 128;
        while (stencil < 132) {
            stencil++;
            // The stencil value controls the darkness,
            // with each shadow the stencil buffer is increased.
            // When more shadows overlap the shadow gets darker.
            gl.stencilFunc(gl.EQUAL, stencil, 255);
            gl.uniform1f(shaderProgram.alphaUniform, 0.8 - (stencil - 129) * 0.1);
            // Render the rectangle...
            gl.drawElements(gl.TRIANGLES, this._glIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        gl.depthMask(true); // Enable depth buffer updates again...
        gl.disable(gl.BLEND);
        gl.disable(gl.STENCIL_TEST);
        renderer.pPopMatrix();
        renderer.mvPopMatrix();
    }
}
