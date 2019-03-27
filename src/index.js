import testgl from './testgl';

(() => {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext("webgl");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    testgl({ canvas, gl });
})();
