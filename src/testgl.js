import Scene from './framework/scene';
import { HUDCamera } from './framework/camera';
import { Material } from './framework/classes';
import run from './framework/run';
import TessellatedMesh from './framework/tessellator';

import vsSource from './shaders/colored.vert';
import fsSource from './shaders/inherit.frag';

const testgl = ({ gl }) => {
    const scene = new Scene(gl);

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
    quad.endTessellation();
    scene.root.addChild(quad);

    const camera = new HUDCamera(gl, -100, 100);
    scene.root.addChild(camera);
    
    scene.camera = camera;

    run(gl, scene, () => {});
};

export default testgl;
