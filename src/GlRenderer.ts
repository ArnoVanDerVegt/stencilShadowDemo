declare var mat3: any;
declare var mat4: any;

const VERTEX_SHADER: string = [
        '#ifdef GL_ES',
        'precision highp float;',
        '#endif',
        '',
        'varying vec2 vTextureCoord;',
        'varying vec3 vLightWeighting;',
        'varying vec4 vColor;',
        '',
        'uniform sampler2D uSampler;',
        'uniform bool uUseLighting;',
        'uniform bool uUseColor;',
        'uniform float uAlpha;',
        '',
        'void main(void) {',
        '    if (!uUseColor) {',
        '        vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
        '        if (!uUseLighting) {',
        '            gl_FragColor = vec4(textureColor.rgb, textureColor.a);',
        '        }',
        '        else {',
        '            gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);',
        '        }',
        '    }',
        '    else {',
        '        gl_FragColor = vColor * uAlpha;',
        '    }',
        '}'
    ].join('\n');

const FRAGMENT_SHADER: string = [
        'attribute vec3 aVertexPosition;',
        'attribute vec3 aVertexNormal;',
        'attribute vec2 aTextureCoord;',
        '',
        'uniform mat4 uMVMatrix;',
        'uniform mat4 uPMatrix;',
        'uniform mat3 uNMatrix;',
        '',
        'uniform vec3 uAmbientColor;',
        '',
        'uniform vec3 uLightingLocation;',
        'uniform vec3 uLightingColor;',
        '',
        'uniform bool uUseLighting;',
        'uniform bool uUseColor;',
        '',
        'varying vec2 vTextureCoord;',
        'varying vec3 vLightWeighting;',
        '',
        'varying vec4 vColor;',
        '',
        'attribute vec4 aVertexColor;',
        '',
        'void main(void) {',
        '    if (!uUseColor) {',
        '        vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);',
        '        gl_Position = uPMatrix * mvPosition;',
        '        vTextureCoord = aTextureCoord;',
        '',
        '        if (!uUseLighting) {',
        '            vLightWeighting = vec3(0.4, 0.4, 0.4);',
        '        }',
        '        else {',
        '            vec3 lightDirection = normalize(uLightingLocation - mvPosition.xyz);',
        '',
        '            vec3 transformedNormal = uNMatrix * aVertexNormal;',
        '            float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);',
        '            vLightWeighting = uAmbientColor + uLightingColor * directionalLightWeighting;',
        '        }',
        '    }',
        '    else {',
        '        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
        '        vColor = aVertexColor;',
        '    }',
        '}'
    ].join('\n');

interface IGlBuffer {
    itemSize: number;
    numItems: number;
}

interface IGlShaderProgram {
    useLightingUniform:      number;
    useColorUniform:         number;
    alphaUniform:            number;
    samplerUniform:          number;
    lightingLocationUniform: number;
    lightingColorUniform:    number;
    ambientColorUniform:     number;
    pMatrixUniform:          number;
    mvMatrixUniform:         number;
    nMatrixUniform:          number;
    textureCoordAttribute:   number;
    vertexPositionAttribute: number;
    vertexNormalAttribute:   number;
    vertexColorAttribute:    number;
}

interface IGl {
    ONE:                   number;
    NEVER:                 number;
    FLOAT:                 number;
    DECR:                  number;
    INCR:                  number;
    KEEP:                  number;
    ALWAYS:                number;
    LESS:                  number;
    LEQUAL:                number;
    EQUAL:                 number;
    FRONT:                 number;
    BACK:                  number;
    BLEND:                 number;
    DEPTH_TEST:            number;
    SRC_ALPHA:             number;
    TRIANGLES:             number;
    UNSIGNED_SHORT:        number;
    COLOR_BUFFER_BIT:      number;
    DEPTH_BUFFER_BIT:      number;
    STENCIL_BUFFER_BIT:    number;
    ARRAY_BUFFER:          number;
    ELEMENT_ARRAY_BUFFER:  number;
    STATIC_DRAW:           number;
    CULL_FACE:             number;
    STENCIL_TEST:          number;
    TEXTURE0:              number;
    TEXTURE_2D:            number;
    TEXTURE_MIN_FILTER:    number;
    TEXTURE_MAG_FILTER:    number;
    TEXTURE_WRAP_S:        number;
    TEXTURE_WRAP_T:        number;
    CLAMP_TO_EDGE:         number;
    FRAGMENT_SHADER:       number;
    VERTEX_SHADER:         number;
    COMPILE_STATUS:        number;
    LINEAR_MIPMAP_NEAREST: number;
    UNSIGNED_BYTE:         number;
    RGBA:                  number;
    LINEAR:                number;
    LINK_STATUS:           string;
    stencilFunc(func: number, ref: number, mask: number);
    enable(index: number);
    disable(index: number);
    viewport(x: number, y: number, width: number, height: number);
    clear(v0: number);
    clearColor(r: number, g: number, b: number, a: number);
    clearStencil(v0: number);
    createBuffer();
    bindBuffer(target: number, buffer: IGlBuffer);
    bufferData(target: number, srcData: any, usage: number);
    deleteBuffer(target: IGlBuffer);
    vertexAttribPointer(index: number, size: number, type: number, normalized: Boolean, stride: number, offset: number);
    disableVertexAttribArray(index: number);
    enableVertexAttribArray(index: number);
    colorMask(r: Boolean, g: Boolean, b: Boolean, a: Boolean);
    stencilMask(n: number);
    depthMask(n: Boolean);
    depthFunc(n: number);
    drawElements(mode: number, count: number, type: number, offset: number);
    stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number);
    stencilOp(fail: number, zfail: number, zpass: number);
    blendFunc(sfactor: number, dfactor: number);
    cullFace(n: number);
    activeTexture(index: number);
    bindTexture(index: number, texture: any);
    uniform1f(location: number, v0: number);
    uniform1i(location: number, v0: number);
    uniform3f(location: number, v0: number, v1: number, v2: number);
    uniformMatrix2fv(location: number, transpose: boolean, value: number);
    uniformMatrix3fv(location: number, transpose: boolean, value: number);
    uniformMatrix4fv(location: number, transpose: boolean, value: INumberList);
    createProgram();
    getUniformLocation(program: IGlShaderProgram, name: string);
    getAttribLocation(program: IGlShaderProgram, name: string);
    getProgramParameter(program: IGlShaderProgram, pname: string);
    attachShader(program: IGlShaderProgram, shader: any);
    useProgram(program: IGlShaderProgram);
    linkProgram(program: IGlShaderProgram);
    getShaderParameter(shader: IGlShaderProgram, pname: number);
    shaderSource(shader: IGlShaderProgram, source: string);
    createShader(type: number): IGlShaderProgram;
    compileShader(shader: IGlShaderProgram);
    getShaderInfoLog(shader: IGlShaderProgram);
    createTexture(): any;
    texImage2D(target: any, level: any, internalformat: any, format: any, type: any, ImageBitmap: any);
    texParameteri(target: number, pname: number, param: number);
    texParameterf(target: number, pname: number, param: number);
    generateMipmap(target: number);
}

interface IGlRenderer {
    _viewportWidth:  number;
    _viewportHeight: number;
    _mvMatrix:       INumberList;
    _mvMatrixStack:  INumberList;
    _pMatrix:        INumberList;
    _pMatrixStack:   INumberList;
    _gl:             IGl;
    _shaderProgram:  IGlShaderProgram;
    getGl(): IGl;
    getMvMatrix(): INumberList;
    setMvMatrix(mvMatrix: INumberList): void;
    getPMatrix(): INumberList;
    getShaderProgram(): IGlShaderProgram;
    getViewportWidth(): number;
    getViewportHeight(): number;
    getScreenWidth(): number;
    setScreenWidth(screenWidth: number): void;
    getScreenHeight(): number;
    setScreenHeight(screenHeight: number): void;
    getShader(type: string, source: string): IGlShaderProgram;
    setMatrixUniforms(): void;
    identity(): any;
    initShaders(): void;
    mvPushMatrix(): void;
    mvPopMatrix(): void;
    pPushMatrix(): void;
    pPopMatrix(): void;
    onResize(): void;
}

class GlRenderer implements IGlRenderer {
    _screenWidth:    number;
    _screenHeight:   number;
    _viewportWidth:  number;
    _viewportHeight: number;
    _mvMatrix:       INumberList;
    _mvMatrixStack:  INumberList;
    _pMatrix:        INumberList;
    _pMatrixStack:   INumberList;
    _gl:             IGl;
    _shaderProgram:  IGlShaderProgram;

    constructor(canvas: any) {
        let gl;
        try {
            gl = canvas.getContext('experimental-webgl', {stencil: 8});
        }
        catch (e) {
        }
        if (!gl) {
            alert('Could not initialise WebGL, sorry :-(');
        }
        this._screenWidth    = window.innerWidth;
        this._screenHeight   = window.innerHeight;
        this._viewportWidth  = canvas.width;
        this._viewportHeight = canvas.height;
        this._mvMatrix       = mat4.create();
        this._mvMatrixStack  = [];
        this._pMatrix        = mat4.create();
        this._pMatrixStack   = [];
        this._gl             = gl;
        this._shaderProgram  = null;
        window.addEventListener('resize', this.onResize.bind(this));
    }

    getGl() {
        return this._gl;
    }

    getMvMatrix() {
        return this._mvMatrix;
    }

    setMvMatrix(mvMatrix: INumberList): void {
        this._mvMatrix = mvMatrix;
    }

    getPMatrix(): INumberList {
        return this._pMatrix;
    }

    getShaderProgram(): IGlShaderProgram {
        return this._shaderProgram;
    }

    getViewportWidth(): number {
        return this._viewportWidth;
    }

    getViewportHeight(): number {
        return this._viewportHeight;
    }

    getScreenWidth(): number {
        return this._screenWidth;
    }

    setScreenWidth(screenWidth: number): void {
        this._screenWidth = screenWidth;
    }

    getScreenHeight(): number {
        return this._screenHeight;
    }

    setScreenHeight(screenHeight: number): void {
        this._screenHeight = screenHeight;
    }

    identity(): any {
        mat4.identity(this._mvMatrix, this._mvMatrix);
        return this._mvMatrix;
    }

    initShaders(): void {
        let gl             = this._gl;
        let fragmentShader = this.getShader('fragment', VERTEX_SHADER);
        let vertexShader   = this.getShader('vertex', FRAGMENT_SHADER);
        let shaderProgram  = gl.createProgram();
        this._shaderProgram = shaderProgram;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        gl.useProgram(shaderProgram);
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal');
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        shaderProgram.pMatrixUniform          = gl.getUniformLocation(shaderProgram, 'uPMatrix');
        shaderProgram.mvMatrixUniform         = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
        shaderProgram.nMatrixUniform          = gl.getUniformLocation(shaderProgram, 'uNMatrix');
        shaderProgram.samplerUniform          = gl.getUniformLocation(shaderProgram, 'uSampler');
        shaderProgram.useLightingUniform      = gl.getUniformLocation(shaderProgram, 'uUseLighting');
        shaderProgram.useColorUniform         = gl.getUniformLocation(shaderProgram, 'uUseColor');
        shaderProgram.alphaUniform            = gl.getUniformLocation(shaderProgram, 'uAlpha');
        shaderProgram.ambientColorUniform     = gl.getUniformLocation(shaderProgram, 'uAmbientColor');
        shaderProgram.lightingLocationUniform = gl.getUniformLocation(shaderProgram, 'uLightingLocation');
        shaderProgram.lightingColorUniform    = gl.getUniformLocation(shaderProgram, 'uLightingColor');
    }

    getShader(type: string, source: string): IGlShaderProgram {
        let gl:     IGl = this._gl;
        let shader: IGlShaderProgram;
        if (type == 'fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == 'vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    setMatrixUniforms(): void {
        let gl            = this._gl;
        let shaderProgram = this._shaderProgram;
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, this._pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this._mvMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, this._mvMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }

    mvPushMatrix(): void {
        this._mvMatrixStack.push(mat4.clone(this._mvMatrix));
    }

    mvPopMatrix(): void {
        if (this._mvMatrixStack.length === 0) {
            throw 'Invalid popMatrix!';
        }
        this._mvMatrix = this._mvMatrixStack.pop();
    }

    pPushMatrix(): void {
        this._pMatrixStack.push(mat4.clone(this._pMatrix));
    }

    pPopMatrix(): void {
        if (this._pMatrixStack.length === 0) {
            throw 'Invalid popMatrix!';
        }
        this._pMatrix = this._pMatrixStack.pop();
    }

    onResize() {
        this._screenWidth  = window.innerWidth;
        this._screenHeight = window.innerHeight;
    }
}
