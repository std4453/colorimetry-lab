import React from 'react';
import { mat4 } from 'gl-matrix';

import Canvas from './Canvas';
import { makeDrei, run } from '../drei';
import materialClasses from '../materials';

const shades = ({ canvas, gl }) => {
    const { width, height } = canvas;
    const barWidth = Math.floor(width / 10), barHeight = Math.floor(height / 3);

    const Drei = makeDrei(gl, materialClasses);
    const scene = new Drei.Scene();

    {
        const material = new Drei.CorrectedsRGBMaterial();
        const t = new Drei.Tessellator(material);
        t
            .v_pos(0, 0, 0).v_sRGB(0, 0, 0)
            .v_pos(barWidth * 2, 0, 0).v_sRGB(0, 0, 0)
            .v_pos(barWidth * 2, barHeight * 2, 0).v_sRGB(1, 1, 1)
            .v_pos(0, barHeight * 2, 0).v_sRGB(1, 1, 1)
        const rect = t.build(gl.TRIANGLE_FAN);
        mat4.translate(rect.matrix, rect.matrix, [-barWidth * 3, -barHeight, 0]);
        scene.root.addChild(rect);
    }

    {
        const material = new Drei.DitheredGrayscaleMaterial();
        const t = new Drei.Tessellator(material);
        t
            .v_pos(0, 0, 0).v_gray(0).v_tex(0, 0)
            .v_pos(barWidth * 2, 0, 0).v_gray(0).v_tex(barWidth * 2, 0)
            .v_pos(barWidth * 2, barHeight * 2, 0).v_gray(1).v_tex(barWidth * 2, barHeight * 2)
            .v_pos(0, barHeight * 2, 0).v_gray(1).v_tex(0, barHeight * 2)
        const rect = t.build(gl.TRIANGLE_FAN);
        mat4.translate(rect.matrix, rect.matrix, [-barWidth, -barHeight, 0]);
        scene.root.addChild(rect);
    }

    {
        const material = new Drei.GrayscaleMaterial();
        const t = new Drei.Tessellator(material);
        t
            .v_pos(0, 0, 0).v_gray(0).v_tex(0, 0)
            .v_pos(barWidth * 2, 0, 0).v_gray(0).v_tex(1, 0)
            .v_pos(barWidth * 2, barHeight * 2, 0).v_gray(1).v_tex(1, 1)
            .v_pos(0, barHeight * 2, 0).v_gray(1).v_tex(0, 1)
        const rect = t.build(gl.TRIANGLE_FAN);
        mat4.translate(rect.matrix, rect.matrix, [barWidth, -barHeight, 0]);
        scene.root.addChild(rect);
    }

    const camera = new Drei.HUDCamera(-100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, camera, () => { });
}

function ShadeBars({ scale }) {
    return (
        <div style={{ width: 400, height: 600, overflow: 'hidden' }}>
            <Canvas
                width={400 * scale}
                height={600 * scale}
                style={{
                    transform: `scale(${1 / scale})`,
                    transformOrigin: '0 0',
                }}
            >{shades}</Canvas>
        </div>
    );
}

function GammaCorrection() {
    const scale = window.devicePixelRatio;
    return (
        <>
            <ShadeBars scale={scale}/>
        </>
    );
}

export default GammaCorrection;
