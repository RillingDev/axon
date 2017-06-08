"use strict";

import query from "./dom/query";
import {
    hasDirectives,
    getDirectives
} from "./dom/directive";
import {
    cloneArray,
    flattenArray
} from "./util";

/**
 * Axon Node
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     * @param {Element} element
     * @param {Element|true} _root
     */
    constructor(element, _root) {
        const recurseSubNodes = function (child) {
            if (hasDirectives(child)) {
                //-> Recurse
                return new AxonNode(child, _root);
            } else if (child.children.length > 0) {
                //-> Enter Children
                return getSubNodes(child.children);
            } else {
                //-> Exit dead-end
                return null;
            }
        };
        const getSubNodes = children => flattenArray(cloneArray(children).map(recurseSubNodes).filter(val => val !== null));

        this.data = {};
        this.directives = getDirectives(element);

        this._root = _root; //is either a reference to the root or true if the node is the root
        this._element = element;
        //Flatten Array as we only care about the relative position
        this._children = getSubNodes(element.children);
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
        const element = query(cfg.el);

        super(element, true);

        this.data = cfg.data || {};
        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};


export default AxonNodeRoot;
