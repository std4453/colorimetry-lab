import '@babel/polyfill';
import xyY from './xyY';
import gamma from './gamma';
import shades from './shades';

const programs = { xyY, gamma, shades };

(() => {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    programs.shades({ canvas, gl });
})();
