import { mat4 } from 'gl-matrix';
import loadProgram from './shader';

const initBuffers = (gl) => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -100.0, -100.0,
        -100.0,  100.0,
         100.0,  100.0,
         100.0, -100.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return { position: positionBuffer };
};

const drawScene = (gl, programInfo, buffers) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const zNear = -100.0;
    const zFar = 100.0;
    const halfWidth = gl.canvas.clientWidth / 2;
    const halfHeight = gl.canvas.clientHeight / 2;
    const projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -halfWidth, halfWidth, -halfHeight, halfHeight, zNear, zFar);

    const modelViewMatrix = mat4.create();

    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_FAN, offset, vertexCount);
    }
}

const testgl = async ({ gl }) => {
    const vsSource = await (await fetch('public/shaders/test_vert.glsl')).text();
    const fsSource = await (await fetch('public/shaders/test_frag.glsl')).text();
    const shaderProgram = loadProgram(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };
    const buffers = initBuffers(gl);
    drawScene(gl, programInfo, buffers);
};

export default testgl;
