"use strict";

module.exports = function(grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt, {});

    grunt.initConfig({
        watch: {
            js: {
                files: [
                    "src/{,*/}*.js"
                ],
                tasks: [
                    "exec"
                ]
            },
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        "dist/{,*/}*",
                        ".tmp/{,*/}*"
                    ]
                }]
            }
        },

        uglify: {
            main: {
                files: {
                    "dist/axon.min.js": "dist/axon.js",
                },
                options: {
                    compress: {
                        drop_console: true,
                        screw_ie8: true
                    }
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ["es2015"],
                plugins: []
            },
            dist: {
                files: {
                    "dist/axon.amd.js": "dist/es6/axon.amd.js",
                    "dist/axon.common.js": "dist/es6/axon.common.js",
                    "dist/axon.es.js": "dist/es6/axon.es.js",
                    "dist/axon.js": "dist/es6/axon.js"
                }
            }
        },

        exec: {
            rollup: {
                cmd: "rollup -c"
            }
        }

    });

    grunt.registerTask("build", [
        "clean:dist",
        "exec",
    ]);

    grunt.registerTask("dist", [
        "build",
        "babel",
        "uglify",
    ]);

    grunt.registerTask("default", [
        "dist"
    ]);

};
