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
import directivesDict from "./directives/index";

/**
 * Axon Node
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     * @param {Element} element
     * @param {Element} _parent
     * @param {Element|true} _root
     */
    constructor(_element, _parent = null, _root = this) {
        const node = this;
        const recurseSubNodes = function (child) {
            if (hasDirectives(child)) {
                //-> Recurse
                return new AxonNode(child, node, _root);
            } else if (child.children.length > 0) {
                //-> Enter Children
                return getSubNodes(child.children);
            } else {
                //-> Exit dead-end
                return null;
            }
        };
        const getSubNodes = children => flattenArray(cloneArray(children).map(recurseSubNodes).filter(val => val !== null));

        this.data = {}; //@TODO attach proxy

        this.directives = getDirectives(_element);

        this._element = _element;
        this._parent = _parent;
        this._root = _root;
        this._children = getSubNodes(_element.children);
    }
    /**
     * Runs directive over node, returns false when this node shouldnt be recursed
     * @param {"init"|"render"} type
     * @returns {Boolean}
     */
    execDirectives(type) {
        return this
            .directives
            .map(directive => {
                const directivesDictEntry = directivesDict[directive.name];

                if (!directivesDictEntry) {
                    //Directive is not supported
                    return true;
                } else {
                    if (!directivesDictEntry[type]) {
                        //Directive doesnt have this type
                        return true;
                    } else {
                        return directivesDictEntry[type](directive, this);
                    }
                }
            })
            .every(val => val !== false);
    }
    /**
     * Runs execDirectives against the node and all subnodes
     * @param {"init"|"render"} type
     */
    execDirectivesRecursive(type) {
        const result = this.execDirectives(type);

        if (result) {
            this
                ._children
                .forEach(child => {
                    child.execDirectives(type);
                });
        }

        return result;
    }
    /**
     * Initializes directives
     */
    init() {
        return this.execDirectivesRecursive("init");
    }
    /**
     * Renders directives
     */
    render() {
        return this.execDirectivesRecursive("render");
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
        super(query(cfg.el));

        this.data = cfg.data || {};
        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};

export default AxonNodeRoot;
