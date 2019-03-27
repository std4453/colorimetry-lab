import { Material } from './classes';
import fragPure from '../shaders/pure.frag';
import vertTransform from '../shaders/transform.vert';

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

export { PureColorMaterial };
