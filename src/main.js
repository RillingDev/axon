"use strict";

import query from "./dom/query";
import {
    parseDirectives
} from "./dom/directive";
import {
    getSubNodes
} from "./dom/nodes";
import {
    nodeProxy
} from "./controller/proxy";
import mapDirectives from "./directives/index";

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
    constructor(_element = null, _parent = null, data = {}, returnAll = false) {
        const proxy = new Proxy(this, nodeProxy);

        this.data = data;
        this.directives = parseDirectives(_element);

        this._element = _element;
        this._parent = _parent;
        this._children = getSubNodes(proxy, _element.children, AxonNode);

        /**
         * The root-node requires the direct access in addition to the proxy
         */
        return returnAll ? [this, proxy] : proxy;
    }
    /**
     * Runs directives on the node and all subnodes
     * @param {"init"|"render"} type
     * @returns {Array|false}
     */
    run(type) {
        const runDirective = directive => {
            if (mapDirectives.has(directive._name)) {
                const mapDirectivesEntry = mapDirectives.get(directive._name);

                if (mapDirectivesEntry[type]) {
                    return mapDirectivesEntry[type](directive, this, AxonNode);
                }
            }
            //Ignore non-existant diretcive types
            return true;

        };

        //Recurse if all directives return true
        if (this.directives.map(runDirective).every(directiveResult => directiveResult === true)) {
            return this._children.map(child => child.run(type));
        } else {
            return false;
        }
    }
    /**
     * Initializes directives
     */
    init() {
        return this.run("_init");
    }
    /**
     * Renders directives
     */
    render() {
        return this.run("_render");
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
        const node = super(query(cfg.el), null, cfg.data, true);

        /**
         * node[0] is the direct node access
         * node[1] is the proxied access
         */
        node[0].methods = cfg.methods || {};

        node[0].init();
        node[0].render();

        return node[1];
    }
};

export default AxonNodeRoot;
