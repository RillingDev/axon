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

//const DOM_EVENT_TIMEOUT = 20; //event timeout in ms
//const DOM_EVENT_MODEL = "input";

const DOM_ATTR_PREFIX = "x-";

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
 * Checks if the element has any directives
 * @param {Element} element
 * @returns {Boolean}
 */
const hasDirectives = element => cloneArray(element.attributes).some(attr => attr.name.startsWith(DOM_ATTR_PREFIX));

/**
 * maps trough nodelist and filters output
 * @param {NodeList} nodelist
 * @param {Function} fn
 * @returns {Array}
 */
const mapFilterNodeList = (nodelist, fn) => cloneArray(nodelist).map(item => fn(item)).filter(val => val !== null);

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
        //console.log([child]);
        if (hasDirectives(child)) {
            return new AxonNode(child, element);
        } else if (child.children.length > 0) {
            return mapFilterNodeList(child.children, recurseSubNodes);
        } else {
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

        //this.directives = [];

        //this.$data = {};
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
        //this.$computed = cfg.computed || {};
        //this.$methods = cfg.methods || {};

        this.init();
        this.render();
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

export default AxonNodeRoot;
