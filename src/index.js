import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Projection from './components/Projection';

ReactDOM.render(
    React.createElement(Projection),
    document.getElementById('container'),
);
