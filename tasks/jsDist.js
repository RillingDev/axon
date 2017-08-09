"use strict";

const babel = require("babel-core");
const uglify = require("uglify-es");
const replace = require("rollup-plugin-replace");
const bundle = require("./lib/bundle");

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
    replace({
        "_content": "a",
        "_name": "b",
        "_opt": "c",

        "_element": "d",
        "_parent": "e",
        "_children": "f",

        "_val": "g",
        "_container": "h",
        "_key": "i",
        "_node": "j",
        "_args": "k",

        "_init": "l",
        "_render": "m",
    })
]);
