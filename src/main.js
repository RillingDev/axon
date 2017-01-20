"use strict";

import getDomMap from "./dom/getDomMap";
import execDirectives from "./directives/execDirectives";

/**
 * Axon Class
 * @class
 */
const Axon = class {
    /**
     * Basic Axon Constructor
     * @constructor
     * @param {Object} config Config data for the Axon instance
     * @returns {Axon} Returns Axon instance
     */
    constructor(config) {
        const _this = this;

        _this.$context = document.querySelector(config.context);
        _this.$data = config.data;
        _this.$methods = config.methods;
        _this.$cache = {};

        _this.$init();

        return _this;
    }
    /**
     * Init directives
     */
    $init() {
        const _this = this;

        _this.$cache = getDomMap(_this.$context);
        execDirectives(_this, _this.$cache, "init");
    }
    /**
     * Renders controller changes
     */
    $render() {
        const _this = this;

        execDirectives(_this, _this.$cache, "render");
    }
};


export default Axon;
