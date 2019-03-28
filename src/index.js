import '@babel/polyfill';
import gamma from './gamma';

(() => {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext("webgl");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    gamma({ canvas, gl });
})();
