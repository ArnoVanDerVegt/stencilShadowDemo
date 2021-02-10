interface IBuffer {
    _gl:        IGl;
    _buffer:    IGlBuffer;
    _type:      number;
    _itemSize:  number;
    _itemCount: number;
    _attribute: any;
    create(data: any): IBuffer;
    bind(): IBuffer;
    enable(): void;
    disable(): void;
    draw(): void;
}

class Buffer implements IBuffer {
    _gl:        IGl;
    _buffer:    IGlBuffer;
    _type:      number;
    _itemSize:  number;
    _itemCount: number;
    _attribute: any;

    constructor(opts) {
        this._gl        = opts.gl;
        this._type      = opts.type;
        this._itemSize  = opts.itemSize;
        this._attribute = opts.attribute;
    }

    create(data: any): IBuffer {
        let gl = this._gl;
        let a  = (this._type === gl.ARRAY_BUFFER) ? new Float32Array(data) : new Uint16Array(data);
        this._itemCount = data.length;
        this._buffer    = gl.createBuffer();
        gl.bindBuffer(this._type, this._buffer);
        gl.bufferData(this._type, a, gl.STATIC_DRAW);
        return this;
    }

    bind(): IBuffer {
        let gl   = this._gl;
        let type = (this._type === gl.ARRAY_BUFFER) ?  gl.FLOAT : gl.UNSIGNED_SHORT;
        gl.bindBuffer(this._type, this._buffer);
        if (this._attribute !== null) {
            gl.vertexAttribPointer(this._attribute, this._itemSize, type, false, 0, 0);
        }
        return this;
    }

    enable(): void {
        this._gl.enableVertexAttribArray(this._attribute);
    }

    disable(): void {
        this._gl.disableVertexAttribArray(this._attribute);
    }

    draw() {
        let gl = this._gl;
        gl.drawElements(gl.TRIANGLES, this._itemCount, gl.UNSIGNED_SHORT, 0);
    }
}
