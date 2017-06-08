'use strict';

/**
 * Create a new array with the same contents
 * @param {Array} arr
 * @returns {Array}
 */
const cloneArray = arr => Array.from(arr);

/**
 * Checks if type is array
 * @param {Array} arr
 * @returns {Boolean}
 */
const isArray = arr => Array.isArray(arr);

/**
 * Flatten Array Recursively
 * @param {Array} arr
 * @returns {Array}
 */
const flattenArray = function (arr) {
    const result = [];

    arr.forEach(item => {
        if (isArray(item)) {
            result.push(...flattenArray(item));
        } else {
            result.push(item);
        }
    });

    return result;
};

/**
 *
 * @param {String} selector
 * @param {Node} [context=document]
 * @param {Boolean} [context=false]
 * @returns {Node|Array}
 */
const query = function (selector, context = document, all = false) {
    return all ? cloneArray(context.querySelectorAll(selector)) : context.querySelector(selector);
};

//const DOM_EVENT_TIMEOUT = 20; //event timeout in ms
//const DOM_EVENT_MODEL = "input";

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_DELIMITER = ":";

/**
 * Checks if an attribute is an axon directive
 * @param {Attribute} attr
 * @returns {Boolean}
 */
const isAttrDirective = attr => attr.name.startsWith(DOM_ATTR_PREFIX);

/**
 * Checks if the element has any directives
 * @param {Element} element
 * @returns {Boolean}
 */
const hasDirectives = element => cloneArray(element.attributes).some(isAttrDirective);

/**
 * Returns directives on node
 * @param {Element} element
 * @returns {Array}
 */
const getDirectives = function (element) {
    const attributes = cloneArray(element.attributes).filter(isAttrDirective);

    return attributes.map(attr => {
        /**
         * 'x-bind:hidden="foo"' => nameFull=["bind","hidden"] val="foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);
        const val = attr.value;

        return {
            val,
            name: nameFull[0],
            secondary: nameFull[1] || false,
        };
    });
};

const directiveIgnoreBoth = () => false;

/*import evaluateExpression from "../../controller/evaluateExpression";
import {
    DOM_ATTR_HIDDEN
} from "../../lib/constants";*/

const directiveIfRender = function (node, directive, instanceContent) {
    /*const propValue = evaluateExpression(instanceContent, directive.val);
    const result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;*/
    return true;
};

/*import bindEvent from "../../dom/bindEvent";
import retrieveMethod from "../../controller/retrieveMethod";*/

const directiveOnInit = function (node, directive, instanceContent) {
    /*const targetMethod = retrieveMethod(instanceContent.$methods, directive.val);

    bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instanceContent);

    return true;*/
    return true;
};

/*import {
    bindEvent
} from "../../dom/event";
import retrieveProp from "../../controller/retrieveProp";
import getNodeValueType from "../../dom/getNodeValueType";*/

const directiveModelInit = function (directive, node) {
    /*const targetProp = retrieveProp(instanceContent.$data, directive.val);
    const eventFn = function (currentValue, newValue) {
        targetProp.ref[directive.val] = newValue;

        setTimeout(() => {
            instanceMethods.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instanceContent);

    return true;*/
    console.log("MODEL",[directive, node]);
    return true;
};

const directiveModelRender = function (directive, node) {
    /*const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instanceContent.$data, directive.val);

    node[nodeValueType] = propValue.val;*/

    console.log("MODEL",[directive, node]);
    return true;
};

//import evaluateExpression from "../../controller/evaluateExpression";

const directiveBindRender = function (node, directive,instanceContent) {
    /*const propValue = evaluateExpression(instanceContent, directive.val);

    node.setAttribute(directive.opt, propValue);

    return true;*/
    return true;
};

const directives = {
    "ignore": {
        init: directiveIgnoreBoth,
        render: directiveIgnoreBoth
    },
    "if": {
        render: directiveIfRender
    },
    "on": {
        init: directiveOnInit,
    },
    model: {
        init: directiveModelInit,
        render: directiveModelRender
    },
    "bind": {
        render: directiveBindRender
    }
};

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
     * Runs directive over node, returns false when this node shouldnt be recursed
     * @param {"init"|"render"} type
     * @returns {Boolean}
     */
    execDirectives(type) {
        return this.directives.map(directive => {
            const directivesDictEntry = directives[directive.name];

            if (!directivesDictEntry) {
                console.log(`directive '${directive.name}' not found`);
                return true;
            } else {
                if (!directivesDictEntry[type]) {
                    console.log(`directive has no type '${type}'`);
                    return true;
                } else {
                    return directivesDictEntry[type](directive, this);
                }
            }
        }).every(val => val !== false);
    }
    /**
     * Runs execDirectives against the node and all subnodes
     * @param {"init"|"render"} type
     */
    execDirectivesRecursive(type) {
        const result = this.execDirectives(type);

        if (result) {
            this._children.forEach(child => {
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

module.exports = AxonNodeRoot;
