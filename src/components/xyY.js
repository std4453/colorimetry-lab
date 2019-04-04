import { mat4 } from 'gl-matrix';

import { makeDrei, run } from '../drei';
import materialClasses from '../materials';

import async_wave_length_to_xyz from '../wave_length';

const xyY = async ({ gl }) => {
    const wave_length_to_xyz = await async_wave_length_to_xyz();
    const width = 400, height = 400;
    
    const Drei = makeDrei(gl, materialClasses);
    const scene = new Drei.Scene({ clearColor: [1, 1, 1, 1] });

    const colors = new Drei.Tessellator(new Drei.CIE1931xyYMaterial())
        .v_pos(0, 0).v_xy(0, 0)
        .v_pos(0, width).v_xy(0, 1)
        .v_pos(height, 0).v_xy(1, 0)
        .build(gl.TRIANGLES);
    mat4.translate(colors.matrix, colors.matrix, [-width / 2, -height / 2, 0]);
    colors.uniforms.u_Y = [1],
    scene.root.addChild(colors);
    
    const startWL = 390, endWL = 750, step = 0.1;

    const t = new Drei.Tessellator(new Drei.MonosRGBMaterial());
    for (let i = startWL; i <= endWL; i += step) {
        const { X, Y, Z } = wave_length_to_xyz(i);
        const x = X / (X + Y + Z), y = Y / (X + Y + Z);
        t.v_pos(x * width, y * height, 0);
    }
    const outline = t.build(gl.LINE_STRIP);
    outline.uniforms.u_sRGB = [0, 0, 0];
    mat4.translate(outline.matrix, outline.matrix, [-width / 2, -height / 2, 1]);
    scene.root.addChild(outline);

    const camera = new Drei.HUDCamera(-100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, camera, () => {
        const time = Date.now();
        colors.uniforms.u_Y = [Math.sin(time / 1000) * 0.5 + 0.5]
    });
};

export default xyY;
