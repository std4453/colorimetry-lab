import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Chromatic from './components/Chromatic';

ReactDOM.render(
    React.createElement(Chromatic),
    document.getElementById('container'),
);
