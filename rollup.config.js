import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import glslify from 'rollup-plugin-glslify';
import babel from 'rollup-plugin-babel';
import { string } from "rollup-plugin-string";
import copy from "rollup-plugin-copy";
// import { uglify } from 'rollup-plugin-uglify';

import react from 'react';
import reactDom from 'react-dom';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        builtins(),
        resolve({
            preferBuiltins: false,
            extensions: [ '.js', '.jsx', '.json' ],
        }),
        commonjs({
            namedExports: {
                react: Object.keys(react),
                'react-dom': Object.keys(reactDom),
            }
        }),
        globals(),
        glslify({ basedir: 'src/shaders' }),
        string({ include: '**/*.csv' }),
        babel({ exclude: 'node_modules/**' }),
        copy({
            targets: [
                { src: 'src/index.html', dest: 'dist' },
            ],
        }),
        // uglify(),
        ...(process.env.BUILD === 'production' ? [] : [
            livereload({ watch: 'dist' }),
            serve('dist'),
        ]),
    ],
};