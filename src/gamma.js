import { mat4 } from 'gl-matrix';

import { makeDrei, run } from './drei';
import materialClasses from './materials';

const gamma = ({ gl }) => {
    const Drei = makeDrei(gl, materialClasses);
    const scene = new Drei.Scene();

    {
        const radius = 100;
        const steps = 300;
        const step = 2 * Math.PI / steps;

        const material2 = new Drei.CorrectedsRGBMaterial();
        const t = new Drei.Tessellator(material2, gl.TRIANGLE_FAN);
        t.v_pos(0, 0, 0).v_sRGB(1, 1, 1);
        for (let i = 0; i <= steps; ++i) {
            const angle = i * step;
            t.v_pos(radius * Math.cos(angle), radius * Math.sin(angle)).v_sRGB(0, 0, 0);
        }
        const circle = t.build(gl.TRIANGLE_FAN);
        mat4.translate(circle.matrix, circle.matrix, [-200, 0, 0]);
        scene.root.addChild(circle);
    }

    {
        const radius = 100;
        const steps = 300;
        const step = 2 * Math.PI / steps;

        const material2 = new Drei.UncorrectedsRGBMaterial();
        const t = new Drei.Tessellator(material2, gl.TRIANGLE_FAN);
        t.v_pos(0, 0, 0).v_sRGB(1, 1, 1);
        for (let i = 0; i <= steps; ++i) {
            const angle = i * step;
            t.v_pos(radius * Math.cos(angle), radius * Math.sin(angle)).v_sRGB(0, 0, 0);
        }
        const circle = t.build(gl.TRIANGLE_FAN);
        mat4.translate(circle.matrix, circle.matrix, [200, 0, 0]);
        scene.root.addChild(circle);
    }

    const camera = new Drei.HUDCamera(-100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, camera, () => {});
};

export default gamma;
