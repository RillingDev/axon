/**
 * Checks if the value has a certain type-string
 *
 * @function isTypeOf
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @param {string} type
 * @returns {boolean}
 * @example
 * // returns true
 * isTypeOf({}, "object")
 * isTypeOf([], "object")
 * isTypeOf("foo", "string")
 *
 * @example
 * // returns false
 * isTypeOf("foo", "number")
 */
const isTypeOf = (val, type) => typeof val === type;

/**
 * Checks if a value is an array
 *
 * `Array.isArray` shorthand
 *
 * @function isArray
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * isArray([]);
 * isArray([1, 2, 3]);
 *
 * @example
 * // returns false
 * isArray({});
 */
const isArray = Array.isArray;

/**
 * Checks if a value is undefined
 *
 * @function isUndefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns false
 * const a = {};
 *
 * isUndefined(a.b)
 * isUndefined(undefined)
 *
 * @example
 * // returns false
 * const a = {};
 *
 * isUndefined(1)
 * isUndefined(a)
 */
const isUndefined = (val) => isTypeOf(val, "undefined");

/**
 * Checks if a value is undefined or null
 *
 * @function isNil
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * isNil(null)
 * isNil(undefined)
 *
 * @example
 * // returns false
 * isNil(0)
 * isNil({})
 */
const isNil = (val) => isUndefined(val) || val === null;

/**
 * Checks if a value is an object
 *
 * @function isObject
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * isObject({})
 * isObject([])
 * isObject(() => 1))
 *
 * @example
 * // returns false
 * isObject(1)
 */
const isObject = (val) => !isNil(val) && (isTypeOf(val, "object") || isTypeOf(val, "function"));

/**
 * Checks if a target has a certain key
 *
 * @function hasKey
 * @memberof Has
 * @since 1.0.0
 * @param {any} target
 * @param {string} key
 * @returns {boolean}
 * @example
 * // returns true
 * hasKey([1, 2, 3], "0")
 * hasKey({foo: 0}, "foo")
 *
 * @example
 * // returns false
 * hasKey({}, "foo")
 * hasKey("foo", "replace")
 */
const hasKey = (target, key) => isObject(target) && key in target;

/**
 * Checks if a value is not undefined
 *
 * @function isDefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * const a = {};
 *
 * isDefined(1)
 * isDefined(a)
 *
 * @example
 * // returns false
 * const a = {};
 *
 * isDefined(a.b)
 * isDefined(undefined)
 */
const isDefined = (val) => !isUndefined(val);

/**
 * Returns an array of the objects entries
 *
 * `Object.entries` shorthand
 *
 * @function objEntries
 * @memberof Object
 * @since 1.0.0
 * @param {Object} obj
 * @returns {any[]} Array<[key: any, val: any]>]
 * @example
 * // returns [["a", 1], ["b", 2], ["c", 3]]
 * objEntries({a: 1, b: 2, c: 3})
 */
const objEntries = Object.entries;

/**
 * Iterates over each element in an array
 *
 * Wrapper around arr.forEach to have a cleaner API and better minified code
 *
 * @function forEach
 * @memberof For
 * @param {any[]} arr
 * @param {function} fn fn(val: any, index: number, arr: any[])
 * @example
 * // returns a = [0, 2, 6]
 * const a = [1, 2, 3];
 *
 * forEach(a, (val, index)=>a[index] = val * index)
 */
const forEach = (arr, fn) => arr.forEach(fn);

/**
 * Iterates over each entry of an object
 *
 * @function forEachEntry
 * @memberof For
 * @param {object} obj
 * @param {function} fn fn(val: any, key: any, index: number, arr: any[])
 * @example
 * // returns a = {a: 0, b: 2}
 * const a = {a: 1, b: 2};
 *
 * forEachEntry(a, (val, key, index) => a[key] = val * index)
 */
const forEachEntry = (obj, fn) => {
    forEach(objEntries(obj), (entry, index) => {
        fn(entry[1], entry[0], index, obj);
    });
};

/**
 * Recursively flattens an array
 *
 * @function arrFlattenDeep
 * @memberof Array
 * @since 1.0.0
 * @param {any[]} arr
 * @returns {any[]}
 * @example
 * // returns [1, 2, 3]
 * arrFlattenDeep([1, 2, [3]])
 *
 * @example
 * // returns [1, 2, 3, 5, 6, 6]
 * arrFlattenDeep([1, 2, [3, [[[5]]], [6, [6]]])
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
 * Creates a new array with the values of the input iterable
 *
 * `Array.from` shorthand
 *
 * @function arrFrom
 * @memberof Array
 * @since 1.0.0
 * @param {any} arr
 * @returns {any[]}
 * @example
 * // returns a = [1, 2, 3], b = [1, 10, 3]
 * const a = [1, 2, 3];
 * const b = arrFrom(a);
 *
 * b[1] = 10;
 */
const arrFrom = Array.from;

/**
 * Creates a new object with the entries of the input object
 *
 * @function objFrom
 * @memberof Object
 * @since 1.0.0
 * @param {object} obj
 * @returns {object}
 * @example
 * // returns a = {a: 4, b: 2}, b = {a: 10, b: 2}
 * const a = {a: 4, b: 2};
 * const b = objFrom(a);
 *
 * b.a = 10;
 */
const objFrom = (obj) => isArray(obj) ? arrFrom(obj) : Object.assign({}, obj);

/**
 * Creates a map from an object
 *
 * @function mapFromObject
 * @memberof Map
 * @since 1.0.0
 * @param {Object} obj
 * @returns {Map}
 * @example
 * // returns Map{a: 1, b: 4, c: 5}
 * mapFromObject({a: 1, b: 4, c: 5})
 */
const mapFromObject = (obj) => new Map(objEntries(obj));

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_DELIMITER = ":";
const DOM_ATTR_HIDDEN = "hidden";

const DOM_PROP_VALUE = "value";
const DOM_PROP_TEXT = "textContent";
const DOM_PROP_HTML = "innerHTML";

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
const getDirectives = element => arrFrom(element.attributes).filter(isDirective);

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
const parseDirectives = element => getDirectives(element)
    .map(attr => {
        /**
         * 'x-bind:hidden="foo"' => nameFull = ["bind", "hidden"], val = "foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);

        return {
            name: nameFull[0],
            opt: nameFull[1] || false,
            content: attr.value,
        };
    });

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
 * Recursively iterates over an object and attaches proxy on on all object-like props
 *
 * @private
 * @param {Object} obj
 * @param {Object} proxyObj
 * @returns {Proxy}
 */
const mapProxy = (obj, proxyObj) => {
    const result = obj;

    forEachEntry(result, (val, key) => {
        if (isObject(val)) {
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

const REGEX_IS_FUNCTION = /^.+\(.*\)$/;

/**
 * Does not work with nested function calls
 */
const REGEX_FUNCTION_CALL_CONTENT = /(.+)\s?\((.*)\)/;

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
    const pathArr = path
        .split(REGEX_PATH_SPLIT)
        .map(item => REGEX_IS_STRING_LITERAL.test(item) ? getStringLiteral(item) : item);
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

// Infinity/null/undefined are omitted because you usually wont need them
const mapLiteral = mapFromObject({
    "false": false,
    "true": true
});

/**
 * Handles not-found properties
 *
 * @private
 * @param {string} propName
 * @param {boolean} allowUndefined
 * @returns {false|void}
 */
const handleMissingProp = (propName, allowUndefined) => {
    if (!allowUndefined) {
        throw new Error(`missing prop/method '${propName}'`);
    } else {
        return false;
    }
};

/**
 * Runs a method in the given context
 *
 * @private
 * @param {Object} methodProp
 * @param {Array<any>} [additionalArgs=[]]
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

    if (!isNaN(Number(expression))) {
        result = Number(expression);
    } else if (REGEX_IS_STRING_LITERAL.test(expression)) {
        result = getStringLiteral(expression);
    } else if (mapLiteral.has(expression)) {
        result = mapLiteral.get(expression);
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
        }

        current = current.$parent;
    }

    return handleMissingProp(expression, allowUndefined);
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
    const matched = expression.match(REGEX_FUNCTION_CALL_CONTENT);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const root = getNodeRoot(node);
    const data = getPath$1(root.methods, matched[1], true);

    if (data !== null) {
        data.args = args.map(arg => evalLiteralFromNode(arg, node));
        data.node = root;

        return data;
    } else {
        return handleMissingProp(expression, allowUndefined);
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
 * @param {boolean} active
 */
const setElementActive = (element, active) => active ?
    element.removeAttribute(DOM_ATTR_HIDDEN) :
    element.setAttribute(DOM_ATTR_HIDDEN, true);

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
    forEach(arrFrom(element.parentElement.children), child => {
        if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
            child.remove();
        }
    });

    for (let i of iterable) {
        const nodeElement = element.cloneNode(true);
        const nodeData = objFrom(node.data);
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
    "if": {
        init: directiveIfBoth,
        render: directiveIfBoth
    },
    "on": {
        init: directiveOnInit,
    },
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
    "for": {
        init: directiveForInit,
        render: directiveForRender
    }
});

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
const mapSubNodes = (children, node) => arrFlattenDeep(arrFrom(children)
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
 * Axon Node
 *
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     *
     * @constructor
     * @param {Element} $element
     * @param {Element|null} $parent
     * @param {Object} [data={}]
     */
    constructor($element, $parent, data = {}) {
        const dataStorage = data;

        this.directives = parseDirectives($element);
        this.data = bindDeepDataProxy(dataStorage, this);

        this.$element = $element;
        this.$parent = $parent;
        this.$children = mapSubNodes($element.children, this);
    }
    /**
     * Runs directives on the node and all sub-nodes
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

                //Ignore non-existent directive types
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
const AxonNodeRoot$1 = class extends AxonNode {
    /**
     * Axon Root Constructor
     *
     * @constructor
     * @param {Object} [cfg={}] Config data for the Axon instance
     */
    constructor(cfg = {}) {
        super(cfg.el, null, cfg.data);

        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};

export default AxonNodeRoot$1;
