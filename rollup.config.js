import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import glslify from 'rollup-plugin-glslify';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        resolve({ preferBuiltins: false }),
        commonjs(),
        builtins(),
        globals(),
        glslify({ basedir: 'src/shaders' }),
        babel({ exclude: 'node_modules/**' }),
        // uglify(),
        livereload(),
        serve(),
    ],
};