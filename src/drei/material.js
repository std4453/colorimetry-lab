import { Material } from './classes';
import fragPure from '../shaders/sRGB_mono.frag';
import vertTransform from '../shaders/uncorrected.vert';

class MonosRGBMaterial extends Material {
    constructor(gl) {
        super(gl, vertTransform, fragPure);
    }
}

export { MonosRGBMaterial };
