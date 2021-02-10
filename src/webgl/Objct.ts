declare var vec3: any;

const MODE_COLOR         = 1.0;
const MODE_TEXTURE       = 2.0;
const MODE_TEXTURE_FLAT  = 3.0;
const MODE_TEXTURE_PHONG = 4.0;

interface IObjct {
    _vertices:             IGlVertices;       // List of unique vertices of the object
    _verticesHash:         INumberHashMap;    // Hash list of vertices
    _vertexNormal:         INumberNumberList;
    _lines:                INumberList;       // List of lines in both directions...
    _linesUnique:          INumberList;       // A list of unique lines
    _triangles:            INumberList;       // Triangles in the object
    _renderer:             IRenderer;
    _texture:              ITexture;
    _glVertexCount:        number;            // The active vertex index
    _glVertices:           INumberList;       // Vertex position list for gl
    _glNormals:            INumberList;       // Normal list for gl
    _glIndices:            INumberList;       // Index list for gl
    _glTextureCoords:      INumberList;       // Texture cooordinate list for gl
    _colorBuffer:          IBuffer;
    _positionBuffer:       IBuffer;
    _normalBuffer:         IBuffer;
    _textureCoordBuffer:   IBuffer;
    _indexBuffer:          IBuffer;
    addVertex(x: number, y: number, z: number): number;
    addGLVertex(x: number, y: number, z: number, u: number, v: number): number;
    addNormal(normal: unknown): IObjct;
    addVertexNormal(vertexIndex: number, normal: INumberList): IObjct;
    addLine(v1: number, v2: number): number;
    addTriangle(x1: number, y1: number, z1: number, uu1: number, vv1: number,
                x2: number, y2: number, z2: number, uu2: number, vv2: number,
                x3: number, y3: number, z3: number, uu3: number, vv3: number): IObjct;
    createBuffers(): void;
    getVertexNormals(): INumberList;
    getVertices(): IGlVertices;
    getLines(): INumberList;
    getTriangles(): INumberList;
}

interface IObjctOpts {
    renderer: IRenderer;
    texture:  ITexture;
    mode:     number;
}

class Objct implements IObjct {
    _mode:                 number;
    _vertices:             IGlVertices;       // List of unique vertices of the object
    _verticesHash:         INumberHashMap;    // Hash list of vertices
    _vertexNormal:         INumberNumberList;
    _lines:                INumberList;       // List of lines in both directions...
    _linesUnique:          INumberList;       // A list of unique lines
    _triangles:            INumberList;       // Triangles in the object
    _renderer:             IRenderer;
    _texture:              ITexture;
    _glVertexCount:        number;            // The active vertex index
    _glVertices:           INumberList;       // Vertex position list for gl
    _glNormals:            INumberList;       // Normal list for gl
    _glIndices:            INumberList;       // Index list for gl
    _glTextureCoords:      INumberList;       // Texture cooordinate list for gl
    _colorBuffer:          IBuffer;
    _positionBuffer:       IBuffer;
    _normalBuffer:         IBuffer;
    _textureCoordBuffer:   IBuffer;
    _indexBuffer:          IBuffer;

    constructor(opts: IObjctOpts) {
        this._mode                 =  opts.mode;
        this._renderer             =  opts.renderer;
        this._texture              =  opts.texture;
        this._vertices             =  [];
        this._verticesHash         =  {};
        this._vertexNormal         =  [];
        this._lines                =  [];
        this._linesUnique          =  [];
        this._triangles            =  [];
        this._glVertexCount        = -1;
        this._glVertices           =  [];
        this._glNormals            =  [];
        this._glIndices            =  [];
        this._glTextureCoords      =  [];
        this._colorBuffer          =  null;
        this._positionBuffer       =  null;
        this._normalBuffer         =  null;
        this._textureCoordBuffer   =  null;
        this._indexBuffer          =  null;
    }

    /**
     * Add a vertex, merge close vertices...
     * Returns the vertex index
    **/
    addVertex(x: number, y: number, z: number): number {
        let hash:  string = ~~(x * 1000) + '_' + ~~(y * 1000) + '_' + ~~(z * 1000);
        let index: number = this._verticesHash[hash]; // Check if the value was added before...
        if (index === undefined) { // A new vertex...
            index                    = this._vertices.length;
            this._verticesHash[hash] = index;
            this._vertices.push([x, y, z]);
        }
        return index;
    }

    /**
     * Add position and texture cooordinates to the gl lists...
     * Returns the index of the vertex
    **/
    addGLVertex(x: number, y: number, z: number, u: number, v: number): number {
        this._glVertices.push(x, y, z);
        this._glTextureCoords.push(u, v);
        this._glVertexCount++;
        return this._glVertexCount;
    }

    /**
     * Add a normal to a gl list...
    **/
    addNormal(normal: INumberList): IObjct {
        this._glNormals.push(normal[0], normal[1], normal[2]);
        return this;
    }

    addVertexNormal(vertexIndex: number, normal: INumberList): IObjct {
        let vertexNormal = this._vertexNormal;
        if (!(vertexIndex in vertexNormal)) {
            vertexNormal[vertexIndex] = [];
        }
        vertexNormal[vertexIndex].push(normal);
        return this;
    }

    /**
     * Add a line.
     * Check if the line is also used by an other polygon.
     * Returns the index of the line.
    **/
    addLine(v1: number, v2: number): number {
        this._lines.push({v1: v1, v2: v2, a: v1 + '_' + v2, b: v2 + '_' + v1});
        return this._lines.length - 1;
    }

    /**
     * Add a triangle to this object...
     *
     * This method adds the vertex information to
     * the buffers needed the build the shadow.
    **/
    addTriangle(x1: number, y1: number, z1: number, uu1: number, vv1: number,
                x2: number, y2: number, z2: number, uu2: number, vv2: number,
                x3: number, y3: number, z3: number, uu3: number, vv3: number): IObjct {
        let triangleCount: number = this._triangles.length; // The index of the new triangle...
        // Add the vertices...
        let vertex1: number = this.addVertex(x1, y1, z1);
        let vertex2: number = this.addVertex(x2, y2, z2);
        let vertex3: number = this.addVertex(x3, y3, z3);
        // Add the lines, these are used to calculate the edge of the object...
        // Each line is associated with the new triangle...
        let line1: number = this.addLine(vertex1, vertex2);
        let line2: number = this.addLine(vertex2, vertex3);
        let line3: number = this.addLine(vertex3, vertex1);
        // Calculate the normal of the triangle...
        let vector1: INumberList = vec3.fromValues(x2 - x1, y2 - y1, z2 - z1);
        let vector2: INumberList = vec3.fromValues(x3 - x2, y3 - y2, z3 - z2);
        let vector3: INumberList = vec3.create();
        vec3.cross(vector3, vector1, vector2)
        vec3.normalize(vector3, vector3);
        // Add normals for 3 vertices...
        this
            .addNormal(vector3)
            .addNormal(vector3)
            .addNormal(vector3)
            .addVertexNormal(vertex1, vector3)
            .addVertexNormal(vertex2, vector3)
            .addVertexNormal(vertex3, vector3);
        // Add the vertex cooordinates and texture info and store the index values...
        let vertexIndex1 = this.addGLVertex(x1, y1, z1, uu1, vv1);
        let vertexIndex2 = this.addGLVertex(x2, y2, z2, uu2, vv2);
        let vertexIndex3 = this.addGLVertex(x3, y3, z3, uu3, vv3);
        this._glIndices.push(vertexIndex1, vertexIndex2, vertexIndex3);
        // Add a new triangle...
        // The center is needed to caculate the direction
        // of the triangle to the light source.
        this._triangles.push({
            vertices: [vertex1, vertex2, vertex3],
            lines:    [line1, line2, line3],
            normal:   vector3,
            center:   [(x1 + x2 + x3) / 3, (y1 + y2 + y3) / 3, (z1 + z2 + z3) / 3],
            visible:  false
        });
        return this;
    };

    /**
     * Create gl buffers for the object...
    **/
    createBuffers(): void {
        let gl            = this._renderer.getGl();
        let shaderProgram = this._renderer.getShaderProgram();
        let normals       = (this._mode === MODE_TEXTURE_PHONG) ? this.getVertexNormals() : this._glNormals;
        this._colorBuffer        = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 0, attribute: shaderProgram.vertexColorAttribute   });
        this._normalBuffer       = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 3, attribute: shaderProgram.vertexNormalAttribute  }).create(normals);
        this._positionBuffer     = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 3, attribute: shaderProgram.vertexPositionAttribute}).create(this._glVertices);
        this._textureCoordBuffer = new Buffer({gl: gl, type: gl.ARRAY_BUFFER,         itemSize: 2, attribute: shaderProgram.textureCoordAttribute  }).create(this._glTextureCoords);
        this._indexBuffer        = new Buffer({gl: gl, type: gl.ELEMENT_ARRAY_BUFFER, itemSize: 1, attribute: null                                 }).create(this._glIndices);
    };

    getVertexNormals(): INumberList {
        let vertexNormals = [];
        this._vertexNormal.forEach((vertexNormal) => {
            let x = 0;
            let y = 0;
            let z = 0;
            vertexNormal.forEach((v) => {
                x += v[0];
                y += v[1];
                z += v[2];
            });
            vertexNormals.push([x /= vertexNormal.length, y /= vertexNormal.length, z /= vertexNormal.length]);
        });
        let normals = [];
        this._triangles.forEach((triangle) => {
            triangle.vertices.forEach((index) => {
                let n = vertexNormals[index];
                normals.push(n[0], n[1], n[2]);
            });
        });
        return normals;
    }

    /**
     * Render the object...
    **/
    render(): void {
        if (!this._texture.getReady()) {
            return;
        }
        let renderer = this._renderer;
        let gl       = renderer.getGl();
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.cullFace(gl.BACK);
        gl.depthFunc(gl.LEQUAL);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture.getTexture());
        gl.uniform1i(renderer.getSamplerUniform(), 0);
        gl.uniform1f(renderer.getModeUniform(), this._mode);
        renderer.setMatrixUniforms();
        this._colorBuffer.disable();
        this._positionBuffer.bind().enable();
        this._normalBuffer.bind().enable();
        this._textureCoordBuffer.bind().enable();
        this._indexBuffer.bind().draw();
    }

    getVertices(): IGlVertices {
        return this._vertices;
    }

    getLines(): INumberList {
        return this._lines;
    }

    getTriangles(): INumberList {
        return this._triangles;
    }
}
