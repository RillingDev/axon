"use strict";

import query from "./dom/query";
import {
    getSubNodes
} from "./dom/node";

/**
 * Axon Node
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     * @param {Element} element
     * @param {Element|false} parent
     */
    constructor(element, parent) {
        this.element = element;
        this.parent = parent;
        this.children = getSubNodes(element, AxonNode);

        //this.directives = [];

        //this.$data = {};
    }
};

/**
 * Axon Root Node
 * @class
 */
const AxonNodeRoot = class extends AxonNode {
    /**
     * Basic Axon Constructor
     * @constructor
     * @param {Object} cfg Config data for the Axon instance
     * @returns {Axon} Returns Axon instance
     */
    constructor(cfg) {
        super(query(cfg.el), false);

        //this.$data = cfg.data || {};
        //this.$computed = cfg.computed || {};
        //this.$methods = cfg.methods || {};

        this.init();
        this.render();
    }
    /**
     * Initializes directives
     */
    init() {

    }
    /**
     * Renders directives
     */
    render() {

    }
};


export default AxonNodeRoot;
