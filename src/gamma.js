import { mat4 } from 'gl-matrix';

import { Drei, run } from './framework';

import colored from './shaders/colored.vert';
import gamma_corrected from './shaders/gamma_corrected.frag';
import inherit from './shaders/inherit.frag';

const gamma = ({ gl }) => {
    const scene = new Drei.Scene(gl);

    {
        const radius = 100;
        const steps = 300;
        const step = 2 * Math.PI / steps;

        const material2 = new Drei.Material(gl, colored, gamma_corrected);
        const t = new Drei.Tessellator(gl, material2, gl.TRIANGLE_FAN);
        t.vertexPosition(0, 0, 0).vertexColor(1, 1, 1);
        for (let i = 0; i <= steps; ++i) {
            const angle = i * step;
            t.vertexPosition(radius * Math.cos(angle), radius * Math.sin(angle)).vertexColor(0, 0, 0);
        }
        const circle = t.build(gl.TRIANGLE_FAN);
        mat4.translate(circle.matrix, circle.matrix, [-200, 0, 0]);
        scene.root.addChild(circle);
    }

    {
        const radius = 100;
        const steps = 300;
        const step = 2 * Math.PI / steps;

        const material2 = new Drei.Material(gl, colored, inherit);
        const t = new Drei.Tessellator(gl, material2, gl.TRIANGLE_FAN);
        t.vertexPosition(0, 0, 0).vertexColor(1, 1, 1);
        for (let i = 0; i <= steps; ++i) {
            const angle = i * step;
            t.vertexPosition(radius * Math.cos(angle), radius * Math.sin(angle)).vertexColor(0, 0, 0);
        }
        const circle = t.build(gl.TRIANGLE_FAN);
        mat4.translate(circle.matrix, circle.matrix, [200, 0, 0]);
        scene.root.addChild(circle);
    }

    const camera = new Drei.HUDCamera(gl, -100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, () => {});
};

export default gamma;
