const MODE_COLOR = 1.0;
const MODE_TEXTURE = 2.0;
const MODE_TEXTURE_FLAT = 3.0;
const MODE_TEXTURE_PHONG = 4.0;
class GlObject {
    constructor(opts) {
        this._mode = opts.mode;
        this._renderer = opts.renderer;
        this._texture = opts.texture;
        this._vertices = [];
        this._verticesHash = {};
        this._vertexNormal = [];
        this._lines = [];
        this._linesUnique = [];
        this._triangles = [];
        this._glVertexCount = -1;
        this._glVertices = [];
        this._glNormals = [];
        this._glIndices = [];
        this._glTextureCoords = [];
        this._glPositionBuffer = null;
        this._glNormalBuffer = null;
        this._glTextureCoordBuffer = null;
        this._glVertexIndexBuffer = null;
    }
    /**
     * Add a vertex, merge close vertices...
     * Returns the vertex index
    **/
    addVertex(x, y, z) {
        let hash = ~~(x * 1000) + '_' + ~~(y * 1000) + '_' + ~~(z * 1000);
        let index = this._verticesHash[hash]; // Check if the value was added before...
        if (index === undefined) { // A new vertex...
            index = this._vertices.length;
            this._verticesHash[hash] = index;
            this._vertices.push([x, y, z]);
        }
        return index;
    }
    /**
     * Add position and texture cooordinates to the gl lists...
     * Returns the index of the vertex
    **/
    addGLVertex(x, y, z, u, v) {
        this._glVertices.push(x, y, z);
        this._glTextureCoords.push(u, v);
        this._glVertexCount++;
        return this._glVertexCount;
    }
    /**
     * Add a normal to a gl list...
    **/
    addNormal(normal) {
        this._glNormals.push(normal[0], normal[1], normal[2]);
        return this;
    }
    addVertexNormal(vertexIndex, normal) {
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
    addLine(v1, v2) {
        this._lines.push({ v1: v1, v2: v2, a: v1 + '_' + v2, b: v2 + '_' + v1 });
        return this._lines.length - 1;
    }
    /**
     * Add a triangle to this object...
     *
     * This method adds the vertex information to
     * the buffers needed the build the shadow.
    **/
    addTriangle(x1, y1, z1, uu1, vv1, x2, y2, z2, uu2, vv2, x3, y3, z3, uu3, vv3) {
        let triangleCount = this._triangles.length; // The index of the new triangle...
        // Add the vertices...
        let vertex1 = this.addVertex(x1, y1, z1);
        let vertex2 = this.addVertex(x2, y2, z2);
        let vertex3 = this.addVertex(x3, y3, z3);
        // Add the lines, these are used to calculate the edge of the object...
        // Each line is associated with the new triangle...
        let line1 = this.addLine(vertex1, vertex2);
        let line2 = this.addLine(vertex2, vertex3);
        let line3 = this.addLine(vertex3, vertex1);
        // Calculate the normal of the triangle...
        let vector1 = vec3.fromValues(x2 - x1, y2 - y1, z2 - z1);
        let vector2 = vec3.fromValues(x3 - x2, y3 - y2, z3 - z2);
        let vector3 = vec3.create();
        vec3.cross(vector3, vector1, vector2);
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
            lines: [line1, line2, line3],
            normal: vector3,
            center: [(x1 + x2 + x3) / 3, (y1 + y2 + y3) / 3, (z1 + z2 + z3) / 3],
            visible: false
        });
        return this;
    }
    ;
    /**
     * Create gl buffers for the object...
    **/
    createBuffers() {
        let gl = this._renderer.getGl();
        this._glPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._glVertices), gl.STATIC_DRAW);
        this._glPositionBuffer.itemSize = 3;
        this._glVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._glIndices), gl.STATIC_DRAW);
        this._glVertexIndexBuffer.itemSize = 1;
        this._glVertexIndexBuffer.numItems = this._glIndices.length;
        this._glTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._glTextureCoords), gl.STATIC_DRAW);
        this._glTextureCoordBuffer.itemSize = 2;
        this._glNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glNormalBuffer);
        let normals = (this._mode === MODE_TEXTURE_PHONG) ? this.getVertexNormals() : this._glNormals;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this._glNormalBuffer.itemSize = 3;
    }
    ;
    getVertexNormals() {
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
    render() {
        let renderer = this._renderer;
        let gl = renderer.getGl();
        let shaderProgram = renderer.getShaderProgram();
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        // Disable the color attribute, not needed because the object has a texture...
        gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
        // Set the vertex position buffer...
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this._glPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        // Enable the normal attribute and set the buffer...
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this._glNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        // Enable the texture coord attribute and set the buffer...
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this._glTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        // Set the texture...
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.uniform1i(renderer.getSamplerUniform(), 0);
        // Don't use the color attribute...
        gl.uniform1f(renderer.getModeUniform(), this._mode);
        // Set the index, render the triangles...
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glVertexIndexBuffer);
        this._renderer.setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this._glVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    getVertices() {
        return this._vertices;
    }
    getLines() {
        return this._lines;
    }
    getTriangles() {
        return this._triangles;
    }
}
