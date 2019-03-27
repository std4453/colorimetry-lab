import loadProgram from './shader';
import fragPure from './shaders/pure.frag';
import vertTransform from './shaders/transform.vert';

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

class PureColorMaterial extends Material {
    constructor(gl) {
        super(gl, vertTransform, fragPure);
    }

    colorUniform() {
        return this.uniform('color');
    }

    setColor(r, g, b, a = 1.0) {
        this.gl.uniform4fv(this.colorUniform(), [r, g, b, a]);
    }
}

export { Material, PureColorMaterial };
