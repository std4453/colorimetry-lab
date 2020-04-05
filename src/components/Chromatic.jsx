import React from 'react';
import { mat4 } from 'gl-matrix';
import * as dat from 'dat.gui';

import Canvas from './Canvas';
import { makeDrei, run } from '../drei';
import materialClasses from '../materials';

import { wave_length_to_xyz, sRGB_uncorrected_to_xyz, xyz_to_xyY, temp_to_xy } from '../convert';

const sources = {
    wavelength: {
        range: [390, 750],
        convert: wl => wave_length_to_xyz(wl),
    },
    sRGB: {
        range: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
        convert: ([R, G, B]) => sRGB_uncorrected_to_xyz({ R, G, B }),
    },
};

const targets = {
    CIExyY: {
        material: 'CIE1931xyYMaterial',
        key: 'v_xyY',
        convert: (c) => {
            const { x, y, Y } = xyz_to_xyY(c);
            return [x, y, Y];
        },
    },
};

const centers = {
    D65: { X: 95.047 / 100, Y: 100.00 / 100, Z: 108.883 / 100 },
    D50: { X: 96.42 / 100, Y: 100.00 / 100, Z: 82.51 / 100 },
};

const chromatic = async ({ canvas, gl, addUnloadListener }) => {
    const { width, height } = canvas;
    
    const Drei = makeDrei(gl, materialClasses);
    const scene = new Drei.Scene({ clearColor: [1, 1, 1, 1] });
    
    const startWL = 390, endWL = 750, stepWL = 0.1;
    const startT = 1667, endT = 25000, stepT = 1;

    const options = {
        specLoc: true,
        plankLoc: true,
        from: 'wavelength',
        to: 'CIExyY',
        center: 'D65',
        steps: 100,
    };

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

    let graph;
    const mix = (a, b, t) => {
        if (a instanceof Array) return a.map((n, i) => n * (1 - t) + b[i] * t);
        else return a * (1 - t) + b * t;
    }
    const generateGraph = () => {
        const from = sources[options.from], to = targets[options.to], center = centers[options.center];
        const t = new Drei.Tessellator(new Drei[to.material]());
        const steps = options.steps;
        
        {
            const pTgt = to.convert(center);
            const [x, y] = pTgt;
            t.v_pos(x * width, y * height, 0);
            t[to.key].apply(t, pTgt);
        }
        for (let i = 0; i < from.range.length - 1; ++i) {
            const aSrc = from.range[i], bSrc = from.range[i + 1];
            for (let j = 0; j < steps; ++j) {
                const pSrc = mix(aSrc, bSrc, j / steps);
                const pXyz = from.convert(pSrc);
                const pTgt = to.convert(pXyz);
                const [x, y] = pTgt;
                t.v_pos(x * width, y * height, 0);
                t[to.key].apply(t, pTgt);
            }
        }
        {
            const aSrc = from.range[from.range.length - 1], bSrc = from.range[0];
            const aXyz = from.convert(aSrc), bXyz = from.convert(bSrc);
            const aTgt = to.convert(aXyz), bTgt = to.convert(bXyz);
            for (let j = 0; j <= steps; ++j) {
                const pTgt = mix(aTgt, bTgt, j / steps);
                const [x, y] = pTgt;
                t.v_pos(x * width, y * height, 0);
                t[to.key].apply(t, pTgt);
            }
        }
        graph = t.build(gl.TRIANGLE_FAN);
        mat4.translate(graph.matrix, graph.matrix, [-width / 2, -height / 2, 1]);
        scene.root.addChild(graph);
    };
    generateGraph();

    let specLoc;
    {
        const t = new Drei.Tessellator(new Drei.MonosRGBMaterial());
        for (let i = startWL; i <= endWL; i += stepWL) {
            const { x, y } = xyz_to_xyY(wave_length_to_xyz(i));
            t.v_pos(x * width, y * height, 3);
        }
        specLoc = t.build(gl.LINE_STRIP);
        specLoc.visible = options.specLoc;
        specLoc.uniforms.u_sRGB = [0, 0, 0];
        mat4.translate(specLoc.matrix, specLoc.matrix, [-width / 2, -height / 2, 1]);
        scene.root.addChild(specLoc);
    }

    let plankLoc;
    {
        const t = new Drei.Tessellator(new Drei.MonosRGBMaterial());
        for (let i = startT; i <= endT; i += stepT) {
            const { x, y } = temp_to_xy(i);
            t.v_pos(x * width, y * height, 4);
        }
        plankLoc = t.build(gl.LINE_STRIP);
        plankLoc.visible = options.plankLoc;
        plankLoc.uniforms.u_sRGB = [0, 0, 0];
        mat4.translate(plankLoc.matrix, plankLoc.matrix, [-width / 2, -height / 2, 1]);
        scene.root.addChild(plankLoc);
    }

    const camera = new Drei.HUDCamera(-100, 100);
    scene.root.addChild(camera);
    scene.camera = camera;

    const gui = new dat.GUI();
    gui.add(options, 'specLoc');
    gui.add(options, 'plankLoc');
    const regenerate = () => {
        if (graph) graph.remove();
        generateGraph();
    };
    gui.add(options, 'from', Object.keys(sources)).onChange(regenerate);
    gui.add(options, 'to', Object.keys(targets)).onChange(regenerate);
    gui.add(options, 'center', Object.keys(centers)).onChange(regenerate);
    gui.add(options, 'steps', 5, 500, 1).onChange(regenerate);
    addUnloadListener(() => gui.destroy());

    run(gl, scene, camera, () => {
        specLoc.visible = options.specLoc;
        plankLoc.visible = options.plankLoc;
    });
};

function Chromatic() {
    const scale = window.devicePixelRatio;
    return (
        <Canvas
            width={600 * scale}
            height={600 * scale}
            style={{
                transform: `scale(${1 / scale})`,
            }}
        >{chromatic}</Canvas>
    );
}

export default Chromatic;
