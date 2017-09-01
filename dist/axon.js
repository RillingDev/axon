var Axon = (function () {
'use strict';

/**
 * Create a new array with the same contents
 * @param {Array} arr
 * @returns {Array}
 */
const cloneArray = arr => Array.from(arr);

/**
 * Flatten Array Recursively
 * @param {Array} arr
 * @returns {Array}
 */
const flattenArray = function (arr) {
    const result = [];

    arr.forEach(item => {
        if (Array.isArray(item)) {
            result.push(...flattenArray(item));
        } else {
            result.push(item);
        }
    });

    return result;
};

/**
 * Checks if a value is not undefined
 * @param {Mixed} val
 * @returns {Boolean}
 */
const isDefined = val => typeof val !== "undefined";

/**
 * Creates a Map from an Object
 * @param {Object} obj
 * @returns {Map}
 */
const mapFromObject = obj => new Map(Object.entries(obj));

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
const hasDirectives = element => getDirectives(element).length > 0;

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

        return {
            _content: attr.value,
            _name: nameFull[0],
            _opt: nameFull[1] || false,
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

/**
 * Handles node->node.data redirects
 */
const nodeProxy = {
    /**
     * Redirects prop lookup
     * @param {Object} target
     * @param {String} key
     * @returns {Mixed}
     */
    get: (target, key) => {
        if (key in target.data) {
            return target.data[key];
        } else {
            return target[key];
        }
    },
    /**
     * Redirect setting to data
     * @param {Object} target
     * @param {String} key
     * @param {Mixed} val
     * @returns {Boolean}
     */
    set: (target, key, val) => {
        if (!(key in target)) {
            target.data[key] = val;
        } else {
            target[key] = val;
        }

        return true;
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
const REGEX_IS_NUMBER = /^[\d.-]+$/;
const REGEX_IS_STRING = /^["'`].*["'`]$/;
const REGEX_IS_FUNCTION = /^.+\(.*\)$/;
const REGEX_CONTENT_METHOD = /([\w.]+)\s*\(((?:[^()]*)*)?\s*\)/;

const mapLiterals = mapFromObject({
    "false": false,
    "true": true,
    "null": null
});

/**
 * Parses Literal String
 * @param {String} expression
 * @param {AxonNode} node
 * @returns {Mixed}
 */
const parseLiteral = function (expression, node) {
    if (REGEX_IS_NUMBER.test(expression)) {
        //Cast to number
        return Number(expression);
    } else if (REGEX_IS_STRING.test(expression)) {
        //Cut of quotes
        return expression.substr(1, expression.length - 2);
    } else if (mapLiterals.has(expression)) {
        return mapLiterals.get(expression);
    } else {
        return retrieveProp(expression, node)._val;
    }
};

/**
 * Finds a string-path as object property
 * @param {Object} obj
 * @param {String} path
 * @returns {Object|false}
 */
const findPath = function (obj, path) {
    const keys = path.split(".");
    let last = obj;
    let current;
    let index = 0;

    while (index < keys.length) {
        current = last[keys[index]];

        if (isDefined(current)) {
            if (index < keys.length - 1) {
                last = current;
            } else {
                return {
                    _val: current,
                    _container: last,
                    _key: keys[index]
                };
            }
        }

        index++;
    }

    return false;
};

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
const applyMethodContext = methodProp => methodProp._val.apply(methodProp._node, methodProp._args);

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
            _node: method.node,
            _val: methodResult
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
            data._node = current;

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
        data._args = args.map(arg => parseLiteral(arg, node));
        data._node = _root;

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

const setElementActive = (element, mode) => mode ? element.removeAttribute(DOM_ATTR_HIDDEN) : element.setAttribute(DOM_ATTR_HIDDEN, true);

const DOM_EVENT_MODEL = "input";

const directiveModelInit = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const eventFn = function () {
        const targetProp = retrieveProp(directive._content, node);

        targetProp._container[targetProp._key] = element[elementContentProp];
        targetProp._node.render();
    };

    bindEvent(element, DOM_EVENT_MODEL, eventFn);

    return true;
};

const directiveModelRender = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const targetProp = retrieveProp(directive._content, node);

    element[elementContentProp] = String(targetProp._val);

    return true;
};

const directiveBindRender = function (directive, node) {
    node._element.setAttribute(directive._opt, retrieveExpression(directive._content, node)._val);

    return true;
};

const DOM_DIR_FOR_BASE = "forbase";
const DOM_DIR_FOR_DYNAMIC = "dyn";
const FOR_REGEX_ARR = /(\w+) in (\w+)/;
//const FOR_REGEX_OBJ = /\((\w+),(\w+)\) in (\w+)/;

const directiveForInit = function (directive, node) {
    const element = node._element;

    setDirective(node._element, DOM_DIR_FOR_BASE, true);
    setElementActive(element, false);

    return false;
};

const directiveForRender = function (directive, node, AxonNode) {
    const element = node._element;
    const directiveSplit = FOR_REGEX_ARR.exec(directive._content);
    const iteratorKey = directiveSplit[1];
    const iterable = retrieveProp(directiveSplit[2], node)._val;
    const nodesNew = [];

    //Delete old nodes
    cloneArray(element.parentElement.children).forEach(child => {
        if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
            child.remove();
        }
    });

    for (let i of iterable) {
        const nodeElement = element.cloneNode(true);
        const nodeData = Object.assign({}, node.data);
        let elementInserted;

        setDirective(nodeElement, DOM_DIR_FOR_DYNAMIC, true);
        removeDirective(nodeElement, DOM_DIR_FOR_BASE);
        removeDirective(nodeElement, "for");
        setElementActive(nodeElement, true);

        nodeData[iteratorKey] = i;
        elementInserted = element.insertAdjacentElement("beforebegin", nodeElement);

        nodesNew.push(new AxonNode(elementInserted, node._parent, nodeData));
    }

    node._children = nodesNew;

    return true;
};

const directiveTextRender = function (directive, node) {
    node._element[DOM_PROP_TEXT] = String(retrieveExpression(directive._content, node)._val);

    return true;
};

const directiveHTMLRender = function (directive, node) {
    node._element[DOM_PROP_HTML] = String(retrieveExpression(directive._content, node)._val);

    return true;
};

const directiveIfBoth = function (directive, node) {
    const element = node._element;
    const expressionValue = Boolean(retrieveExpression(directive._content, node, true)._val);

    setElementActive(element,expressionValue);

    return expressionValue;
};

const directiveOnInit = function (directive, node) {
    bindEvent(node._element, directive._opt, () => applyMethodContext(retrieveMethod(directive._content, node)));

    return true;
};

const directives = mapFromObject({
    "model": {
        _init: directiveModelInit,
        _render: directiveModelRender
    },
    "bind": {
        _render: directiveBindRender
    },
    "for": {
        _init: directiveForInit,
        _render: directiveForRender
    },
    "text": {
        _render: directiveTextRender
    },
    "html": {
        _render: directiveHTMLRender
    },
    "if": {
        _init: directiveIfBoth,
        _render: directiveIfBoth
    },
    "on": {
        _init: directiveOnInit,
    },
});

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
         * The root-node requires the direct access to the node as well as the proxy
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
            if (directives.has(directive._name)) {
                const mapDirectivesEntry = directives.get(directive._name);

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

return AxonNodeRoot;

}());
