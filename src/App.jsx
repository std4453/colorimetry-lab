import React, { useState, useMemo, useEffect } from 'react';
import * as dat from 'dat.gui';
import GammaCorrection from './components/GammaCorrection';
import Chromatic from './components/Chromatic';
import Projection from './components/Projection';

const initialMode = 'gamma';

function App() {
    const [mode, setMode] = useState(initialMode);
    
    useEffect(() => {
        const gui = new dat.GUI();
        const options = { mode: initialMode };
        gui.add(options, 'mode', ['gamma', 'chromatic', 'projection']).onChange(value => setMode(value));
    }, []);

    return <>
        {mode === 'gamma' && <GammaCorrection/>}
        {mode === 'chromatic' && <Chromatic/>}
        {mode === 'projection' && <Projection/>}
    </>
}

export default App;
