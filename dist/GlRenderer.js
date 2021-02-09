const FRAGMENT_SHADER = [
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
const VERTEX_SHADER = [
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
class GlRenderer {
    constructor(canvas) {
        let gl;
        try {
            gl = canvas.getContext('experimental-webgl', { stencil: 8 });
        }
        catch (e) {
        }
        if (!gl) {
            alert('Could not initialise WebGL, sorry :-(');
        }
        this._screenWidth = window.innerWidth;
        this._screenHeight = window.innerHeight;
        this._viewportWidth = canvas.width;
        this._viewportHeight = canvas.height;
        this._mvMatrix = mat4.create();
        this._mvMatrixStack = [];
        this._pMatrix = mat4.create();
        this._pMatrixStack = [];
        this._gl = gl;
        this._shaderProgram = null;
        window.addEventListener('resize', this.onResize.bind(this));
    }
    getGl() {
        return this._gl;
    }
    getMvMatrix() {
        return this._mvMatrix;
    }
    setMvMatrix(mvMatrix) {
        this._mvMatrix = mvMatrix;
    }
    getPMatrix() {
        return this._pMatrix;
    }
    getShaderProgram() {
        return this._shaderProgram;
    }
    getViewportWidth() {
        return this._viewportWidth;
    }
    getViewportHeight() {
        return this._viewportHeight;
    }
    getScreenWidth() {
        return this._screenWidth;
    }
    setScreenWidth(screenWidth) {
        this._screenWidth = screenWidth;
    }
    getScreenHeight() {
        return this._screenHeight;
    }
    setScreenHeight(screenHeight) {
        this._screenHeight = screenHeight;
    }
    identity() {
        mat4.identity(this._mvMatrix, this._mvMatrix);
        return this._mvMatrix;
    }
    initShaders() {
        let gl = this._gl;
        let fragmentShader = this.getShader('fragment', FRAGMENT_SHADER);
        let vertexShader = this.getShader('vertex', VERTEX_SHADER);
        let shaderProgram = gl.createProgram();
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
        this._pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
        this._mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
        this._nMatrixUniform = gl.getUniformLocation(shaderProgram, 'uNMatrix');
        this._samplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler');
        this._useLightingUniform = gl.getUniformLocation(shaderProgram, 'uUseLighting');
        this._useColorUniform = gl.getUniformLocation(shaderProgram, 'uUseColor');
        this._alphaUniform = gl.getUniformLocation(shaderProgram, 'uAlpha');
        this._ambientColorUniform = gl.getUniformLocation(shaderProgram, 'uAmbientColor');
        this._lightingLocationUniform = gl.getUniformLocation(shaderProgram, 'uLightingLocation');
        this._lightingColorUniform = gl.getUniformLocation(shaderProgram, 'uLightingColor');
    }
    getShader(type, source) {
        let gl = this._gl;
        let shader;
        if (type == 'fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (type == 'vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else {
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
    setMatrixUniforms() {
        let gl = this._gl;
        let shaderProgram = this._shaderProgram;
        gl.uniformMatrix4fv(this._pMatrixUniform, false, this._pMatrix);
        gl.uniformMatrix4fv(this._mvMatrixUniform, false, this._mvMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, this._mvMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(this._nMatrixUniform, false, normalMatrix);
    }
    getAlphaUniform() {
        return this._alphaUniform;
    }
    getUseColorUniform() {
        return this._useColorUniform;
    }
    getUseLightingUniform() {
        return this._useLightingUniform;
    }
    getLightingLocationUniform() {
        return this._lightingLocationUniform;
    }
    getLightingColorUniform() {
        return this._lightingColorUniform;
    }
    getAmbientColorUniform() {
        return this._ambientColorUniform;
    }
    getSamplerUniform() {
        return this._samplerUniform;
    }
    mvPushMatrix() {
        this._mvMatrixStack.push(mat4.clone(this._mvMatrix));
    }
    mvPopMatrix() {
        if (this._mvMatrixStack.length === 0) {
            throw 'Invalid popMatrix!';
        }
        this._mvMatrix = this._mvMatrixStack.pop();
    }
    pPushMatrix() {
        this._pMatrixStack.push(mat4.clone(this._pMatrix));
    }
    pPopMatrix() {
        if (this._pMatrixStack.length === 0) {
            throw 'Invalid popMatrix!';
        }
        this._pMatrix = this._pMatrixStack.pop();
    }
    onResize() {
        this._screenWidth = window.innerWidth;
        this._screenHeight = window.innerHeight;
    }
}
