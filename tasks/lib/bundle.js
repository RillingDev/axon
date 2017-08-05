"use strict";

const rollup = require("rollup");
const replace = require("rollup-plugin-replace");
const saveOutput = require("./saveOutput");
const {
    DIR_SRC,
    DIR_DIST
} = require("./constants");
const packageJson = require("../../package.json");

/**
 * Bundles project with given formats
 * @param {Array} formats
 */
module.exports = function (formats) {
    rollup
        .rollup({
            entry: `${DIR_SRC}/main.js`,
            plugins: [replace({
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
            })]
        })
        .catch(err => {
            throw err;
        })
        .then(bundle => {
            formats.forEach(format => {
                bundle
                    .generate({
                        moduleName: packageJson.namespace.module,
                        format: format.id
                    })
                    .catch(err => {
                        throw err;
                    })
                    .then(result => {
                        saveOutput(
                            `${DIR_DIST}/${packageJson.namespace.file}${format.file}.js`,
                            format.fn(result.code),
                            `JS:${format.name}`
                        );
                    });
            });
        });
};
