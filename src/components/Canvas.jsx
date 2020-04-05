import React from 'react';
const { useRef, useEffect } = React;

function Canvas({ children, ...rest }) {
    const ref = useRef();
    useEffect(() => {
        const { current: canvas } = ref;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (gl === null) {
            console.error("Unable to initialize WebGL.");
            return;
        }
        const unloadListeners = [];
        const addUnloadListener = l => unloadListeners.push(l);
        children({ canvas, gl, addUnloadListener });
        return () => unloadListeners.forEach(l => l());
    }, [ref.current]);
    return (
        <canvas ref={ref} {...rest}></canvas>
    );
}

export default Canvas;