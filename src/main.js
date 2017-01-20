"use strict";

import getDomMap from "./dom/getDomMap";
import execDirectives from "./directives/execDirectives";

/**
 * Basic Axon Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Axon instance
 */
const Axon = class {
    constructor(config) {
        const _this = this;

        _this.$context = document.querySelector(config.context);
        _this.$data = config.data;
        _this.$methods = config.methods;
        _this.$cache = {};

        _this.$init();
        _this.$render();
    }
    $init() {
        const _this = this;

        _this.$cache = getDomMap(_this.$context);
        execDirectives(_this, _this.$cache, "init");
    }
    $render() {
        const _this = this;

        execDirectives(_this, _this.$cache, "render");
    }
};


export default Axon;
