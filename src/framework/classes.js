import { mat4 } from 'gl-matrix';
import { loadProgram } from './utils';

class Node {
    constructor(gl) {
        this.gl = gl;
        this.matrix = mat4.create();
        this.children = [];
    }

    init() {
        this.initSelf();
        for (const child of this.children) child.init();
    }

    initSelf() { }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    removeChild(child) {
        const index = this.children.findIndex(el => el === child);
        if (index === -1) return;
        this.children.splice(index, 1);
        child.parent = null;
    }

    getModelMatrix() {
        const world = this.parent ? this.parent.getModelMatrix() : mat4.create();
        const result = mat4.create();
        mat4.multiply(result, world, this.matrix);
        return result;
    }

    render(ctx) {
        const { matrix } = ctx;
        const newMat = mat4.create();
        mat4.multiply(newMat, matrix, this.matrix);
        const newContext = { ...ctx, matrix: newMat };

        this.renderSelf(newContext);
        for (const child of this.children) child.render(newContext);
    }

    renderSelf() { }
}

class Group extends Node {
    constructor(gl) {
        super(gl);
    }
}

class Camera extends Node {
    constructor(gl) {
        super(gl);
        this.projectionMatrix = mat4.create();
    }

    initSelf() {
        this.updateMatrix();
    }

    updateMatrix() { }

    getCameraMatrix() {
        const model = this.getModelMatrix();
        const result = mat4.create();
        mat4.invert(result, model);
        mat4.multiply(result, this.projectionMatrix, result);
        return result;
    }

    renderTree(ctx, root) {
        const matrix = this.getCameraMatrix();
        const newContenxt = { ...ctx, matrix };
        root.render(newContenxt);
    }
}

class Material {
    constructor(gl, vsSource, fsSource) {
        this.gl = gl;
        this.program = loadProgram(gl, vsSource, fsSource);
    }

    attrib(name) {
        this.use();
        const location = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(location);
        return location;
    }

    uniform(name) {
        this.use();
        return this.gl.getUniformLocation(this.program, name);
    }

    vertexPositionAttrib() {
        return this.attrib('vertexPosition');
    }

    modelViewProjectionMatrixUniform() {
        return this.uniform('modelViewProjectionMatrix');
    }

    setModelViewProjectionMatrix(matrix) {
        this.gl.uniformMatrix4fv(this.modelViewProjectionMatrixUniform(), false, matrix);
    }

    use() {
        this.gl.useProgram(this.program);
    }
}

export { Node, Group, Camera, Material };