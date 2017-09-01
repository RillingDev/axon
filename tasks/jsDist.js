"use strict";

const babel = require("babel-core");
const uglify = require("uglify-es");
const bundle = require("./lib/bundle");
const resolve = require("rollup-plugin-node-resolve");

bundle([{
    id: "es",
    ext: ".esm",
    name: "ES",
    fn: code => code
}, {
    id: "cjs",
    ext: ".common",
    name: "CommonJS",
    fn: code => code
}, {
    id: "iife",
    ext: "",
    name: "IIFE",
    fn: code => babel.transform(code, {
        compact: false
    }).code
}, {
    id: "iife",
    ext: ".min",
    name: "IIFE:min",
    fn: code => uglify.minify(
        babel.transform(code, {
            compact: false
        }).code
    ).code
}], [
    resolve({
        // use "module" field for ES6 module if possible
        module: true, // Default: true

        // use "jsnext:main" if possible
        // – see https://github.com/rollup/rollup/wiki/jsnext:main
        jsnext: true, // Default: false

        // use "main" field or index.js, even if it's not an ES6 module
        // (needs to be converted from CommonJS to ES6
        // – see https://github.com/rollup/rollup-plugin-commonjs
        main: false, // Default: true

        // some package.json files have a `browser` field which
        // specifies alternative files to load for people bundling
        // for the browser. If that's you, use this option, otherwise
        // pkg.browser will be ignored
        browser: false, // Default: false

        // If true, inspect resolved files to check that they are
        // ES2015 modules
        modulesOnly: true, // Default: false

    })
]);
