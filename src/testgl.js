import { mat4 } from 'gl-matrix';

import Scene from './framework/scene';
import { HUDCamera } from './framework/camera';
import { Material } from './framework/classes';
import run from './framework/run';
import TessellatedMesh from './framework/tessellator';

import vsSource from './shaders/colored.vert';
import fsSource from './shaders/gamma_corrected.frag';

const testgl = ({ gl }) => {
    const scene = new Scene(gl);

    {
        const material = new Material(gl, vsSource, fsSource);
        const quad = new TessellatedMesh(gl, material, gl.TRIANGLE_FAN, [{
            name: 'vertexColor',
            type: 'float',
            count: 4,
        }]);
        quad.beginTessellation()
            .position(-100, -100, 0)
            .vertexColor(1.0, 1.0, 1.0, 1.0)
            .position(-100, 100, 0)
            .vertexColor(1.0, 0.0, 0.0, 1.0)
            .position(100, 100, 0)
            .vertexColor(0.0, 1.0, 0.0, 1.0)
            .position(100, -100, 0)
            .vertexColor(0.0, 0.0, 1.0, 1.0);
        mat4.translate(quad.matrix, quad.matrix, [-200, 0, 0]);
        scene.root.addChild(quad);
    }

    {
        const material2 = new Material(gl, vsSource, fsSource);
        const circle = new TessellatedMesh(gl, material2, gl.TRIANGLE_FAN, [{
            name: 'vertexColor',
            type: 'float',
            count: 4,
        }]);

        const t = circle.beginTessellation();
        t.position(0, 0, 0).vertexColor(1, 1, 1, 1);
        const radius = 100;
        const steps = 300;
        const step = 2 * Math.PI / steps;
        for (let i = 0; i <= steps; ++i) {
            const angle = i * step;
            t.position(radius * Math.cos(angle), radius * Math.sin(angle), 0).vertexColor(0, 0, 0, 1);
        }

        mat4.translate(circle.matrix, circle.matrix, [200, 0, 0]);
        scene.root.addChild(circle);
    }

    const camera = new HUDCamera(gl, -100, 100);
    scene.root.addChild(camera);
    
    scene.camera = camera;

    run(gl, scene, () => {});
};

export default testgl;
