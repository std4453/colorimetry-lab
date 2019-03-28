const run = (gl, scene, camera, update, options = {}) => {
    camera.updateMatrix();
    let frameCount = 0;
    const frame = (elapsed) => {
        // console.log(gl.getError());
        ++frameCount;
        const ctx = { ...options, scene, frameCount, elapsed };
        scene.render(ctx, camera);
        update(ctx);
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};

export default run;
