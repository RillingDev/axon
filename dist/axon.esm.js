"use strict";

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_DELIMITER = ":";
const DOM_ATTR_HIDDEN = "hidden";

const DOM_PROP_VALUE = "value";
const DOM_PROP_TEXT = "textContent";
const DOM_PROP_HTML = "innerHTML";

/**
 * Checks if a value is an array
 *
 * @param {*} val
 * @returns {boolean}
 */
const isArray = (val) => Array.isArray(val);

/**
 * Checks if the value is typeof the typestring
 *
 * @param {*} val
 * @param {string} type
 * @returns {boolean}
 */
const isTypeOf = (val, type) => typeof val === type;

/**
 * Checks if a value is undefined
 *
 * @param {*} val
 * @returns {boolean}
 */
const isUndefined = (val) => isTypeOf(val, "undefined");

/**
 * Checks if a value is not undefined
 *
 * @param {*} val
 * @returns {boolean}
 */
const isDefined = (val) => !isUndefined(val);

/**
 * Checks if a value is either undefined or null
 *
 * @param {*} val
 * @returns {boolean}
 */
const isNil = (val) => isUndefined(val) || val === null;

/**
 * Checks if a value is not nil and has a typeof object
 *
 * @param {*} val
 * @returns {boolean}
 */
const isObjectLike = (val) => !isNil(val) && isTypeOf(val, "object");

/**
 * Returns an array of the objects entries
 *
 * @param {Object} obj
 * @returns {Entry[]}
 */
const objEntries = (obj) => Object.entries(obj);

/**
 * Iterate over each value of an array
 *
 * @param {any[]} arr
 * @param {ForEachIterator} fn
 */
const forEach = (arr, fn) => arr.forEach(fn);

/**
 * Iterate over each entry of an object
 *
 * @param {object} obj
 * @param {ForEachEntryIterator} fn
 */
const forEachEntry = (obj, fn) => {
    forEach(objEntries(obj), (entry, index) => {
        fn(entry[1], entry[0], index, obj);
    });
};

/**
 * Checks if a target has a certain key
 *
 * @param {any} target
 * @param {string} key
 * @returns {boolean}
 */
const hasKey = (target, key) => isDefined(target[key]);

/**
 * Checks if a value is a number as a string
 *
 * @param {*} val
 * @returns {boolean}
 */
const isStringNumber = (val) => !isNaN(Number(val));

/**
 * Creates a new array with the values of the input array
 *
 * @param {any[]} arr
 * @returns {any[]}
 */
const arrClone = (arr) => Array.from(arr);

/**
 * Recursively flattens an array
 *
 * @param {any[]} arr
 * @returns {any[]}
 */
const arrFlattenDeep = (arr) => {
    const result = [];
    forEach(arr, (val) => {
        if (isArray(val)) {
            result.push(...arrFlattenDeep(val));
        }
        else {
            result.push(val);
        }
    });
    return result;
};

/**
 * Creates a new object with the entries of the input object
 *
 * @param {object} obj
 * @returns {object}
 */
const objClone = (obj) => Object.assign({}, obj);

/**
 * Creates a Map from an Object
 * @param {Object} obj
 * @returns {Map}
 */
const mapFromObject = (obj) => new Map(objEntries(obj));

/**
 * Sets a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @param {string} value
 */
const setDirective = (element, key, value) => element.setAttribute(DOM_ATTR_PREFIX + key, value);

/**
 * Checks a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @returns {boolean}
 */
const hasDirective = (element, key) => element.hasAttribute(DOM_ATTR_PREFIX + key);

/**
 * Removes a directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 */
const removeDirective = (element, key) => element.removeAttribute(DOM_ATTR_PREFIX + key);

/**
 * Checks if an attribute is an axon directive
 *
 * @private
 * @param {Attribute} attr
 * @returns {boolean}
 */
const isDirective = attr => attr.name.startsWith(DOM_ATTR_PREFIX);

/**
 * Returns array of all directives
 *
 * @private
 * @param {Element} element
 * @returns {Array<Directive>}
 */
const getDirectives = element => arrClone(element.attributes).filter(isDirective);

/**
 * Checks if the element has any directives
 *
 * @private
 * @param {Element} element
 * @returns {boolean}
 */
const hasDirectives = element => getDirectives(element).length > 0;

/**
 * Returns directives on node with name parsed
 *
 * @private
 * @param {Element} element
 * @returns {Array<Object>}
 */
const parseDirectives = element => {
    return getDirectives(element).map(attr => {
        /**
         * 'x-bind:hidden="foo"' => nameFull=["bind","hidden"] val="foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);

        return {
            name: nameFull[0],
            opt: nameFull[1] || false,
            content: attr.value,
        };
    });
};

/**
 * Gets the topmost node
 *
 * @private
 * @param {AxonNode} node
 * @returns {AxonNode}
 */
const getNodeRoot = node => {
    let result = node;

    while (result.$parent !== null) {
        result = result.$parent;
    }

    return result;
};

/**
 * Maps and processes Array of element children
 *
 * @private
 * @param {NodeList} children
 * @param {AxonNode} node
 * @returns {Array<Object>}
 */
const mapSubNodes = (children, node) => arrFlattenDeep(arrClone(children)
    .map(child => {
        if (hasDirectives(child)) {
            //-> Recurse
            return new AxonNode(child, node);
        } else if (child.children.length > 0) {
            //-> Enter Children
            return mapSubNodes(child.children, node);
        } else {
            //-> Exit dead-end
            return null;
        }
    })
    .filter(val => val !== null));

/**
 * Creates a Proxy object with the node render method bound
 *
 * @private
 * @param {AxonNode} node
 * @returns {Object}
 */
const dataProxyFactory = node => {
    return {
        set: (target, key, val) => {
            if (val !== target[key]) {
                target[key] = val;

                node.render();
            }

            return true;
        }
    };
};

/**
 * Recursively iterates over an object and attaches proxy on on all obvject-like props
 *
 * @private
 * @param {Object} obj
 * @param {Object} proxyObj
 * @returns {Proxy}
 */
const mapProxy = (obj, proxyObj) => {
    const result = obj;

    forEachEntry(result, (val, key) => {
        if (isObjectLike(val)) {
            result[key] = mapProxy(val, proxyObj);
        }
    });

    return new Proxy(obj, proxyObj);
};

/**
 * Binds data-proxy
 *
 * @private
 * @param {Object} obj
 * @param {AxonNode} node
 * @returns {Proxy}
 */
const bindDeepDataProxy = (obj, node) => mapProxy(obj, dataProxyFactory(node));

/**
 * addEventListener shorthand
 *
 * @private
 * @param {Element} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
const bindEvent = (element, eventType, eventFn) => element.addEventListener(eventType, eventFn);

const REGEX_IS_STRING_LITERAL = /^["'`].*["'`]$/;

const REGEX_PATH_SPLIT = /(?:\.|\[|\])+/g;

/**
 * Returns a string literal as "normal" string
 *
 * @param {string} str
 * @param {string}
 */
const getStringLiteral = str => str.substr(1, str.length - 2);

/**
 * Accesses a target by a path of keys. If the path doesn't exist, null is returned
 *
 * @param {any} target
 * @param {string} path
 * @param {boolean} [getContaining=false]
 * @returns {boolean}
 */
const getPath$1 = (target, path, getContaining = false) => {
    const pathArr = path.split(REGEX_PATH_SPLIT).map(item => REGEX_IS_STRING_LITERAL.test(item) ? getStringLiteral(item) : item);
    let targetCurrent = target;
    let targetLast = null;
    let keyCurrent = null;
    let index = 0;

    while (!isNil(targetCurrent) && index < pathArr.length) {
        keyCurrent = pathArr[index];

        if (hasKey(targetCurrent, keyCurrent)) {
            targetLast = targetCurrent;
            targetCurrent = targetCurrent[keyCurrent];
            index++;
        } else {
            return null;
        }
    }

    return getContaining ? {
        val: targetCurrent,
        container: targetLast,
        key: keyCurrent,
        index
    } : targetCurrent;
};

const REGEX_IS_FUNCTION = /^.+\(.*\)$/;
const REGEX_CONTENT_METHOD = /([\w.]+)\s*\(((?:[^()]*)*)?\s*\)/;

const mapLiterals = mapFromObject({
    "false": false,
    "true": true
});

/**
 * Creates a new missing-prop error
 *
 * @private
 * @param {string} propName
 * @returns {Error}
 */
const missingPropErrorTextFactory = propName => `missing prop/method '${propName}'`;

/**
 * Runs a method in the given context
 *
 * @private
 * @param {Object} methodProp
 * @returns {any}
 */
const applyMethodContext = (methodProp, additionalArgs = []) => methodProp.val.apply(
    methodProp.node.data, [...methodProp.args, ...additionalArgs]
);

/**
 * Parses Literal String
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @returns {any}
 */
const evalLiteralFromNode = (expression, node) => {
    let result = null;

    if (isStringNumber(expression)) {
        result = Number(expression);
    } else if (REGEX_IS_STRING_LITERAL.test(expression)) {
        result = getStringLiteral(expression);
    } else if (mapLiterals.has(expression)) {
        result = mapLiterals.get(expression);
    } else {
        result = evalProp(expression, node).val;
    }

    return result;
};

/**
 * Redirects to fitting retriever and returns
 *
 * @private
 * @param {string} name
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any}
 */
const evalDirective = (name, node, allowUndefined = false) => {
    if (REGEX_IS_FUNCTION.test(name)) {
        const method = evalMethod(name, node, allowUndefined);
        const methodResult = applyMethodContext(method);

        return {
            node: method.node,
            val: methodResult
        };
    } else {
        return evalProp(name, node, allowUndefined);
    }
};

/**
 * Retrieves a prop from the data container
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any|null}
 */
const evalProp = (expression, node, allowUndefined = false) => {
    let current = node;

    while (current) {
        const data = getPath$1(current.data, expression, true);

        if (data !== null) {
            data.node = current;

            return data;
        } else {
            current = current.$parent;
        }
    }

    if (allowUndefined) {
        return null;
    } else {
        throw new Error(missingPropErrorTextFactory(expression));
    }
};

/**
 * Retrieves a method from the method container
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any|null}
 */
const evalMethod = (expression, node, allowUndefined = false) => {
    const matched = expression.match(REGEX_CONTENT_METHOD);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const root = getNodeRoot(node);
    const data = getPath$1(root.methods, matched[1], true);

    if (data !== null) {
        data.args = args.map(arg => evalLiteralFromNode(arg, node));
        data.node = root;

        return data;
    }

    if (allowUndefined) {
        return null;
    } else {
        throw new Error(missingPropErrorTextFactory(expression));
    }
};

/**
 * Checks which type of content property an Element uses
 *
 * @private
 * @param {Element} element
 * @returns {string}
 */
const getElementContentProp = element => {
    if (isDefined(element[DOM_PROP_VALUE])) {
        return DOM_PROP_VALUE;
    } else if (isDefined(element[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    } else {
        return DOM_PROP_HTML;
    }
};

/**
 * Toggles element active mode
 *
 * @private
 * @param {Element} element
 * @param {boolean} mode
 */
const setElementActive = (element, mode) => mode ? element.removeAttribute(DOM_ATTR_HIDDEN) : element.setAttribute(DOM_ATTR_HIDDEN, true);

const DOM_EVENT_MODEL = "input";

/**
 * v-model init directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveModelInit = function (directive, node) {
    const element = node.$element;
    const elementContentProp = getElementContentProp(element);

    bindEvent(element, DOM_EVENT_MODEL, () => {
        const targetProp = evalProp(directive.content, node);

        targetProp.container[targetProp.key] = element[elementContentProp];
    });

    return true;
};

/**
 * v-model render directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveModelRender = function (directive, node) {
    const element = node.$element;
    const elementContentProp = getElementContentProp(element);
    const targetProp = evalProp(directive.content, node);

    element[elementContentProp] = targetProp.val;

    return true;
};

/**
 * v-bind render directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveBindRender = (directive, node) => {
    node.$element.setAttribute(directive.opt, evalDirective(directive.content, node).val);

    return true;
};

const DOM_DIR_FOR_BASE = "forbase";
const DOM_DIR_FOR_DYNAMIC = "dyn";
const FOR_REGEX_ARR = /(.+) of (.+)/;

/**
 * v-for init directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveForInit = function (directive, node) {
    const element = node.$element;

    setDirective(node.$element, DOM_DIR_FOR_BASE, true);
    setElementActive(element, false);

    return false;
};

/**
 * v-for render directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveForRender = function (directive, node) {
    const element = node.$element;
    const directiveSplit = directive.content.match(FOR_REGEX_ARR);
    const iteratorKey = directiveSplit[1];
    const iterable = evalProp(directiveSplit[2], node).val;

    node.$children = [];

    //Delete old nodes
    forEach(arrClone(element.parentElement.children), child => {
        if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
            child.remove();
        }
    });

    for (let i of iterable) {
        const nodeElement = element.cloneNode(true);
        const nodeData = objClone(node.data);
        let elementInserted;
        let nodeNew;

        setDirective(nodeElement, DOM_DIR_FOR_DYNAMIC, true);
        removeDirective(nodeElement, DOM_DIR_FOR_BASE);
        removeDirective(nodeElement, "for");
        setElementActive(nodeElement, true);

        nodeData[iteratorKey] = i;
        elementInserted = element.insertAdjacentElement("beforebegin", nodeElement);

        //creates AxonNode for the new element and adds to node children
        nodeNew = new AxonNode(elementInserted, node.$parent, nodeData);
        node.$children.push(nodeNew);
        nodeNew.init();
    }

    return true;
};

/**
 * v-text render directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveTextRender = function (directive, node) {
    node.$element[DOM_PROP_TEXT] = String(evalDirective(directive.content, node).val);

    return true;
};

/**
 * v-html render directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveHTMLRender = function (directive, node) {
    node.$element[DOM_PROP_HTML] = String(evalDirective(directive.content, node).val);

    return true;
};

/**
 * v-if directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveIfBoth = function (directive, node) {
    const element = node.$element;
    const expressionValue = Boolean(evalDirective(directive.content, node, true).val);

    setElementActive(element, expressionValue);

    return expressionValue;
};

/**
 * v-on init directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveOnInit = function (directive, node) {
    bindEvent(node.$element, directive.opt, e => applyMethodContext(evalMethod(directive.content, node), [e]));

    return true;
};

const directives = mapFromObject({
    if: {
        init: directiveIfBoth,
        render: directiveIfBoth
    },
    on: {
        init: directiveOnInit,
    },
    model: {
        init: directiveModelInit,
        render: directiveModelRender
    },
    bind: {
        render: directiveBindRender
    },
    text: {
        render: directiveTextRender
    },
    html: {
        render: directiveHTMLRender
    },
    for: {
        init: directiveForInit,
        render: directiveForRender
    }
});

/**
 * Axon Node
 *
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     *
     * @constructor
     * @param {Element} [$element=null]
     * @param {Element} [$parent=null]
     * @param {Object} [data={}]
     */
    constructor($element = null, $parent = null, data = {}) {
        const dataStorage = data;

        this.directives = parseDirectives($element);
        this.data = bindDeepDataProxy(dataStorage, this);

        this.$element = $element;
        this.$parent = $parent;
        this.$children = mapSubNodes($element.children, this);
    }
    /**
     * Runs directives on the node and all subnodes
     *
     * @param {"init"|"render"} type
     * @returns {Array|false}
     */
    run(type) {
        const directiveResults = this.directives
            .map(directive => {
                if (directives.has(directive.name)) {
                    const mapDirectivesEntry = directives.get(directive.name);

                    if (mapDirectivesEntry[type]) {
                        return mapDirectivesEntry[type](directive, this);
                    }
                }

                //Ignore non-existant directive types
                return true;
            });

        //Recurse if all directives return true
        if (directiveResults.every(directiveResult => directiveResult === true)) {
            return this.$children.map(child => child.run(type));
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
 *
 * @class
 */
const AxonNodeRoot = class extends AxonNode {
    /**
     * Axon Root Constructor
     *
     * @constructor
     * @param {Object} cfg Config data for the Axon instance
     */
    constructor(cfg = {}) {
        super(cfg.el, null, cfg.data);

        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};

export default AxonNodeRoot;
