class Engine {
    constructor() {
        let renderer = new Renderer(document.getElementById('demoCanvas'));
        let gl = renderer.getGl();
        renderer.initShaders();
        gl.clearColor(0.5, 0.7, 0.8, 1.0);
        gl.clearStencil(128);
        gl.enable(gl.DEPTH_TEST);
        this._renderer = renderer;
        this._shapeList = [];
        this._shapeInstances = [];
        this._shadowOverlay = new ShadowOverlay({ renderer: renderer });
        this._light = new Light({ renderer: renderer });
        this._lastTime = 0;
        this._zoom = 40;
        setTimeout(this._update.bind(this), 1);
    }
    /**
     * Add a shape to the list, check if a shadow builder is needed...
    **/
    addShape(shape, shadow) {
        shape.setShadow(shadow ? new GlShadowBuilder({ objct: shape, renderer: this._renderer }) : null);
        this._shapeList.push(shape);
        return this;
    }
    ;
    renderShapeInstances(types) {
        let renderer = this._renderer;
        let gl = renderer.getGl();
        this._shapeInstances.forEach((shapeInstance) => {
            let shadowBuilderList = this._shapeList[shapeInstance.shape];
            if (types.indexOf(shadowBuilderList.getColorMode()) !== -1) {
                renderer.mvPushMatrix();
                this.applyShapeInstance(shapeInstance);
                gl.uniform1f(renderer.getVertexModeUniform(), shapeInstance.vertexMode);
                shadowBuilderList
                    .setAlpha(shapeInstance.alpha)
                    .render();
                renderer.mvPopMatrix();
            }
        });
        gl.uniform1f(renderer.getVertexModeUniform(), VertexMode.Default);
        return this;
    }
    renderShadows() {
        let renderer = this._renderer;
        this._shapeInstances.forEach((shapeInstance) => {
            let shape = this._shapeList[shapeInstance.shape];
            let shadow = shape.getShadow();
            if (shadow === null) {
                return;
            }
            renderer.mvPushMatrix();
            this.applyShapeInstance(shapeInstance);
            let mvMatrix = renderer.getMvMatrix();
            shadow
                .update(this._light.getLocation(), shapeInstance.angle, mvMatrix, this._zoom)
                .render();
            renderer.mvPopMatrix();
        });
    }
    /**
     * Render all objects and their shadows...
    **/
    render() {
        let renderer = this._renderer;
        let gl = renderer.getGl();
        let shaderProgram = renderer.getShaderProgram();
        gl.uniform1f(renderer.getWaterOffsetUniform(), ((Date.now() * 0.02) % 100) * Math.PI / 50);
        gl.viewport(0, 0, renderer.getViewportWidth(), renderer.getViewportHeight());
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        mat4.perspective(renderer.getPMatrix(), 45, renderer.getScreenWidth() / renderer.getScreenHeight(), 0.1, 100.0);
        this.updateCamera();
        // Render all objects...
        this
            .renderShapeInstances([ColorMode.Texture, ColorMode.TextureFlat, ColorMode.TexturePhong])
            .renderShapeInstances([ColorMode.TextureAlpha])
            .renderShadows();
        this._shadowOverlay.render();
        this._shapeInstances.length = 0;
    }
    ;
    update(elapsed) {
    }
    _update() {
        requestAnimFrame(this._update.bind(this));
        this.render();
        let time = new Date().getTime();
        if (this._lastTime !== 0) {
            this.update(time - this._lastTime);
        }
        this._lastTime = time;
    }
    updateCamera() {
    }
    applyShapeInstance(shapeInstance) {
        let mvMatrix = this._renderer.getMvMatrix();
        mat4.translate(mvMatrix, mvMatrix, shapeInstance.location);
        if (shapeInstance.angle[0] !== 0) {
            mat4.rotateX(mvMatrix, mvMatrix, shapeInstance.angle[0]);
        }
        if (shapeInstance.angle[1] !== 0) {
            mat4.rotateY(mvMatrix, mvMatrix, shapeInstance.angle[1]);
        }
        if (shapeInstance.angle[2] !== 0) {
            mat4.rotateZ(mvMatrix, mvMatrix, shapeInstance.angle[2]);
        }
        this._renderer.setMvMatrix(mvMatrix);
    }
}
