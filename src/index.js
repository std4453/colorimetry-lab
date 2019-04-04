import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Canvas from './canvas';
import xyY from './xyY';
import gamma from './gamma';
import shades from './shades';

const programs = { xyY, gamma, shades };
ReactDOM.render(
    React.createElement(
        Canvas,
        { program: programs.shades },
    ),
    document.getElementById('container'),
);
