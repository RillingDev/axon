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

const DOM_EVENT_MODEL = "input";

const DOM_PROP_VALUE = "value";
const DOM_PROP_TEXT = "textContent";
const DOM_PROP_HTML = "innerHTML";

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
            opt: nameFull[1] || false,
        };
    });
};

//@TODO

//import getNodeValueType from "./getNodeValueType";

const bindEvent = function (node, eventType, eventFn) {
    return node.addEventListener(eventType, eventFn, false);
};

const REGEX_IS_FUNCTION = /\(.*\)/;
const REGEX_CONTENT_METHOD = /([\w\.]+)\s*\(((?:[^()]+)*)?\s*\)\s*/;

const getNodeRoot = function (node) {
    let result = node;

    while (result._parent !== null) {
        result = result._parent;
    }

    return result;
};

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
                    set: val => last[currentPath] = val
                };
            }
        }

        index++;
    }

    return false;
};

const applyMethodContext = methodProp => methodProp.val.apply(methodProp.node.data, methodProp.args);

/**
 * Redirects to fitting retriever and returns
 * @param {String} name
 * @param {Axon} node
 * @returns {Mixed}
 */
const retrieveExpression = function (name, node) {
    if (REGEX_IS_FUNCTION.test(name)) {
        //Call method with context set to rootnode data
        return applyMethodContext(retrieveMethod(name, node));
    } else {
        return retrieveProp(name, node);
    }
};

/**
 * Retrieves a prop from the data container
 * @param {String} expression
 * @param {AxonNode} node
 * @returns {Mixed|false}
 */
const retrieveProp = function (expression, node) {
    let current = node;

    while (current._parent !== false) {
        const data = findPath(current.data, expression);

        if (data !== false) {
            data.node = current;

            return data;
        } else {
            current = current._parent;
        }
    }

    return false;
};

//@TODO
const retrieveMethod = function (expression, node) {
    const matched = expression.match(REGEX_CONTENT_METHOD);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const _root = getNodeRoot(node);
    const data = findPath(_root.methods, matched[1]);

    if (data !== false) {
        data.args = args;
        data.node = _root;

        return data;
    } else {
        return false;
    }
};

const getNodeContentProp = function (node) {
    if (isDefined(node[DOM_PROP_VALUE])) {
        return DOM_PROP_VALUE;
    } else if (isDefined(node[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    } else {
        return DOM_PROP_HTML;
    }
};

const directiveModelInit = function (directive, node) {
    const element = node._element;
    const elementContentProp = getNodeContentProp(element);
    const eventFn = function () {
        const targetProp = retrieveProp(directive.val, node);

        targetProp.set(element[elementContentProp]);
        targetProp.node.render();
    };

    bindEvent(element, DOM_EVENT_MODEL, eventFn);

    return true;
};

const directiveModelRender = function (directive, node) {
    const element = node._element;
    const elementContentProp = getNodeContentProp(element);
    const targetProp = retrieveProp(directive.val, node);

    element[elementContentProp] = String(targetProp.val);

    return true;
};

const directiveBindRender = function (directive, node) {
    node._element.setAttribute(directive.opt, retrieveExpression(directive.val, node).val);

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
    const expressionValue = retrieveExpression(directive.val, node).val;

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
     * @returns {Boolean}
     */
    run(type) {
        return this
            .directives
            .map(directive => {
                const directivesDictEntry = directives[directive.name];

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
    runDeep(type) {
        const result = this.run(type);

        if (result) {
            this
                ._children
                .forEach(child => {
                    child.run(type);
                });
        }

        return result;
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

module.exports = AxonNodeRoot;
