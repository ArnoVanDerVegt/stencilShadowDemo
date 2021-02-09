declare var mat4: any;

interface IGlLight {
    _cube:     IGlShape;
    _location: INumberList;
    _renderer: IGlRenderer;
    update(angle: number): void;
    getLocation(): INumberList;
}

interface ILightOpts {
    renderer: IGlRenderer;
}

class GlLight implements IGlLight {
     _cube:     IGlShape;
     _location: INumberList;
     _renderer: IGlRenderer;

    constructor(opts: ILightOpts) {
        this._renderer = opts.renderer;
        // Create a small cube to show the light position...
        this._cube = new GlCube({renderer: opts.renderer, texture: createTexture(this._renderer, '#FFFFFF', '#FFDD00'), sizeX: 0.2, sizeY: 0.2, sizeZ: 0.2});
    }

    /**
     * Update the light source position, render a cube to show the position...
    **/
    update(angle: number): void {
        let renderer:      IGlRenderer      = this._renderer;
        let gl:            IGl              = renderer.getGl();
        let shaderProgram: IGlShaderProgram = renderer.getShaderProgram();
        this._location = vec3.fromValues(Math.sin(angle) * 6, 18 + Math.cos(angle * 0.5) * 4, Math.cos(angle * 0.8) * 9);
        renderer.mvPushMatrix();
            // Move to the light position...
            let mvMatrix: INumberList = renderer.getMvMatrix();
            mat4.translate(mvMatrix, mvMatrix, this._location);
            renderer.setMvMatrix(mvMatrix);
            gl.stencilFunc(gl.NEVER, 0, 255);
            // Set alpha, disable lighting...
            gl.uniform1f(renderer.getAlphaUniform(),       1);
            gl.uniform1i(renderer.getUseLightingUniform(), 0);
            // Render the cube...
            this._cube.render();
            // Set the light position, color and the ambient color...
            gl.uniform3f(renderer.getLightingLocationUniform(), mvMatrix[12], mvMatrix[13], mvMatrix[14]);
            gl.uniform3f(renderer.getLightingColorUniform(), 0.5, 0.5, 0.5);
            gl.uniform3f(renderer.getAmbientColorUniform(),  0.5, 0.5, 0.5);
        renderer.mvPopMatrix();
    }

    getLocation(): INumberList {
        return this._location;
    }
}
