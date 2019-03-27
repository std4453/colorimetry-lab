const run = (gl, scene, update, options = {}) => {
    scene.init();
    let frameCount = 0;
    const frame = (elapsed) => {
        // console.log(gl.getError());
        ++frameCount;
        const ctx = { ...options, scene, frameCount, elapsed };
        scene.renderFrame(ctx);
        update(ctx);
        // requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};

export default run;
