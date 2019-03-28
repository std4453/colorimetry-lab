import { Node } from './classes';
import { attribTypes } from './utils';

class Visible extends Node {
    constructor(gl, material) {
        super(gl);
        this.material = material;
    }

    renderSelf(ctx) {
        this.material.use();
        this.material.enableAttribs();
        this.draw(ctx);
        this.material.disableAttribs();
    }

    draw() { }
}

class Mesh extends Visible {
    constructor(gl, material, type) {
        super(gl, material);
        this.buffers = this.material.createBuffers();
        this.type = type;
        this.count = 0;
    }

    draw({ matrix }) {
        // bind buffers
        for (const name in this.buffers) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
            const { type } = this.material.attribs[name];
            const { element, size } = attribTypes[type];
            this.gl.vertexAttribPointer(this.material.attrib(name), size, element, false, 0, 0);
        }

        this.material.setModelViewProjectionMatrix(matrix);
        this.gl.drawArrays(this.type, 0, this.count);
    }
}

export { Visible, Mesh };
