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
        material.use();
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
                .map(({ name, count, type, usage }) => ({
                    name,
                    attrib: material.attrib(name),
                    count,
                    ...typeToDetails[type],
                    usage,
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

    tessellate(gl, buffers = {}) {
        for (const { name, attrib, count, array: ActualArray, constant, normalize, usage } of this.definitions) {
            const buffer = name in buffers ? buffers[name] : gl.createBuffer(); // reuse buffers
            buffers[name] = buffer;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new ActualArray(this.arrays[name]), gl[usage]);
            gl.vertexAttribPointer(attrib, count, gl[constant], normalize, 0, 0);
        }
        return { count: this.arrays.position.length / 3, buffers };
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
        const { count, buffers } = this.tessellator.tessellate(this.gl, this.buffers);
        this.buffers = buffers;
        this.count = count;
        return count;
    }

    draw({ matrix }) {
        this.material.setModelViewProjectionMatrix(matrix);
        this.gl.drawArrays(this.type, 0, this.count);
    }
}

export default TessellatedMesh;
