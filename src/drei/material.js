import { Material } from './classes';
import fragPure from '../shaders/pure.frag';
import vertTransform from '../shaders/transform.vert';

class PureColorMaterial extends Material {
    constructor(gl) {
        super(gl, vertTransform, fragPure);
    }
}

export { PureColorMaterial };
