"use strict";

const rollup = require("rollup");
const replace = require("rollup-plugin-replace");
const babel = require("babel-core");
const uglify = require("uglify-es");
const packageJson = require("../package.json");
const saveOutput = require("./lib/saveOutput");
const {
    DIR_SRC,
    DIR_DIST
} = require("./lib/constants");

rollup
    .rollup({
        entry: `${DIR_SRC}/main.js`,
        plugins: []
    })
    .catch(err => {
        console.log(err);
    })
    .then(bundle => {
        const result_es = bundle.generate({
            format: "es"
        }).code;
        const result_cjs = bundle.generate({
            format: "cjs"
        }).code;
        const result_iife = babel.transform(bundle.generate({
            moduleName: packageJson.namespace.module,
            format: "iife"
        }).code).code;

        saveOutput(`${DIR_DIST}/${packageJson.namespace.file}.esm.js`, result_es, "JS:ES");
        saveOutput(`${DIR_DIST}/${packageJson.namespace.file}.common.js`, result_cjs, "JS:CommonJS");
        saveOutput(`${DIR_DIST}/${packageJson.namespace.file}.js`, result_iife, "JS:IIFE");
    });

rollup
    .rollup({
        entry: `${DIR_SRC}/main.js`,
        plugins: [replace({
            "_content": "_a",
            "_name": "_b",
            "_opt": "_c",

            "_element": "_d",
            "_parent": "_e",
            "_children": "_f",

            "_val": "_g",
            "_container": "_h",
            "_key": "_i",
            "_node": "_j",
            "_args": "_k",
        })]
    })
    .catch(err => {
        console.log(err);
    })
    .then(bundle => {
        const result_iife = babel.transform(bundle.generate({
            moduleName: packageJson.namespace.module,
            format: "iife"
        }).code).code;
        const result_iife_min = uglify.minify(result_iife).code;

        saveOutput(`${DIR_DIST}/${packageJson.namespace.file}.min.js`, result_iife_min, "JS:IIFE-min");
    });
