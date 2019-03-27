import { mat4, mat3 } from 'gl-matrix';

import Scene from './framework/scene';
import { HUDCamera } from './framework/camera';
import { Material } from './framework/classes';
import run from './framework/run';
import TessellatedMesh from './framework/tessellator';

import vsSource from './shaders/xyY.vert';
import fsSource from './shaders/xyY.frag';

import async_wave_length_to_xyz from './wave_length';

const xyY = async ({ gl }) => {
    const wave_length_to_xyz = await async_wave_length_to_xyz();
    const startWL = 390, endWL = 750, step = 0.1;
    const width = 400, height = 400;

    const scene = new Scene(gl, { clearColor: [1, 1, 1, 1] });

    const material = new Material(gl, vsSource, fsSource);
    const uXYZ2sRGB = material.uniform('XYZ2sRGB');
    const mat = mat3.fromValues(
         3.2406, -1.5372, -0.4986,
        -0.9689, 1.8758, 0.0415,
         0.0557, -0.2040, 1.0570,
    );
    mat3.transpose(mat, mat);
    gl.uniformMatrix3fv(uXYZ2sRGB, false, mat);
    const uY = material.uniform('Y');
    gl.uniform1f(uY, 0.3);
    const contour = new TessellatedMesh(gl, material, gl.TRIANGLE_FAN, [{
        name: 'v_xy',
        type: 'float',
        count: 2,
    }]);
    const tessellator = contour.beginTessellation();
    for (let i = startWL; i <= endWL; i += step) {
        const { X, Y, Z } = wave_length_to_xyz(i);
        const x = X / (X + Y + Z), y = Y / (X + Y + Z);
        tessellator.position(x * width, y * height, 0).v_xy(x, y);
    }
    mat4.translate(contour.matrix, contour.matrix, [-width / 2, -height / 2, 0]);
    scene.root.addChild(contour);

    const camera = new HUDCamera(gl, -100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, () => { });
};

export default xyY;
