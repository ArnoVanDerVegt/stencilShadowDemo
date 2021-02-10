interface IGlVertices {
    [index:number]: INumberList;
    length:         number;
    push(...args: any[]);
    pop(): any;
}

interface IGlBuffer {
    itemSize: number;
    numItems: number;
}

interface IGlTexture {
}

interface IGlShaderProgram {
    textureCoordAttribute:   number;
    vertexPositionAttribute: number;
    vertexNormalAttribute:   number;
    vertexColorAttribute:    number;
}

interface IGl {
    ALWAYS:                number;
    ARRAY_BUFFER:          number;
    BACK:                  number;
    BLEND:                 number;
    CLAMP_TO_EDGE:         number;
    COLOR_BUFFER_BIT:      number;
    COMPILE_STATUS:        number;
    CULL_FACE:             number;
    DECR:                  number;
    DEPTH_TEST:            number;
    DEPTH_BUFFER_BIT:      number;
    ELEMENT_ARRAY_BUFFER:  number;
    EQUAL:                 number;
    FRAGMENT_SHADER:       number;
    FLOAT:                 number;
    FRONT:                 number;
    INCR:                  number;
    KEEP:                  number;
    LESS:                  number;
    LEQUAL:                number;
    LINEAR_MIPMAP_NEAREST: number;
    LINEAR:                number;
    LINK_STATUS:           string;
    NEVER:                 number;
    ONE:                   number;
    ONE_MINUS_SRC_ALPHA:   number;
    RGBA:                  number;
    SRC_ALPHA:             number;
    STENCIL_BUFFER_BIT:    number;
    STATIC_DRAW:           number;
    STENCIL_TEST:          number;
    TEXTURE0:              number;
    TEXTURE_2D:            number;
    TEXTURE_MIN_FILTER:    number;
    TEXTURE_MAG_FILTER:    number;
    TEXTURE_WRAP_S:        number;
    TEXTURE_WRAP_T:        number;
    TRIANGLES:             number;
    UNSIGNED_SHORT:        number;
    UNSIGNED_BYTE:         number;
    VERTEX_SHADER:         number;
    activeTexture(index: number): void;
    attachShader(program: IGlShaderProgram, shader: any): void;
    bindBuffer(target: number, buffer: IGlBuffer): void;
    bindTexture(index: number, texture: IGlTexture): void;
    blendFunc(sfactor: number, dfactor: number): void;
    bufferData(target: number, srcData: any, usage: number): void;
    clear(v0: number): void;
    clearColor(r: number, g: number, b: number, a: number): void;
    clearStencil(v0: number): void;
    createShader(type: number): IGlShaderProgram;
    createTexture(): IGlTexture;
    createBuffer(): IGlBuffer;
    createProgram(): IGlShaderProgram;
    compileShader(shader: IGlShaderProgram): void;
    colorMask(r: Boolean, g: Boolean, b: Boolean, a: Boolean): void;
    cullFace(n: number): void;
    depthFunc(n: number): void;
    depthMask(n: Boolean): void;
    deleteBuffer(target: IGlBuffer): void;
    disable(index: number): void;
    disableVertexAttribArray(index: number): void;
    drawElements(mode: number, count: number, type: number, offset: number): void;
    enable(index: number): void;
    enableVertexAttribArray(index: number): void;
    generateMipmap(target: number): void;
    getAttribLocation(program: IGlShaderProgram, name: string): any;
    getUniformLocation(program: IGlShaderProgram, name: string): any;
    getProgramParameter(program: IGlShaderProgram, pname: string): number;
    getShaderParameter(shader: IGlShaderProgram, pname: number): any;
    getShaderInfoLog(shader: IGlShaderProgram): void;
    linkProgram(program: IGlShaderProgram): void;
    stencilFunc(func: number, ref: number, mask: number): void;
    stencilMask(n: number): void;
    stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number): void;
    stencilOp(fail: number, zfail: number, zpass: number): void;
    shaderSource(shader: IGlShaderProgram, source: string): void;
    uniform1f(location: number, v0: number): void;
    uniform1i(location: number, v0: number): void;
    uniform3f(location: number, v0: number, v1: number, v2: number): void;
    uniformMatrix2fv(location: number, transpose: boolean, value: number): void;
    uniformMatrix3fv(location: number, transpose: boolean, value: number): void;
    uniformMatrix4fv(location: number, transpose: boolean, value: INumberList): void;
    useProgram(program: IGlShaderProgram): void;
    vertexAttribPointer(index: number, size: number, type: number, normalized: Boolean, stride: number, offset: number): void;
    viewport(x: number, y: number, width: number, height: number): void;
    texImage2D(target: any, level: any, internalformat: any, format: any, type: any, ImageBitmap: any): void;
    texParameteri(target: number, pname: number, param: number): void;
    texParameterf(target: number, pname: number, param: number): void;
}
