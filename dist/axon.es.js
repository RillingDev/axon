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
const mapFilterNodeList = (nodelist, fn) => cloneArray(nodelist).map(fn).filter(val => val !== null);

/**
 * Returns deep-children
 * @param {Element} element
 * @returns {AxonNode}
 */
const getSubNodes = function (element) {
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

    return mapFilterNodeList(element.children, recurseSubNodes);
};

/**
 * Axon Element Node
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     * @param {Element} element
     * @param {Element} parent
     */
    constructor(element, parent) {
        this.element = element;
        this.parent = parent;
        this.children = getSubNodes(element);

        this.data = {};

        //this.directives = [];

        console.log(this);
    }
};

/**
 * Axon Class
 * @class
 */
const Axon = class {
    /**
     * Basic Axon Constructor
     * @constructor
     * @param {Object} cfg Config data for the Axon instance
     * @returns {Axon} Returns Axon instance
     */
    constructor(cfg) {
        const element = query(cfg.el);

        this.data = cfg.data;
        this.methods = cfg.methods;

        this.entry = new AxonNode(element, null);

        this.init();
        this.render();
    }
    /**
     * Initializes directives
     * @param {Element} [element=this.context]
     */
    init(element = this.context) {

    }
    /**
     * Renders directives
     * @param {Element} [element=this.context]
     */
    render(element = this.context) {

    }
};

export default Axon;
