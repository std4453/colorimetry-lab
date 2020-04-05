import React from 'react';
import { mat4 } from 'gl-matrix';
import * as dat from 'dat.gui';

import Canvas from './Canvas';
import { makeDrei, run } from '../drei';
import materialClasses from '../materials';

import { sRGB_uncorrected_to_xyz, xyz_to_xyY } from '../convert';

const convertions = {
    sRGB: a => a,
    xyz: ([R, G, B]) => {
        const { X, Y, Z } = sRGB_uncorrected_to_xyz({ R, G, B });
        return [X, Y, Z];
    },
    xyY: ([R, G, B]) => {
        const { x, y, Y } = xyz_to_xyY(sRGB_uncorrected_to_xyz({ R, G, B }));
        return [x, Y, y];
    },
};

const proj = async ({ gl }) => {
    const Drei = makeDrei(gl, materialClasses);
    const scene = new Drei.Scene({ clearColor: [1, 1, 1, 1] });
    
    const gui = new dat.GUI();
    const options = {
        speed: 0.015,
        pos: 1.4,
        grid: true,
        convex: true,
        to: 'xyz',
    };
    gui.add(options, 'pos', 0.5, 2);
    gui.add(options, 'speed', -0.1, 0.1);
    gui.add(options, 'grid');
    gui.add(options, 'convex');
    const steps = 20;

    const group = new Drei.Group();
    scene.root.addChild(group);

    let grid;
    {
        const t = new Drei.Tessellator(new Drei.MonosRGBMaterial());
        for (let i = 0; i < 1; i += 0.1) for (let j = 0; j < 1; j += 0.1) {
            t.v_pos(i, j, 0).v_pos(i, j, 1);
            t.v_pos(i, 0, j).v_pos(i, 1, j);
            t.v_pos(0, i, j).v_pos(1, i, j);
        }
        grid = t.build(gl.LINES);
        grid.uniforms.u_sRGB = [0.8, 0.8, 0.8];
        group.addChild(grid);
    }

    let gamut;
    const generateGamut = () => {
        const material = new Drei.CorrectedsRGBMaterial();
        const t = new Drei.Tessellator(material);
        const mix = (origin, delta, t) => origin.map((c, n) => c + delta[n] * t);
        [
            [[0, 0, 0], [1, 0, 0], [0, 1, 0]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
            [[0, 0, 0], [1, 0, 0], [0, 0, 1]], [[0, 1, 0], [1, 0, 0], [0, 0, 1]],
            [[0, 0, 0], [0, 0, 1], [0, 1, 0]], [[1, 0, 0], [0, 0, 1], [0, 1, 0]],
        ].forEach(([origin, di, dj]) => {
            for (let i = 0; i < steps; ++i) for (let j = 0; j < steps; ++j) {
                const p00 = mix(mix(origin, di, (i + 0) / steps), dj, (j + 0) / steps);
                const p01 = mix(mix(origin, di, (i + 0) / steps), dj, (j + 1) / steps);
                const p10 = mix(mix(origin, di, (i + 1) / steps), dj, (j + 0) / steps);
                const p11 = mix(mix(origin, di, (i + 1) / steps), dj, (j + 1) / steps);
                const t00 = convertions[options.to](p00);
                const t01 = convertions[options.to](p01);
                const t10 = convertions[options.to](p10);
                const t11 = convertions[options.to](p11);
                t.v_pos(...t00).v_sRGB(...p00);
                t.v_pos(...t01).v_sRGB(...p01);
                t.v_pos(...t11).v_sRGB(...p11);
                t.v_pos(...t00).v_sRGB(...p00);
                t.v_pos(...t10).v_sRGB(...p10);
                t.v_pos(...t11).v_sRGB(...p11);
            }
        });
        gamut = t.build(gl.TRIANGLES);
        group.addChild(gamut);
    }
    generateGamut();

    let convex;
    const generateConvex = () => {
        const material = new Drei.MonosRGBMaterial();
        const t = new Drei.Tessellator(material);
        const mix = (origin, delta, t) => origin.map((c, n) => c + delta[n] * t);
        [
            [[0, 0, 0], [1, 0, 0], [0, 1, 0]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
            [[0, 0, 0], [1, 0, 0], [0, 0, 1]], [[0, 1, 0], [1, 0, 0], [0, 0, 1]],
            [[0, 0, 0], [0, 0, 1], [0, 1, 0]], [[1, 0, 0], [0, 0, 1], [0, 1, 0]],
        ].forEach(([origin, di, dj]) => {
            for (let i = 0; i <= steps; ++i) for (let j = 0; j < steps; ++j) {
                const p0 = mix(mix(origin, di, (i + 0) / steps), dj, (j + 0) / steps);
                const p1 = mix(mix(origin, di, (i + 0) / steps), dj, (j + 1) / steps);
                const t0 = convertions[options.to](p0);
                const t1 = convertions[options.to](p1);
                t.v_pos(...t0);
                t.v_pos(...t1);
            }
            for (let i = 0; i < steps; ++i) for (let j = 0; j <= steps; ++j) {
                const p0 = mix(mix(origin, di, (i + 0) / steps), dj, (j + 0) / steps);
                const p1 = mix(mix(origin, di, (i + 1) / steps), dj, (j + 0) / steps);
                const t0 = convertions[options.to](p0);
                const t1 = convertions[options.to](p1);
                t.v_pos(...t0);
                t.v_pos(...t1);
            }
        });
        convex = t.build(gl.LINES);
        convex.uniforms.u_sRGB = [0, 0, 0];
        mat4.translate(convex.matrix, convex.matrix, [0.5, 0.5, 0.5]);
        mat4.scale(convex.matrix, convex.matrix, [1.01, 1.01, 1.01]);
        mat4.translate(convex.matrix, convex.matrix, [-0.5, -0.5, -0.5]);
        group.addChild(convex);
    };
    generateConvex();

    const camera = new Drei.PerspectiveCamera(90 / 180 * Math.PI, 0.01, 100);
    mat4.translate(camera.matrix, camera.matrix, [0, 0, options.pos]);
    scene.root.addChild(camera);
    scene.camera = camera;

    gui.add(options, 'to', Object.keys(convertions)).onChange(() => {
        if (gamut) gamut.remove();
        generateGamut();
        if (convex) convex.remove();
        generateConvex();
    });

    let rotate = 0;
    run(gl, scene, camera, () => {
        mat4.identity(scene.camera.matrix);
        mat4.translate(camera.matrix, camera.matrix, [0, 0, options.pos]);
        rotate += options.speed;
        mat4.identity(group.matrix);
        mat4.rotateY(group.matrix, group.matrix, rotate);
        mat4.translate(group.matrix, group.matrix, [-0.5, -0.5, -0.5]);
        grid.visible = options.grid;
        convex.visible = options.convex;
    });
};

function Projection() {
    const scale = 2;
    return (
        <Canvas
            width={600 * scale}
            height={600 * scale}
            style={{
                transform: `scale(${1 / scale})`,
            }}
        >{proj}</Canvas>
    );
}

export default Projection;
