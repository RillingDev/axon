'use strict';

/**
 *
 * @param {String} selector
 * @param {Node} [context=document]
 * @param {Boolean} [context=false]
 * @returns {Node|Array}
 */
const query = function (selector, context = document, all = false) {
    return all ? Array.from(context.querySelectorAll(selector)) : context.querySelector(selector);
};

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

//const DOM_EVENT_TIMEOUT = 20; //event timeout in ms
//const DOM_EVENT_MODEL = "input";

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_DELIMITER = ":";

/**
 * Checks if the element has any directives
 * @param {Element} element
 * @returns {Boolean}
 */
const hasDirectives = element => cloneArray(element.attributes).some(attr => attr.name.startsWith(DOM_ATTR_PREFIX));

/**
 * Returns directives on node
 * @param {Element} element
 * @returns {Array}
 */
const getDirectives = function (element) {
    const attributes = cloneArray(element.attributes).filter(attr => attr.name.startsWith(DOM_ATTR_PREFIX));

    return attributes.map(attr => {
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);
        const val = attr.value;

        return {
            val,
            name: nameFull[0],
            secondary: nameFull[1],
        };
    });
};

/**
 * Maps trough nodelist and filters output
 * @param {NodeList} nodelist
 * @param {Function} fn
 * @returns {Array}
 */
const mapFilterNodeList = (nodelist, fn) => cloneArray(nodelist).map(fn).filter(val => val !== null);

/**
 * Returns deep-children
 * @param {Element} element
 * @returns {AxonNode}
 */
const getSubNodes = function (element, AxonNode) {
    /**
     * Recurse and map subNodes
     * @param {Element} child
     * @returns {Mixed}
     */
    const recurseSubNodes = child => {
        if (hasDirectives(child)) {
            //-> Recurse
            return new AxonNode(child, element);
        } else if (child.children.length > 0) {
            //-> Enter Children
            return mapFilterNodeList(child.children, recurseSubNodes);
        } else {
            //-> Exit dead-end
            return null;
        }
    };

    return flattenArray(mapFilterNodeList(element.children, recurseSubNodes));
};

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

module.exports = AxonNodeRoot;
