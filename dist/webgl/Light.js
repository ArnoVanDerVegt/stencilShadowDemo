class Light {
    constructor(opts) {
        this._renderer = opts.renderer;
        // Create a small cube to show the light position...
        this._cube = new Box({ renderer: opts.renderer, mode: MODE_TEXTURE_FLAT, texture: new Texture({ renderer: this._renderer, color1: '#FFFFFF', color2: '#FFDD00' }), sizeX: 0.2, sizeY: 0.2, sizeZ: 0.2 });
    }
    /**
     * Update the light source position, render a cube to show the position...
    **/
    update(angle) {
        let renderer = this._renderer;
        let gl = renderer.getGl();
        let shaderProgram = renderer.getShaderProgram();
        this._location = vec3.fromValues(Math.sin(angle) * 6, 18 + Math.cos(angle * 0.5) * 4, Math.cos(angle * 0.8) * 9);
        renderer.mvPushMatrix();
        // Move to the light position...
        let mvMatrix = renderer.getMvMatrix();
        mat4.translate(mvMatrix, mvMatrix, this._location);
        renderer.setMvMatrix(mvMatrix);
        gl.stencilFunc(gl.NEVER, 0, 255);
        // Set alpha, disable lighting...
        gl.uniform1f(renderer.getAlphaUniform(), 1);
        gl.uniform1f(renderer.getModeUniform(), MODE_TEXTURE);
        // Render the cube...
        this._cube.render();
        // Set the light position, color and the ambient color...
        gl.uniform3f(renderer.getLightingLocationUniform(), mvMatrix[12], mvMatrix[13], mvMatrix[14]);
        gl.uniform3f(renderer.getLightingColorUniform(), 0.5, 0.5, 0.5);
        gl.uniform3f(renderer.getAmbientColorUniform(), 0.5, 0.5, 0.5);
        renderer.mvPopMatrix();
    }
    getLocation() {
        return this._location;
    }
}
