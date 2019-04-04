import { mat4 } from 'gl-matrix';

import { makeDrei, run } from '../drei';
import materialClasses from '../materials';

const shades = ({ gl }) => {
    const Drei = makeDrei(gl, materialClasses);
    const scene = new Drei.Scene();

    {
        const material = new Drei.CorrectedsRGBMaterial();
        const t = new Drei.Tessellator(material);
        t
            .v_pos(0, 0, 0).v_sRGB(0, 0, 0)
            .v_pos(0, 100, 0).v_sRGB(0, 0, 0)
            .v_pos(800, 100, 0).v_sRGB(1, 1, 1)
            .v_pos(800, 0, 0).v_sRGB(1, 1, 1)
        const rect = t.build(gl.TRIANGLE_FAN);
        mat4.translate(rect.matrix, rect.matrix, [-400, 50, 0]);
        scene.root.addChild(rect);
    }

    {
        const material = new Drei.DitheredGrayscaleMaterial();
        const t = new Drei.Tessellator(material);
        t
            .v_pos(0, 0, 0).v_gray(0)
            .v_pos(0, 100, 0).v_gray(0)
            .v_pos(800, 100, 0).v_gray(1)
            .v_pos(800, 0, 0).v_gray(1)
        const rect = t.build(gl.TRIANGLE_FAN);
        mat4.translate(rect.matrix, rect.matrix, [-400, -50, 0]);
        scene.root.addChild(rect);
    }

    {
        const material = new Drei.GrayscaleMaterial();
        const t = new Drei.Tessellator(material);
        t
            .v_pos(0, 0, 0).v_gray(0)
            .v_pos(0, 100, 0).v_gray(0)
            .v_pos(800, 100, 0).v_gray(1)
            .v_pos(800, 0, 0).v_gray(1)
        const rect = t.build(gl.TRIANGLE_FAN);
        mat4.translate(rect.matrix, rect.matrix, [-400, -150, 0]);
        scene.root.addChild(rect);
    }

    const camera = new Drei.HUDCamera(-100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, camera, () => { });
};

export default shades;
