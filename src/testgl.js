import { mat4 } from 'gl-matrix';

import Scene from './framework/scene';
import { HUDCamera } from './framework/camera';
import { Material } from './framework/classes';
import run from './framework/run';
import Tessellator from './framework/tessellator';

import vsSource from './shaders/colored.vert';
import fsSource from './shaders/gamma_corrected.frag';

const testgl = ({ gl }) => {
    const scene = new Scene(gl);

    {
        const material = new Material(gl, vsSource, fsSource);
        const quad = new Tessellator(gl, material)
            .vertexPosition(-100, -100)
            .vertexColor(1.0, 1.0, 1.0)
            .vertexPosition(-100, 100)
            .vertexColor(1.0, 0.0, 0.0)
            .vertexPosition(100, 100)
            .vertexColor(0.0, 1.0, 0.0)
            .vertexPosition(100, -100)
            .vertexColor(0.0, 0.0, 1.0)
            .build(gl.TRIANGLE_FAN);
        mat4.translate(quad.matrix, quad.matrix, [-200, 0, 0]);
        scene.root.addChild(quad);
    }

    {
        const radius = 100;
        const steps = 300;
        const step = 2 * Math.PI / steps;

        const material2 = new Material(gl, vsSource, fsSource);
        const t = new Tessellator(gl, material2, gl.TRIANGLE_FAN);
        t.vertexPosition(0, 0, 0).vertexColor(1, 1, 1);
        for (let i = 0; i <= steps; ++i) {
            const angle = i * step;
            t.vertexPosition(radius * Math.cos(angle), radius * Math.sin(angle)).vertexColor(0, 0, 0);
        }
        const circle = t.build(gl.TRIANGLE_FAN);
        mat4.translate(circle.matrix, circle.matrix, [200, 0, 0]);
        scene.root.addChild(circle);
    }

    const camera = new HUDCamera(gl, -100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, () => {});
};

export default testgl;
