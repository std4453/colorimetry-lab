import React from 'react';
import { mat4 } from 'gl-matrix';
import * as dat from 'dat.gui';

import Canvas from './Canvas';
import { makeDrei, run } from '../drei';
import materialClasses from '../materials';

import { wave_length_to_xyz, sRGB_uncorrected_to_xyz, xyz_to_xyY, temp_to_xy } from '../convert';

const xyY = async ({ canvas, gl }) => {
    const { width, height } = canvas;
    
    const Drei = makeDrei(gl, materialClasses);
    const scene = new Drei.Scene({ clearColor: [1, 1, 1, 1] });
    
    const startWL = 390, endWL = 750, stepWL = 0.1;
    const startT = 1667, endT = 25000, stepT = 1;

    const gui = new dat.GUI();

    // grid
    {
        const t = new Drei.Tessellator(new Drei.MonosRGBMaterial());
        for (let i = 0; i < 1; i += 0.1) {
            t.v_pos(i * width, 0, 0).v_pos(i * width, height, 0);
            t.v_pos(0, i * height, 0).v_pos(width, i * height, 0);
        }
        const grid = t.build(gl.LINES);
        grid.uniforms.u_sRGB = [0.8, 0.8, 0.8];
        mat4.translate(grid.matrix, grid.matrix, [-width / 2, -height / 2, 1]);
        scene.root.addChild(grid);
    }

    // xyY chromatic graph
    {
        const t = new Drei.Tessellator(new Drei.CIE1931xyYMaterial())
            .v_pos(0.3 * width, 0.3 * height, 1)
            .v_xy(0.3, 0.3);
        for (let i = startWL; i <= endWL; i += stepWL) {
            const { x, y } = xyz_to_xyY(wave_length_to_xyz(i));
            t.v_pos(x * width, y * height, 1).v_xy(x, y);
        }
        const { x, y } = xyz_to_xyY(wave_length_to_xyz(startWL));
        t.v_pos(x * width, y * height, 1).v_xy(x, y);
        const colors = t.build(gl.TRIANGLE_FAN);
        mat4.translate(colors.matrix, colors.matrix, [-width / 2, -height / 2, 0]);
        colors.uniforms.u_Y = [0.5],
        scene.root.addChild(colors);
        gui.add(colors.uniforms.u_Y, '0', 0, 1);
    }

    // srgb triangle
    {
        const material = new Drei.CorrectedsRGBMaterial();
        const t = new Drei.Tessellator(material);
        const { x: rx, y: ry } = xyz_to_xyY(sRGB_uncorrected_to_xyz({ R: 1, G: 0, B: 0 }));
        const { x: gx, y: gy } = xyz_to_xyY(sRGB_uncorrected_to_xyz({ R: 0, G: 1, B: 0 }));
        const { x: bx, y: by } = xyz_to_xyY(sRGB_uncorrected_to_xyz({ R: 0, G: 0, B: 1 }));
        t
            .v_pos(rx * width, ry * height, 2).v_sRGB(1, 0, 0)
            .v_pos(gx * width, gy * height, 2).v_sRGB(0, 1, 0)
            .v_pos(bx * width, by * height, 2).v_sRGB(0, 0, 1);
        const rect = t.build(gl.TRIANGLES);
        mat4.translate(rect.matrix, rect.matrix, [-width / 2, -height / 2, 0]);
        scene.root.addChild(rect);
    }

    // spectrum locus
    {
        const t = new Drei.Tessellator(new Drei.MonosRGBMaterial());
        for (let i = startWL; i <= endWL; i += stepWL) {
            const { x, y } = xyz_to_xyY(wave_length_to_xyz(i));
            t.v_pos(x * width, y * height, 3);
        }
        const specLoc = t.build(gl.LINE_STRIP);
        specLoc.uniforms.u_sRGB = [0, 0, 0];
        mat4.translate(specLoc.matrix, specLoc.matrix, [-width / 2, -height / 2, 1]);
        scene.root.addChild(specLoc);
    }

    // planckian locus
    {
        const t = new Drei.Tessellator(new Drei.MonosRGBMaterial());
        for (let i = startT; i <= endT; i += stepT) {
            const { x, y } = temp_to_xy(i);
            t.v_pos(x * width, y * height, 4);
        }
        const plankLoc = t.build(gl.LINE_STRIP);
        plankLoc.uniforms.u_sRGB = [0, 0, 0];
        mat4.translate(plankLoc.matrix, plankLoc.matrix, [-width / 2, -height / 2, 1]);
        scene.root.addChild(plankLoc);
    }

    const camera = new Drei.HUDCamera(-100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    run(gl, scene, camera, () => {});
};

function CIExyY() {
    const scale = 2;
    return (
        <Canvas
            width={600 * scale}
            height={600 * scale}
            style={{
                transform: `scale(${1 / scale})`,
            }}
        >{xyY}</Canvas>
    )
}

export default CIExyY;
