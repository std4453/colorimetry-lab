const loadShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader));
    return shader;
};

const loadProgram = (gl, vsSource, fsSource) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(shaderProgram));

    return shaderProgram;
};

// TODO: unfinished
const attribTypes = {
    'FLOAT_VEC2': {
        array: Float32Array,
        size: 2,
        element: 0x1406, // FLOAT
        defaults: [0, 0],
    },
    'FLOAT_VEC3': {
        array: Float32Array,
        size: 3,
        element: 0x1406, // FLOAT
        defaults: [0, 0, 0],
    },
    'FLOAT_VEC4': {
        array: Float32Array,
        size: 4,
        element: 0x1406, // FLOAT
        defaults: [0, 0, 0, 1],
    },
};

export { loadProgram, attribTypes };
