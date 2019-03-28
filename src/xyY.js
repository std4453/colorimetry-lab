import { mat4, mat3 } from 'gl-matrix';

import { Drei, run } from './framework';

import vsSource from './shaders/xyY.vert';
import fsSource from './shaders/xyY.frag';

import async_wave_length_to_xyz from './wave_length';

const xyY = async ({ gl }) => {
    const wave_length_to_xyz = await async_wave_length_to_xyz();
    const width = 400, height = 400;
    
    const scene = new Drei.Scene(gl, { clearColor: [1, 1, 1, 1] });
    
    {
        const step = 0.1;
        const material = new Drei.PureColorMaterial(gl);
        material.setColor(0.5, 0.5, 0.5);

        const t = new Drei.Tessellator(gl, material);
        for (let x = 0; x <= 1; x += step) {
            t
                .vertexPosition(x * width, 0, 0)
                .vertexPosition(x * width + 1, 0, 0)
                .vertexPosition(x * width + 1, height, 0)
                .vertexPosition(x * width + 1, height, 0)
                .vertexPosition(x * width, height, 0)
                .vertexPosition(x * width, 0, 0);
        }
        for (let y = 0; y <= 1; y += step) {
            t
                .vertexPosition(0, y * height, 0)
                .vertexPosition(width, y * height, 0)
                .vertexPosition(width, y * height + 1, 0)
                .vertexPosition(width, y * height + 1, 0)
                .vertexPosition(0, y * height + 1, 0)
                .vertexPosition(0, y * height, 0);
        }
        const bg = t.build(gl.TRIANGLES);
        mat4.translate(bg.matrix, bg.matrix, [-width / 2, -height / 2, -1]);
        scene.root.addChild(bg);
    }
    
    {
        const startWL = 390, endWL = 750, step = 0.1;
        const material = new Drei.Material(gl, vsSource, fsSource);
        const uXYZ2sRGB = material.uniform('u_XYZ2sRGB');
        const mat = mat3.fromValues(
            3.2406, -1.5372, -0.4986,
            -0.9689, 1.8758, 0.0415,
            0.0557, -0.2040, 1.0570,
        );
        mat3.transpose(mat, mat);
        gl.uniformMatrix3fv(uXYZ2sRGB, false, mat);
        const uY = material.uniform('u_Y');
        gl.uniform1f(uY, 0.3);

        const t = new Drei.Tessellator(gl, material);
        for (let i = startWL; i <= endWL; i += step) {
            const { X, Y, Z } = wave_length_to_xyz(i);
            const x = X / (X + Y + Z), y = Y / (X + Y + Z);
            t.v_pos(x * width, y * height, 0).v_xy(x, y);
        }
        const contour = t.build(gl.TRIANGLE_FAN);
        mat4.translate(contour.matrix, contour.matrix, [-width / 2, -height / 2, 0]);
        scene.root.addChild(contour);
    }

    const camera = new Drei.HUDCamera(gl, -100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, () => { });
};

export default xyY;
