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

declare var requestAnimFrame: any;

interface IShadowBuilderList {
    [index:number]: IShadowBuilder;
    length:         number;
    push(...args: any[]);
}

interface IDemo {
    _renderer:          IRenderer;
    _shadowBuilderList: IShadowBuilderList;
    _shapeInstances:    IAnyList;
    _cubeAngle:         number;
    _shadowAngle:       number;
    _shadowOverlay:     IShadowOverlay;
    _light:             ILight;
    _lastTime:          number;
    render(): void;
    animate(elapsed: number): void;
    update(): void;
}

class Demo implements IDemo {
    _renderer:          IRenderer;
    _shadowBuilderList: IShadowBuilderList;
    _shapeInstances:    IAnyList;
    _cubeAngle:         number;
    _shadowAngle:       number;
    _shadowOverlay:     IShadowOverlay;
    _light:             ILight;
    _lastTime:          number;
    _fontCharacter:     IFontCharacter;
    _fontTexture:       ITexture;

    constructor() {
        let canvas:   any         = document.getElementById('demoCanvas');
        let renderer: IRenderer = new Renderer(canvas);
        renderer.initShaders();

        let gl = renderer.getGl();
        gl.clearColor(0.5, 0.7, 0.8, 1.0);
        gl.clearStencil(128);
        gl.enable(gl.DEPTH_TEST);
        this._renderer          = renderer;
        this._shadowBuilderList = [];
        this._shapeInstances    = [];
        this._cubeAngle         = 0;
        this._shadowAngle       = 0;
        this._shadowOverlay     = null;
        this._light             = new Light({renderer: this._renderer});
        this._lastTime          = 0;

        this._fontTexture = new Texture({renderer: renderer, src: 'images/font.png'});
        this._fontCharacter = new FontCharacter({renderer: renderer})

        // Create a floor...
        this.addShape(new Cube   ({renderer: renderer, mode: MODE_TEXTURE_FLAT,  texture: new Grey({renderer: renderer}), sizeX: 15, sizeY: 1, sizeZ: 15}), false);
        //this.addShape(new Cube   ({renderer: renderer, mode: MODE_TEXTURE_FLAT,  texture: new Texture({renderer: renderer, src: 'images/font.png'}), sizeX: 15, sizeY: 1, sizeZ: 15}), false);
        // Create the rotating objects with colors...
        this.addShape(new Cube   ({renderer: renderer, mode: MODE_TEXTURE_FLAT,  texture: new RedGreen({renderer: renderer}), sizeX: 1.5, sizeY: 1.5, sizeZ: 1.5}), true);
        this.addShape(new Star   ({renderer: renderer, mode: MODE_TEXTURE_PHONG, texture: new OrangeYellow({renderer: renderer}), sizeX: 2,   sizeY: 2,   sizeZ: 0.5}), false);
        this.addShape(new Pyramid({renderer: renderer, mode: MODE_TEXTURE_FLAT,  texture: new PinkBlue({renderer: renderer}), sizeX: 1.5, sizeY: 1.5, sizeZ: 1.5}), true);
        // Create the objects on the floor in black and white...
        this.addShape(new Cube   ({renderer: renderer, mode: MODE_TEXTURE_FLAT,  texture: new BlackWhite({renderer: renderer}), sizeX: 2, sizeY: 1, sizeZ: 2}), true);
        this.addShape(new Pyramid({renderer: renderer, mode: MODE_TEXTURE_FLAT,  texture: new BlackWhite({renderer: renderer}), sizeX: 2, sizeY: 2, sizeZ: 2}), true);
        // Create an instance of the floor...
        this._shapeInstances.push({shape:0, location:[ 0, -8,  0], angle:[0, 0, 0]});
        // Create instances of the rotating objects...
        this._shapeInstances.push({shape:1, location:[-4,  5,  0], angle:[0, 0, 0]});
        this._shapeInstances.push({shape:2, location:[ 0,  1,  0], angle:[0, 0, 0]});
        this._shapeInstances.push({shape:3, location:[ 4, -3,  0], angle:[0, 0, 0]});
        // Create instances for the objects on the floor...
        this._shapeInstances.push({shape:4, location:[-8, -6,  8], angle:[0, 0, 0]});
        this._shapeInstances.push({shape:4, location:[ 8, -6, -8], angle:[0, 0, 0]});
        this._shapeInstances.push({shape:5, location:[-8, -6, -8], angle:[0, 0, 0]});
        this._shapeInstances.push({shape:5, location:[ 8, -6,  8], angle:[0, 0, 0]});
    };

    /**
     * Add a shape to the list, check if a shadow builder is needed...
    **/
    addShape(shape: IShape, shadow: boolean): void {
        shape.setShadow(shadow ? new GlShadowBuilder({object: shape, renderer: this._renderer}) : null);
        this._shadowBuilderList.push(shape);
    };

    /**
     * Update the matrix for the given shape instance...
    **/
    applyShapeInstance(shapeInstance: any): void {
        let mvMatrix = this._renderer.getMvMatrix()
        mat4.translate(mvMatrix, mvMatrix, shapeInstance.location);
        this._renderer.setMvMatrix(mvMatrix);
        if (shapeInstance.angle[0] !== 0) {
            mat4.rotateX(mvMatrix, mvMatrix, shapeInstance.angle[0]);
        }
        if (shapeInstance.angle[1] !== 0) {
            mat4.rotateY(mvMatrix, mvMatrix, shapeInstance.angle[1]);
        }
        if (shapeInstance.angle[2] !== 0) {
            mat4.rotateZ(mvMatrix, mvMatrix, shapeInstance.angle[2]);
        }
    };

    /**
     * Render all objects and their shadows...
    **/
    render(): void {
        let renderer       = this._renderer;
        let gl             = renderer.getGl();
        let shaderProgram  = renderer.getShaderProgram();
        let shapeInstances = this._shapeInstances;
        let shapeInstance;
        let shape;
        let shadow;
        let zoom           = 40;
        let i;
        gl.viewport(0, 0, renderer.getViewportWidth(), renderer.getViewportHeight());
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        mat4.perspective(renderer.getPMatrix(), 45, renderer.getScreenWidth() / renderer.getScreenHeight(), 0.1, 100.0);
        let mvMatrix = renderer.identity();
        mat4.translate(mvMatrix, mvMatrix, [0, 0, -zoom]);
        mat4.rotateX(mvMatrix, mvMatrix, 0.4);
        mat4.rotateY(mvMatrix, mvMatrix, -this._cubeAngle * 0.01);
        this._light.update(this._shadowAngle);
        // Render all objects...
        i = shapeInstances.length;
        while (i) {
            i--;
            shapeInstance = shapeInstances[i];
            renderer.mvPushMatrix();
                this.applyShapeInstance(shapeInstance);
                this._shadowBuilderList[shapeInstance.shape].render();
            renderer.mvPopMatrix();
        }
        // Render all shadows...
        i = shapeInstances.length;
        while (i) {
            i--;
            shapeInstance = shapeInstances[i];
            shape         = this._shadowBuilderList[shapeInstance.shape];
            shadow        = shape.getShadow();
            if (shadow !== null) {
                renderer.mvPushMatrix();
                    this.applyShapeInstance(shapeInstance);
                    let mvMatrix = renderer.getMvMatrix();
                    shadow.update(this._light.getLocation(), shapeInstance.angle, mvMatrix, zoom);
                    shadow.render();
                renderer.mvPopMatrix();
            }
        }
        // Render the overlay to make the shadow areas darker...
        if (!this._shadowOverlay) {
            this._shadowOverlay = new ShadowOverlay({renderer: renderer});
        }
        this._shadowOverlay.render();
        this._fontCharacter.render(this._fontTexture);
    };

    /**
     * Update angles...
    **/
    animate(elapsed: number): void {
        let shapeInstances = this._shapeInstances;
        this._cubeAngle   += 0.03  * elapsed;
        this._shadowAngle += 0.001 * elapsed;
        shapeInstances[1].angle[1] += 0.0006 * elapsed;
        shapeInstances[1].angle[2] += 0.0005 * elapsed;
        shapeInstances[2].angle[1] -= 0.0004 * elapsed;
        shapeInstances[3].angle[0] += 0.0003 * elapsed;
        shapeInstances[3].angle[1] -= 0.0005 * elapsed;
    };

    update() {
        requestAnimFrame(this.update.bind(this));
        this.render();
        let time = new Date().getTime();
        if (this._lastTime != 0) {
            this.animate(time - this._lastTime);
        }
        this._lastTime = time;
    }
}

window.addEventListener(
    'DOMContentLoaded',
    () => {
        new Demo().update();
    }
);
