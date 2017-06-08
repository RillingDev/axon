"use strict";

import query from "./dom/query";
import {
    hasDirectives,
    getDirectives
} from "./dom/directive";
import {
    cloneArray,
    flattenArray,
    mapFilter
} from "./util";

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
    constructor(element, parent, _root) {
        const recurseSubNodes = function (child) {
            if (hasDirectives(child)) {
                //-> Recurse
                return new AxonNode(child, element, _root);
            } else if (child.children.length > 0) {
                //-> Enter Children
                return getSubNodes(child.children);
            } else {
                //-> Exit dead-end
                return null;
            }
        };
        const getSubNodes = children => flattenArray(mapFilter(cloneArray(children), recurseSubNodes));

        this.data = {};
        this.directives = getDirectives(element);

        this._element = element;
        this._parent = parent;
        this._root = _root; //is either a reference to the root or true if the node is the root
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

        super(element, false, true);

        this.data = cfg.data || {};
        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};


export default AxonNodeRoot;
