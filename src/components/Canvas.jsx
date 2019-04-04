import React from 'react';
const { useRef, useEffect } = React;

function Canvas({ children }) {
    const ref = useRef();
    useEffect(() => {
        const { current: canvas } = ref;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (gl === null) {
            console.error("Unable to initialize WebGL.");
            return;
        }
        children({ canvas, gl });
    }, [ref.current]);
    return (
        <canvas ref={ref} width="1200" height="600"></canvas>
    );
}

export default Canvas;