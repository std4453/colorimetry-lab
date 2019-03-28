import { mat3 } from 'gl-matrix';
import { Material } from './drei/classes';

import v_xyY from './shaders/xyY.vert';
import f_xyY from './shaders/xyY.frag';
import v_sRGB from './shaders/sRGB.vert';
import f_corrected from './shaders/corrected.frag';
import f_uncorrected from './shaders/uncorrected.frag';

class CIE1931xyYMaterial extends Material {
    constructor(gl) {
        super(gl, v_xyY, f_xyY);
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

class UncorrectedsRGBMaterial extends Material {
    constructor(gl) {
        super(gl, v_sRGB, f_uncorrected);
    }
}

class CorrectedsRGBMaterial extends Material {
    constructor(gl) {
        super(gl, v_sRGB, f_corrected);
    }
}

const materialClasses = { CIE1931xyYMaterial, UncorrectedsRGBMaterial, CorrectedsRGBMaterial };

export default materialClasses;
