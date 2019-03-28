import { mat4 } from 'gl-matrix';

import { makeDrei, run } from './drei';
import materialClasses from './materials';

import async_wave_length_to_xyz from './wave_length';

const xyY = async ({ gl }) => {
    const wave_length_to_xyz = await async_wave_length_to_xyz();
    const width = 400, height = 400;
    
    const Drei = makeDrei(gl, materialClasses);
    const scene = new Drei.Scene({ clearColor: [1, 1, 1, 1] });
    
    {
        const step = 0.1;
        const material = new Drei.MonosRGBMaterial();

        const t = new Drei.Tessellator(material);
        for (let x = 0; x <= 1; x += step) {
            t
                .v_pos(x * width, 0, 0)
                .v_pos(x * width + 1, 0, 0)
                .v_pos(x * width + 1, height, 0)
                .v_pos(x * width + 1, height, 0)
                .v_pos(x * width, height, 0)
                .v_pos(x * width, 0, 0);
        }
        for (let y = 0; y <= 1; y += step) {
            t
                .v_pos(0, y * height, 0)
                .v_pos(width, y * height, 0)
                .v_pos(width, y * height + 1, 0)
                .v_pos(width, y * height + 1, 0)
                .v_pos(0, y * height + 1, 0)
                .v_pos(0, y * height, 0);
        }
        const bg = t.build(gl.TRIANGLES);
        bg.uniforms.u_sRGB = [0.5, 0.5, 0.5];
        mat4.translate(bg.matrix, bg.matrix, [-width / 2, -height / 2, -1]);
        scene.root.addChild(bg);
    }
    
    {
        const vY = 0.8;
        const startWL = 390, endWL = 750, step = 0.1;

        const material = new Drei.CIE1931xyYMaterial();
        const t = new Drei.Tessellator(material);
        for (let i = startWL; i <= endWL; i += step) {
            const { X, Y, Z } = wave_length_to_xyz(i);
            const x = X / (X + Y + Z), y = Y / (X + Y + Z);
            t.v_pos(x * width, y * height, 0).v_xyY(x, y, vY);
        }
        const contour = t.build(gl.TRIANGLE_FAN);
        mat4.translate(contour.matrix, contour.matrix, [-width / 2, -height / 2, 0]);
        scene.root.addChild(contour);
    }

    {
        const startWL = 390, endWL = 750, step = 0.1;

        const material = new Drei.MonosRGBMaterial();
        const t = new Drei.Tessellator(material);
        for (let i = startWL; i <= endWL; i += step) {
            const { X, Y, Z } = wave_length_to_xyz(i);
            const x = X / (X + Y + Z), y = Y / (X + Y + Z);
            t.v_pos(x * width, y * height, 0);
        }
        const outline = t.build(gl.LINE_STRIP);
        outline.uniforms.u_sRGB = [0, 0, 0];
        mat4.translate(outline.matrix, outline.matrix, [-width / 2, -height / 2, 1]);
        scene.root.addChild(outline);
    }

    const camera = new Drei.HUDCamera(-100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, camera, () => { });
};

export default xyY;
