import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Canvas from './canvas';
import xyY from './components/xyY';
import gamma from './components/gamma';
import shades from './components/shades';

const programs = { xyY, gamma, shades };
ReactDOM.render(
    React.createElement(
        Canvas,
        { program: programs.shades },
    ),
    document.getElementById('container'),
);
