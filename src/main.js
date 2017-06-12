"use strict";

import query from "./dom/query";
import {
    getDirectives
} from "./dom/directive";
import {
    getSubNodes
} from "./dom/nodes";
import directivesDict from "./directives/index";

/**
 * Axon Node
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     * @param {Element} _element
     * @param {Element} _parent´
     * @param {Object} data
     */
    constructor(_element = null, _parent = null, data = {}) {
        this._element = _element;
        this._parent = _parent;
        this._children = getSubNodes(this, _element.children, AxonNode);

        this.directives = getDirectives(_element);
        this.data = data; //@TODO attach proxy

        //return new Proxy(this, nodeProxy);
    }
    /**
     * Runs directive on node, returns false when this node shouldnt be recursed
     * @param {"init"|"render"} type
     * @returns {Array}
     */
    run(type) {
        return this.directives.map(directive => {
            const directivesDictEntry = directivesDict[directive.name];

            if (directivesDictEntry && directivesDictEntry[type]) {
                return directivesDictEntry[type](directive, this);
            } else {
                return true;
            }
        });
    }
    /**
     * Runs directives on the node and all subnodes
     * @param {"init"|"render"} type
     * @returns {Array|false}
     */
    runDeep(type) {
        const result = this.run(type);

        //Recurse if all directives return true
        if (result.every(val => val !== false)) {
            return this._children.map(child => child.runDeep(type));
        } else {
            return false;
        }
    }
    /**
     * Initializes directives
     */
    init() {
        return this.runDeep("init");
    }
    /**
     * Renders directives
     */
    render() {
        return this.runDeep("render");
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
     */
    constructor(cfg = {}) {
        super(query(cfg.el), null, cfg.data);

        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};

export default AxonNodeRoot;
