import Scene from './framework/scene';
import { HUDCamera } from './framework/camera';
import { PureColorMaterial } from './framework/material';
import run from './framework/run';
import TessellatedMesh from './framework/tessellator';

const testgl = ({ gl }) => {
    const scene = new Scene(gl);

    const material = new PureColorMaterial(gl);
    material.setColor(1.0, 0.5, 1.0);
    const quad = new TessellatedMesh(gl, material, gl.TRIANGLE_FAN);
    quad.beginTessellation()
        .position(-100, -100, 0)
        .position(-100, 100, 0)
        .position(100, 100, 0)
        .position(100, -100, 0);
    quad.endTessellation();
    scene.root.addChild(quad);

    const camera = new HUDCamera(gl, -100, 100);
    scene.root.addChild(camera);
    
    scene.camera = camera;

    run(gl, scene, () => {});
};

export default testgl;
