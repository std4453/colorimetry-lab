import { mat4 } from 'gl-matrix';

import { Scene, Quad2, run, HUDCamera } from './scene';
import { PureColorMaterial } from './material';

const testgl = ({ gl }) => {
    const scene = new Scene(gl);

    const material = new PureColorMaterial(gl);
    material.setColor(1.0, 0.5, 1.0);
    const quad = new Quad2(gl, material, -100, -100, 100, 100);
    scene.root.addChild(quad);

    const camera = new HUDCamera(gl, -100, 100);
    scene.root.addChild(camera);
    
    scene.camera = camera;

    run(gl, scene, () => {});
};

export default testgl;
