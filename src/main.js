"use strict";

import query from "./dom/query";
import {
    getDirectives
} from "./dom/directive";
import {
    getSubNodes
} from "./dom/nodes";
import {
    nodeProxy
} from "./controller/proxy";
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
        const proxy = new Proxy(this, nodeProxy);

        proxy.data = data;

        proxy._element = _element;
        proxy._parent = _parent;
        proxy._children = getSubNodes(proxy, _element.children, AxonNode);

        proxy.directives = getDirectives(_element);

        return proxy;
    }
    /**
     * Runs directives on the node and all subnodes
     * @param {"init"|"render"} type
     * @returns {Array|false}
     */
    run(type) {
        const runDirective = directive => {
            const directivesDictEntry = directivesDict[directive.name];

            if (directivesDictEntry && directivesDictEntry[type]) {
                return directivesDictEntry[type](directive, this);
            } else {
                return true;
            }
        };

        //Recurse if all directives return true
        if (this.directives.map(runDirective).every(val => val === true)) {
            return this._children.map(child => child.run(type));
        } else {
            return false;
        }
    }
    /**
     * Initializes directives
     */
    init() {
        return this.run("init");
    }
    /**
     * Renders directives
     */
    render() {
        return this.run("render");
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
