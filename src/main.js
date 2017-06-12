"use strict";

import {
    cloneArray,
    flattenArray
} from "./util";
import query from "./dom/query";
import {
    hasDirectives,
    getDirectives
} from "./dom/directive";
import directivesDict from "./directives/index";

/**
 * Axon Node
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     * @param {Object} data
     * @param {Element} _element
     * @param {Element} _parent
     */
    constructor(data = {}, _element = null, _parent = null) {
        const node = this;
        const recurseSubNodes = function (child) {
            if (hasDirectives(child)) {
                //-> Recurse
                return new AxonNode({}, child, node);
            } else if (child.children.length > 0) {
                //-> Enter Children
                return getSubNodes(child.children);
            } else {
                //-> Exit dead-end
                return null;
            }
        };
        const getSubNodes = children => flattenArray(cloneArray(children).map(recurseSubNodes).filter(val => val !== null));

        this.data = data; //@TODO attach proxy
        this.directives = getDirectives(_element);

        this._element = _element;
        this._parent = _parent;
        this._children = getSubNodes(_element.children);

        //return new Proxy(this, nodeProxy);
    }
    /**
     * Runs directive over node, returns false when this node shouldnt be recursed
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
     * Runs execDirectives against the node and all subnodes
     * @param {"init"|"render"} type
     */
    runDeep(type) {
        const result = this.run(type).every(val => val !== false);

        if (result) {
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
    constructor(cfg) {
        super(cfg.data, query(cfg.el));

        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};

export default AxonNodeRoot;
