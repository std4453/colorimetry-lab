import _ from 'lodash';
import { Visible } from './mesh';

const { defaults } = _;

const defaultDefinition = {
    type: 'float',
    usage: 'STATIC_DRAW',
    normalize: false,
};

const typeToDetails = {
    float: {
        array: Float32Array,
        constant: 'FLOAT',
    },
};

class Tessellator {
    constructor(material, arrays = []) {
        this.material = material;
        this.definitions = [
            {
                name: 'position',
                attrib: material.vertexPositionAttrib(),
                count: 3,
                usage: 'STATIC_DRAW',
                ...typeToDetails.float,
            },
            ...arrays
                .map(el => defaults(defaultDefinition, el))
                .map(({ name, type, ...rest }) => ({
                    name,
                    attrib: material.attrib(name),
                    ...typeToDetails[type],
                    ...rest,
                })),
        ];
        this.arrays = {};
        this.clear();
        for (const { name } of this.definitions) {
            this[name] = (...data) => {
                this.arrays[name].push(...data);
                return this;
            };
        }
    }

    clear() {
        for (const { name } of this.definitions) this.arrays[name] = [];
        return this;
    }

    populateBuffers(gl, buffers = {}) {
        this.material.use();
        for (const { name, array: ActualArray, usage } of this.definitions) {
            const buffer = name in buffers ? buffers[name] : gl.createBuffer(); // reuse buffers
            buffers[name] = buffer;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new ActualArray(this.arrays[name]), gl[usage]);
        }
        return { count: this.arrays.position.length / 3, buffers };
    }

    loadBuffers(gl, buffers) {
        this.material.use();
        for (const { name, attrib, count, constant, normalize } of this.definitions) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);
            gl.vertexAttribPointer(attrib, count, gl[constant], normalize, 0, 0);
        }
    }
}

class TessellatedMesh extends Visible {
    constructor(gl, material, type, arrays) {
        super(gl, material);
        this.tessellator = new Tessellator(material, arrays);
        this.type = type;
    }

    initSelf() {
        this.endTessellation();
    }

    beginTessellation() {
        return this.tessellator.clear();
    }

    endTessellation() {
        const { count, buffers } = this.tessellator.populateBuffers(this.gl, this.buffers);
        this.buffers = buffers;
        this.count = count;
        return count;
    }

    draw({ matrix }) {
        this.material.use();
        this.material.setModelViewProjectionMatrix(matrix);
        this.tessellator.loadBuffers(this.gl, this.buffers);
        this.gl.drawArrays(this.type, 0, this.count);
    }
}

export default TessellatedMesh;
