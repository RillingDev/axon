"use strict";

import {
    _document
} from "./lib/constants";
import init from "./init/index";
import render from "./render/index";

/**
 * Basic Axon Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Axon instance
 */
const Axon = function (appConfig) {
    const _this = this;

    _this.$context = _document.querySelector(appConfig.context);
    _this.$data = appConfig.data;
    _this.$methods = appConfig.methods;

    _this.$init();
    _this.$render();
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    $init:init,
    $render:render,
    constructor: Axon,
};

export default Axon;
