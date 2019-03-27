import { mat4 } from 'gl-matrix';
import _ from 'lodash';
const { defaults, isArray, isString } = _;

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

    initSelf() {}

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

    renderSelf() {}
}

class Group extends Node {
    constructor(gl) {
        super(gl);
    }
}

class Visible extends Node {
    constructor(gl, material) {
        super(gl);
        this.material = material;
    }

    renderSelf(ctx) {
        this.material.use();
        this.draw(ctx);
    }

    draw() {}
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

class Camera extends Node {
    constructor(gl) {
        super(gl);
        this.projectionMatrix = mat4.create();
    }

    initSelf() {
        this.updateMatrix();
    }

    updateMatrix() {}

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

class OrthogonalCamera extends Camera {
    constructor(gl, left, right, bottom, top, zNear, zFar) {
        super(gl);
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
        this.zNear = zNear;
        this.zFar = zFar;
    }

    updateMatrix() {
        mat4.identity(this.projectionMatrix);
        mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.zNear, this.zFar);
    }
}

class HUDCamera extends Camera {
    constructor(gl, zNear, zFar) {
        super(gl);
        this.zNear = zNear;
        this.zFar = zFar;
    }

    updateMatrix() {
        mat4.identity(this.projectionMatrix);
        const halfWidth = this.gl.canvas.clientWidth / 2;
        const halfHeight = this.gl.canvas.clientHeight / 2;
        mat4.ortho(this.projectionMatrix, -halfWidth, halfWidth, -halfHeight, halfHeight, this.zNear, this.zFar);
    }
}

class PerspectiveCamera extends Camera {
    constructor(gl, fovy, near, far) {
        super(gl);
        this.fovy = fovy;
        this.near = near;
        this.far = far;
    }

    updateMatrix() {
        mat4.identity(this.projectionMatrix);
        const aspect = this.gl.canvas.clientHeight / this.gl.canvas.clientWidth;
        mat4.perspective(this.projectionMatrix, this.fovy, aspect, this.near, this.far);
    }
}

const specialEntries = {
    depthEnabled: (gl, value) => { if (value) gl.enable(gl.DEPTH_TEST); },
};

const defaultSettings = {
    clearColor: [0.0, 0.0, 0.0, 1.0],
    clearDepth: 1.0,
    depthEnabled: true,
    depthFunc: 'LEQUAL',
};

class Scene {
    constructor(gl, settings = {}) {
        this.gl = gl;

        this.settings = defaults(defaultSettings, settings);

        this.root = new Node(gl);
        this.camera = null;
    }

    init() {
        for (const key in this.settings) {
            const value = this.settings[key];
            if (key in specialEntries) specialEntries[key](this.gl, value);
            else {
                if (isArray(value)) this.gl[key](...value);
                else if (isString(value)) this.gl[key](this.gl[value]);
                else this.gl[key](value);
            }
        }
        this.root.init();
    }

    renderFrame(ctx) {
        let clearBits = this.gl.COLOR_BUFFER_BIT;
        if (this.settings.depthEnabled) clearBits |= this.gl.DEPTH_BUFFER_BIT;
        this.gl.clear(clearBits);

        this.camera.renderTree({ ...ctx, gl: this.gl }, this.root);
    }
}

const run = (gl, scene, update, options = {}) => {
    scene.init();
    let frameCount = 0;
    const frame = (elapsed) => {
        // console.log(gl.getError());
        ++frameCount;
        const ctx = { ...options, scene, frameCount, elapsed };
        scene.renderFrame(ctx);
        update(ctx);
        // requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

export { Node, Group, Visible, Mesh, Quad2, Camera, OrthogonalCamera, HUDCamera, PerspectiveCamera, Scene, run };
