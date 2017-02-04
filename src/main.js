"use strict";

import getDomMap from "./dom/getDomMap";
import execDirectives from "./directives/execDirectives";
import isDefined from "./lib/isDefined";

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

        _this.$context = document.querySelector(config.el);
        _this.$data = config.data;
        _this.$methods = config.methods;
        _this.$cache = getDomMap(_this.$context);

        _this.$init();
        _this.$render();
    }
    /**
     * Init directives
     */
    $init(mapNode) {
        const _this = this;
        const entry = isDefined(mapNode) ? mapNode : _this.$cache;

        execDirectives(_this, entry, "init");
    }
    /**
     * Renders controller changes
     */
    $render(mapNode) {
        const _this = this;
        const entry = isDefined(mapNode) ? mapNode : _this.$cache;

        execDirectives(_this, entry, "render");
    }
};


export default Axon;
