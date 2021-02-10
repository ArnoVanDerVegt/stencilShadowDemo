const FRAGMENT_SHADER = `
        #ifdef GL_ES
        precision highp float;
        #endif

        const float MODE_COLOR         = 1.0;
        const float MODE_TEXTURE       = 2.0;
        const float MODE_TEXTURE_FLAT  = 3.0;
        const float MODE_TEXTURE_PHONG = 4.0;
        const float MODE_TEXTURE_ALPHA = 5.0;

        const float cShininess        = 500.0;
        const vec3  cLightDirection   = vec3(0.0, -1.0, -1.0);
        const vec4  cLightAmbient     = vec4(0.1,  0.1,  0.1,  1.0);
        const vec4  cLightDiffuse     = vec4(1.0,  1.0,  1.0,  1.0);
        const vec4  cLightSpecular    = vec4(1.0,  1.0,  1.0,  1.0);
        const vec4  cMaterialAmbient  = vec4(1.0,  1.0,  1.0,  1.0);
        const vec4  cMaterialSpecular = vec4(1.0,  1.0,  1.0,  1.0);

        varying vec2 vTextureCoord;
        varying vec3 vLightWeighting;
        varying vec4 vColor;
        varying vec3 vNormal;
        varying vec3 vEyeVec;

        uniform float     uMode;
        uniform sampler2D uSampler;
        uniform float     uAlpha;

        void main(void) {
            vec4 textureColor;
            if (uMode == MODE_COLOR) {
                gl_FragColor = vColor * uAlpha;
            } else if (uMode == MODE_TEXTURE) {
                textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
                gl_FragColor = textureColor;
            } else if (uMode == MODE_TEXTURE_FLAT) {
                textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
                gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
            } else if (uMode == MODE_TEXTURE_PHONG) {
                textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
                vec3  L           = normalize(cLightDirection);
                vec3  N           = normalize(vNormal);
                float lambertTerm = dot(N, -L);
                vec4  Ia          = cLightAmbient * cMaterialAmbient;
                vec4  Id          = vec4(0.0, 0.0, 0.0, 1.0);
                vec4  Is          = vec4(0.0, 0.0, 0.0, 1.0);
                if (lambertTerm > 0.0) {
                    Id = cLightDiffuse * vec4(textureColor.rgb, 1.0) * lambertTerm; //add diffuse term
                    vec3 E         = normalize(vEyeVec);
                    vec3 R         = reflect(L, N);
                    float specular = pow(max(dot(R, E), 0.0), cShininess);
                    Is = cLightSpecular * cMaterialSpecular * specular; //add specular term
                }
                vec4 color = Ia + Id + Is;
                color.a = 1.0;
                gl_FragColor = color;
            } else if (uMode == MODE_TEXTURE_ALPHA) {
                textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
                gl_FragColor = vec4(textureColor.rgb, uAlpha);
            }
        }
    `;
const VERTEX_SHADER = `
        const float MODE_COLOR         = 1.0;
        const float MODE_TEXTURE       = 2.0;
        const float MODE_TEXTURE_FLAT  = 3.0;
        const float MODE_TEXTURE_PHONG = 4.0;
        const float MODE_TEXTURE_ALPHA = 5.0;
        const float Z_ROUND_FIX        = 0.0001;

        attribute vec3 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;
        attribute vec4 aVertexColor;

        uniform mat4  uMVMatrix;
        uniform mat4  uPMatrix;
        uniform mat3  uNMatrix;
        uniform vec3  uAmbientColor;
        uniform vec3  uLightingLocation;
        uniform vec3  uLightingColor;
        uniform float uMode;

        varying vec2 vTextureCoord;
        varying vec3 vLightWeighting;
        varying vec4 vColor;
        varying vec3 vNormal;
        varying vec3 vEyeVec;

        void main(void) {
            if (uMode == MODE_COLOR) {
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                vColor = aVertexColor;
            } else if (uMode == MODE_TEXTURE) {
                gl_Position   = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                vTextureCoord = aTextureCoord;
            } else if (uMode == MODE_TEXTURE_FLAT) {
                vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
                gl_Position   = uPMatrix * mvPosition;
                gl_Position.z += Z_ROUND_FIX;
                vTextureCoord = aTextureCoord;
                vec3  lightDirection            = normalize(uLightingLocation - mvPosition.xyz);
                vec3  transformedNormal         = uNMatrix * aVertexNormal;
                float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
                vLightWeighting = uAmbientColor + uLightingColor * directionalLightWeighting;
            } else if (uMode == MODE_TEXTURE_PHONG) {
                vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
                gl_Position   = uPMatrix * mvPosition;
                gl_Position.z += Z_ROUND_FIX;
                vTextureCoord = aTextureCoord;
                vNormal       = uNMatrix * aVertexNormal;
                vEyeVec       = -vec3(mvPosition.xyz);
            } else if (uMode == MODE_TEXTURE_ALPHA) {
                gl_Position   = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                vTextureCoord = aTextureCoord;
            }
        }
    `;
class Renderer {
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
        this._modeUniform = gl.getUniformLocation(shaderProgram, 'uMode');
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
    getModeUniform() {
        return this._modeUniform;
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
        return this;
    }
    mvPopMatrix() {
        if (this._mvMatrixStack.length === 0) {
            throw 'Invalid popMatrix!';
        }
        this._mvMatrix = this._mvMatrixStack.pop();
        return this;
    }
    pPushMatrix() {
        this._pMatrixStack.push(mat4.clone(this._pMatrix));
        return this;
    }
    pPopMatrix() {
        if (this._pMatrixStack.length === 0) {
            throw 'Invalid popMatrix!';
        }
        this._pMatrix = this._pMatrixStack.pop();
        return this;
    }
    onResize() {
        this._screenWidth = window.innerWidth;
        this._screenHeight = window.innerHeight;
    }
}
