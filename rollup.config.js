"use strict";
import {
    rollup
} from "rollup";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

export default {
    moduleName: "Axon",
    moduleId: "axon",
    entry: "src/main.js",
    plugins: [
        nodeResolve({
            jsnext: false,
            main: true
        }),
        commonjs({})
    ],
    targets: [{
        dest: "dist/es6/axon.amd.js",
        format: "amd"
    }, {
        dest: "dist/es6/axon.common.js",
        format: "cjs"
    }, {
        dest: "dist/es6/axon.es.js",
        format: "es"
    }, {
        dest: "dist/es6/axon.js",
        format: "iife"
    }]
};
