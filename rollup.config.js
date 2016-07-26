"use strict";
import {
    rollup
} from "rollup";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

let pkg = require("./package.json");
let external = Object.keys(pkg.dependencies);

export default {
    moduleName: "Axon",
    moduleId: "axon",
    entry: "src/main.js",
    external: external,
    plugins: [
        nodeResolve({
            jsnext: false,
            main: true
        }),
        commonjs({})
    ],
    targets: [{
        dest: "dist/axon.amd.js",
        format: "amd"
    }, {
        dest: "dist/axon.common.js",
        format: "cjs"
    }, {
        dest: "dist/axon.umd.js",
        format: "umd"
    }, {
        dest: "dist/axon.es.js",
        format: "es"
    }, {
        dest: "dist/axon.js",
        format: "iife"
    }]
};
