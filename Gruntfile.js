"use strict";

module.exports = function (grunt) {
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
                    "dist/axon.min.js": "dist/axon.min.js",
                    //"dist/axon-lite-es5.min.js": ".tmp/axon-lite-es5.js"
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
                plugins: ["array-includes"]
            },
            dist: {
                files: {
                    "dist/axon.js": "dist/axon.js",
                    //".tmp/axon-lite-es5.js": ".tmp/axon-lite.js"
                }
            }
        },

        exec: {
            rollup: {
                cmd: "rollup -c"
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        //Container strings
                        /*{
                            match: /_name/g,
                            replacement: "n"
                        }, {
                            match: /_type/g,
                            replacement: "t"
                        }, {
                            match: /_deps/g,
                            replacement: "d"
                        }, {
                            match: /_fn/g,
                            replacement: "f"
                        }, {
                            match: /_init/g,
                            replacement: "i"
                        }, {
                            match: /_args/g,
                            replacement: "a"
                        },*/
                        //Util
                        {
                            match: /_each/g,
                            replacement: "e"
                        }, {
                            match: /_eachObject/g,
                            replacement: "o"
                        },

                    ]
                },
                files: {
                    "dist/axon.min.js": "dist/axon.js"
                },

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
        "replace",
        "uglify",
    ]);

    grunt.registerTask("default", [
        "dist"
    ]);

};
