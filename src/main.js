"use strict";

import query from "./dom/query";
import {
    getSubNodes
} from "./dom/node";
import {
    getDirectives
} from "./dom/directive";

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

        this.directives = getDirectives(element);

        //this.$data = {};
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
        //this.$methods = cfg.methods || {};

        this.init();
        this.render();
    }
};


export default AxonNodeRoot;
