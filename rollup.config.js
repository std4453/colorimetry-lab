import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import glslify from 'rollup-plugin-glslify';
import babel from 'rollup-plugin-babel';
import { string } from "rollup-plugin-string";
// import { uglify } from 'rollup-plugin-uglify';

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
        commonjs(),
        globals(),
        glslify({ basedir: 'src/shaders' }),
        string({ include: '**/*.csv' }),
        babel({ exclude: 'node_modules/**' }),
        // uglify(),
        livereload({ watch: 'dist' }),
        serve(),
    ],
};