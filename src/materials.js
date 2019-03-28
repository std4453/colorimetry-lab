import { mat3 } from 'gl-matrix';
import { Material } from './drei/classes';

import xyYvs from './shaders/xyY.vert';
import xyYfs from './shaders/xyY.frag';

class CIE1931xyYMaterial extends Material {
    constructor(gl) {
        super(gl, xyYvs, xyYfs);
        const uXYZ2sRGB = this.uniform('u_XYZ2sRGB');
        const mat = mat3.fromValues(
            3.2406, -1.5372, -0.4986,
            -0.9689, 1.8758, 0.0415,
            0.0557, -0.2040, 1.0570,
        );
        mat3.transpose(mat, mat);
        this.gl.uniformMatrix3fv(uXYZ2sRGB, false, mat);
    }
}

const materialClasses = { CIE1931xyYMaterial };

export default materialClasses;
