import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import CIExyY from './components/CIExyY';

ReactDOM.render(
    React.createElement(CIExyY),
    document.getElementById('container'),
);
