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
 * Checks if a vlue is not undefined
 * @param {Mixed} val
 * @returns {Boolean}
 */
const isDefined = val => typeof val !== "undefined";

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

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_DELIMITER = ":";
const DOM_ATTR_HIDDEN = "hidden";

const DOM_PROP_VALUE = "value";
const DOM_PROP_TEXT = "textContent";
const DOM_PROP_HTML = "innerHTML";

/**
 * Sets a value as directive
 * @param {Element} element
 * @param {String} key
 * @param {String} value
 */
const setDirective = (element, key, value) => element.setAttribute(DOM_ATTR_PREFIX + key, value);

/**
 * Checks a value as directive
 * @param {Element} element
 * @param {String} key
 * @returns {Boolean}
 */
const hasDirective = (element, key) => element.hasAttribute(DOM_ATTR_PREFIX + key);

/**
 * Removes a directive
 * @param {Element} element
 * @param {String} key
 */
const removeDirective = (element, key) => element.removeAttribute(DOM_ATTR_PREFIX + key);

/**
 * Checks if an attribute is an axon directive
 * @param {Attribute} attr
 * @returns {Boolean}
 */
const isDirective = attr => attr.name.startsWith(DOM_ATTR_PREFIX);

/**
 * Returns array of all directives
 * @param {Element} element
 * @returns {Array}
 */
const getDirectives = element => cloneArray(element.attributes).filter(isDirective);

/**
 * Checks if the element has any directives
 * @param {Element} element
 * @returns {Boolean}
 */
const hasDirectives = element => getDirectives(element).length>0;

/**
 * Returns directives on node with name parsed
 * @param {Element} element
 * @returns {Array}
 */
const parseDirectives = function (element) {
    return getDirectives(element).map(attr => {
        /**
         * 'x-bind:hidden="foo"' => nameFull=["bind","hidden"] val="foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);
        const val = attr.value;

        return {
            val,
            name: nameFull[0],
            opt: nameFull[1] || false,
        };
    });
};

/**
 * Recursively gets all subnodes
 * @param {AxonNode} node
 * @param {ElementList} children
 * @param {class} AxonNode
 * @returns {Array}
 */
const getSubNodes = function (node, children, AxonNode) {
    /**
     * Iterate over a single child DOM element
     * @param {Element} child
     * @returns {AxonNode|null}
     */
    const recurseSubNodes = function (child) {
        if (hasDirectives(child)) {
            //-> Recurse
            return new AxonNode(child, node, {});
        } else if (child.children.length > 0) {
            //-> Enter Children
            return mapSubNodes(child.children);
        } else {
            //-> Exit dead-end
            return null;
        }
    };
    /**
     * Maps and processes Array of children
     * @param {Array} children
     * @returns {Array}
     */
    const mapSubNodes = children => flattenArray(cloneArray(children).map(recurseSubNodes).filter(val => val !== null));

    return mapSubNodes(children);
};

const nodeProxy = {
    get: (target, key) => {
        if (key in target.data) {
            return target.data[key];
        } else {
            return target[key];
        }
    }
};

/**
 * addEventListener shorthand
 * @param {Element} node
 * @param {String} eventType
 * @param {Function} eventFn
 */
const bindEvent = function (element, eventType, eventFn) {
    element.addEventListener(eventType, eventFn, false);
};

//@TODO test those
const REGEX_IS_FUNCTION = /\(.*\)/;
const REGEX_IS_NUMBER = /^[\d\.]+$/;
const REGEX_IS_STRING = /^'\w+'$/;
const REGEX_CONTENT_METHOD = /([\w\.]+)\s*\(((?:[^()]*)*)?\s*\)/;

/**
 * Creates a new missing-prop error
 * @param {String} propName
 * @returns {Error}
 */
const missingPropErrorFactory = propName => new Error(`missing prop/method '${propName}'`);

/**
 * Runs a method in the given context
 * @param {Object} methodProp
 * @returns {Mixed}
 */
const applyMethodContext = methodProp => methodProp.val.apply(methodProp.node, methodProp.args);

/**
 * Parses expression args to "real" values
 *  @param {String} arg
 * @param {Node} node
 * @returns {Mixed}
 */
const mapArg = function (arg, node) {
    if (REGEX_IS_NUMBER.test(arg)) {
        return Number(arg);
    } else if (REGEX_IS_STRING.test(arg)) {
        return arg.substr(1, arg.length - 2);
    } else {
        return retrieveProp(arg, node);
    }
};

/**
 * Gets the topmost node
 * @param {Node} node
 * @returns {Node}
 */
const getNodeRoot = function (node) {
    let result = node;

    while (result._parent !== null) {
        result = result._parent;
    }

    return result;
};

/**
 * Finds a string-path as object property
 * @param {Object} obj
 * @param {String} path
 * @returns {Object|false}
 */
const findPath = function (obj, path) {
    const arr = path.split(".");
    let last = obj;
    let current;
    let index = 0;

    while (index < arr.length) {
        const currentPath = arr[index];

        current = last[currentPath];

        if (isDefined(current)) {
            if (index < arr.length - 1) {
                last = current;
            } else {
                return {
                    val: current,
                    con: last,
                    key: currentPath
                };
            }
        }

        index++;
    }

    return false;
};

/**
 * Redirects to fitting retriever and returns
 * @param {String} name
 * @param {Axon} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed}
 */
const retrieveExpression = function (name, node, allowUndefined = false) {
    if (REGEX_IS_FUNCTION.test(name)) {
        const method = retrieveMethod(name, node, allowUndefined);
        const methodResult = applyMethodContext(method);

        return {
            node: method.node,
            val: methodResult
        };
    } else {
        return retrieveProp(name, node, allowUndefined);
    }
};

/**
 * Retrieves a prop from the data container
 * @param {String} expression
 * @param {AxonNode} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed|false}
 */
const retrieveProp = function (expression, node, allowUndefined = false) {
    let current = node;

    while (current && current._parent !== false) {
        const data = findPath(current.data, expression);

        if (data !== false) {
            data.node = current;

            return data;
        } else {
            current = current._parent;
        }
    }

    if (allowUndefined) {
        return false;
    } else {
        throw missingPropErrorFactory(expression);
    }

};

/**
 * Retrieves a method from the method container
 * @param {String} expression
 * @param {AxonNode} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed|false}
 */
const retrieveMethod = function (expression, node, allowUndefined = false) {
    const matched = expression.match(REGEX_CONTENT_METHOD);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const _root = getNodeRoot(node);
    const data = findPath(_root.methods, matched[1]);

    if (data !== false) {
        data.args = args.map(arg => mapArg(arg, node));
        data.node = _root;

        return data;
    } else {
        if (allowUndefined) {
            return false;
        } else {
            throw missingPropErrorFactory(expression);
        }
    }
};

/**
 * Checks which type of content property an Element uses
 * @param {Element} element
 * @returns {String}
 */
const getElementContentProp = function (element) {
    if (isDefined(element[DOM_PROP_VALUE])) {
        return DOM_PROP_VALUE;
    } else if (isDefined(element[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    } else {
        return DOM_PROP_HTML;
    }
};

const DOM_EVENT_MODEL = "input";

const directiveModelInit = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const eventFn = function () {
        const targetProp = retrieveProp(directive.val, node);

        targetProp.con[targetProp.key] = element[elementContentProp];
        targetProp.node.render();
    };

    bindEvent(element, DOM_EVENT_MODEL, eventFn);

    return true;
};

const directiveModelRender = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const targetProp = retrieveProp(directive.val, node);

    element[elementContentProp] = String(targetProp.val);

    return true;
};

const directiveBindRender = function (directive, node) {
    node._element.setAttribute(directive.opt, retrieveExpression(directive.val, node).val);

    return true;
};

const DOM_DIR_DYN = "dyn";

const cleanDirectiveDyns = function (parent) {
    cloneArray(parent.children).forEach(child => {
        if (hasDirective(child, DOM_DIR_DYN)) {
            child.remove();
        }
    });
};

const directiveForRender = function (directive, node) {
    const directiveSplit = directive.val.split(" ");
    const iteratorKey = directiveSplit[0];
    const iterable = retrieveProp(directiveSplit[2], node).val;
    const nodesNew = [];
    const element = node._element;

    cleanDirectiveDyns(element.parentElement);

    for (let i of iterable) {
        const nodeI = Object.assign({}, node);

        nodeI[iteratorKey] = i;

        nodesNew.push(nodeI);
    }

    console.log({
        element,
        nodesNew,
    });

    nodesNew.forEach(nodeNew => {
        const elementNew = element.cloneNode();

        setDirective(elementNew, DOM_DIR_DYN, true);
        removeDirective(elementNew, "for");

        nodeNew._element = element.appendChild(elementNew);
    });

    //node._children = nodesNew;

    return true;
};

const directiveTextRender = function (directive, node) {
    node._element[DOM_PROP_TEXT] = retrieveExpression(directive.val, node).val;

    return true;
};

const directiveHTMLRender = function (directive, node) {
    node._element[DOM_PROP_HTML] = retrieveExpression(directive.val, node).val;

    return true;
};

const directiveIfBoth = function (directive, node) {
    const element = node._element;
    const expressionValue = retrieveExpression(directive.val, node, true).val;

    if (expressionValue) {
        element.removeAttribute(DOM_ATTR_HIDDEN);

        return true;
    } else {
        element.setAttribute(DOM_ATTR_HIDDEN, true);

        return false;
    }
};

const directiveOnInit = function (directive, node) {
    const methodProp = retrieveMethod(directive.val, node);

    bindEvent(node._element, directive.opt, () => applyMethodContext(methodProp));

    return true;
};

const directives = {
    "model": {
        init: directiveModelInit,
        render: directiveModelRender
    },
    "bind": {
        render: directiveBindRender
    },
    "for": {
        render: directiveForRender
    },
    "text": {
        render: directiveTextRender
    },
    "html": {
        render: directiveHTMLRender
    },
    "if": {
        init: directiveIfBoth,
        render: directiveIfBoth
    },
    "on": {
        init: directiveOnInit,
    },
};

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

        proxy.directives = parseDirectives(_element);

        return proxy;
    }
    /**
     * Runs directives on the node and all subnodes
     * @param {"init"|"render"} type
     * @returns {Array|false}
     */
    run(type) {
        const runDirective = directive => {
            const directivesDictEntry = directives[directive.name];

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

module.exports = AxonNodeRoot;
