import { Node } from './classes';

class Visible extends Node {
    constructor(gl, material) {
        super(gl);
        this.material = material;
    }

    renderSelf(ctx) {
        this.material.use();
        this.draw(ctx);
    }

    draw() { }
}

class Mesh extends Visible {
    constructor(gl, material, type, vertices) {
        super(gl, material);
        this.verticesBuffer = this.gl.createBuffer();
        this.vertices = vertices;
        this.type = type;
    }

    initSelf() {
        this.setVertices(this.vertices);
    }

    setVertices(vertices) {
        this.vertices = vertices;
        const verticesAttrib = this.material.vertexPositionAttrib();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(verticesAttrib, 3, this.gl.FLOAT, false, 0, 0);
    }

    draw({ matrix }) {
        this.material.setModelViewProjectionMatrix(matrix);
        this.gl.drawArrays(this.type, 0, this.vertices.length / 3);
    }
}

class Quad2 extends Mesh {
    constructor(gl, material, x0, y0, x1, y1) {
        super(gl, material, gl.TRIANGLE_FAN, [x0, y0, 0, x1, y0, 0, x1, y1, 0, x0, y1, 0]);
    }
}

export { Mesh, Quad2 };
