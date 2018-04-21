'use strict';

/**
 * Checks if the value has a certain type-string.
 *
 * @function isTypeOf
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @param {string} type
 * @returns {boolean}
 * @example
 * isTypeOf({}, "object")
 * // => true
 *
 * isTypeOf([], "object")
 * // => true
 *
 * isTypeOf("foo", "string")
 * // => true
 *
 * @example
 * isTypeOf("foo", "number")
 * // => false
 */
const isTypeOf = (val, type) => typeof val === type;

/**
 * Checks if a value is an array.
 *
 * `Array.isArray` shorthand.
 *
 * @function isArray
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * isArray([]);
 * // => true
 *
 * isArray([1, 2, 3]);
 * // => true
 *
 * @example
 * isArray({});
 * // => false
 */
const isArray = Array.isArray;

/**
 * Checks if a value is undefined.
 *
 * @function isUndefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * const a = {};
 *
 * isUndefined(a.b)
 * // => true
 *
 * isUndefined(undefined)
 * // => true
 *
 * @example
 * const a = {};
 *
 * isUndefined(1)
 * // => false
 *
 * isUndefined(a)
 * // => false
 */
const isUndefined = (val) => isTypeOf(val, "undefined");

/**
 * Checks if a value is undefined or null.
 *
 * @function isNil
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * isNil(null)
 * // => true
 *
 * isNil(undefined)
 * // => true
 *
 * @example
 * isNil(0)
 * // => false
 *
 * isNil("")
 * // => false
 */
const isNil = (val) => isUndefined(val) || val === null;

/**
 * Iterates over each entry of an object
 *
 * @function forEachEntry
 * @memberof For
 * @param {object} obj
 * @param {function} fn fn(key: any, val: any, index: number, arr: any[])
 * @example
 * const a = {a: 1, b: 2};
 *
 * forEachEntry(a, (key, val, index) => a[key] = val * index)
 * // a = {a: 0, b: 2}
 */
const forEachEntry = (obj, fn) => {
    Object.entries(obj).forEach((entry, index) => {
        fn(entry[0], entry[1], index, obj);
    });
};

/**
 * Checks if a value is an object.
 *
 * @function isObject
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * isObject({})
 * // => true
 *
 * isObject([])
 * // => true
 *
 * isObject(() => 1))
 * // => true
 *
 * @example
 * isObject(1)
 * // => false
 */
const isObject = (val) => !isNil(val) && (isTypeOf(val, "object") || isTypeOf(val, "function"));

/**
 * Recursively flattens an array.
 *
 * @function arrFlattenDeep
 * @memberof Array
 * @since 1.0.0
 * @param {any[]} arr
 * @returns {any[]}
 * @example
 * arrFlattenDeep([1, 2, [3]])
 * // => [1, 2, 3]
 *
 * arrFlattenDeep([1, 2, [3, [[[5]]], [6, [6]]])
 * // => [1, 2, 3, 5, 6, 6]
 */
const arrFlattenDeep = (arr) => {
    const result = [];
    arr.forEach(val => {
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
 * Creates a new object with the entries of the input object.
 *
 * @function objFrom
 * @memberof Object
 * @since 1.0.0
 * @param {Object} obj
 * @returns {Object}
 * @example
 * const a = {a: 4, b: 2};
 * const b = objFrom(a);
 *
 * b.a = 10;
 * // a = {a: 4, b: 2}
 * // b = {a: 10, b: 2}
 */
const objFrom = (obj) => Object.assign({}, obj);

/**
 * Creates a map from an object.
 *
 * @function mapFromObject
 * @memberof Map
 * @since 1.0.0
 * @param {Object} obj
 * @returns {Map}
 * @example
 * mapFromObject({a: 1, b: 4, c: 5})
 * // => Map<string,number>{a: 1, b: 4, c: 5}
 */
const mapFromObject = (obj) => new Map(Object.entries(obj));

/**
 * Map for comparison checks
 *
 * @private
 * @memberof EvalMap
 */
const mapComparison = mapFromObject({
    "===": (a, b) => a === b,
    "!==": (a, b) => a !== b,
    "&&": (a, b) => a && b,
    "||": (a, b) => a || b,
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b
});

/**
 * Returns a string literal as "normal" string
 *
 * @function getStringLiteral
 * @memberof Get
 * @param {string} str
 * @returns {string}
 */
const getStringLiteral = (str) => str.substr(1, str.length - 2);

/**
 * Map for literal checks.
 *
 * undefined and NaN are omitted because you usually wont need those
 *
 * @private
 * @memberof EvalMap
 */
const mapLiteral = mapFromObject({
    false: false,
    true: true,
    null: null
});

/**
 * Regex checking for string literals
 *
 * @private
 * @memberof EvalRegex
 */
const REGEX_IS_STRING_LITERAL = /^["'`].*["'`]$/;

/**
 * Regex for splitting paths
 *
 * @private
 * @memberof EvalRegex
 */
const REGEX_PATH_SPLIT = /(?:\.|\[|\])+/g;

/**
 * Accesses a target by a path of keys. If the path doesn't exist, null is returned
 *
 * @function getPathFull
 * @memberof Get
 * @param {any} target
 * @param {string} path
 * @param {boolean} [getContaining=false]
 * @returns {any|null}
 */
const getPathFull = (target, path, getContaining = false) => {
    const pathArr = path
        .split(REGEX_PATH_SPLIT)
        .map((item) => REGEX_IS_STRING_LITERAL.test(item)
        ? getStringLiteral(item)
        : item);
    let targetCurrent = target;
    let targetLast = null;
    let key = null;
    let index = 0;
    while (!isNil(targetCurrent) && index < pathArr.length) {
        key = pathArr[index];
        if (!isUndefined(targetCurrent[key])) {
            targetLast = targetCurrent;
            targetCurrent = targetCurrent[key];
            index++;
        }
        else {
            return null;
        }
    }
    if (getContaining) {
        return {
            index,
            key,
            val: targetCurrent,
            container: targetLast
        };
    }
    return targetCurrent;
};

/**
 * Map for math checks.
 *
 * @private
 * @memberof EvalMap
 */
const mapMath = mapFromObject({
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
    "**": (a, b) => a ** b
});

/**
 * Regex for function call args
 *
 * @private
 * @memberof EvalRegex
 */
const REGEX_GET_FUNCTION_CALL_ARGS = /(.+)\s?\((.*)\)/;

/**
 * Regex checking for function calls
 *
 * @private
 * @memberof EvalRegex
 */
const REGEX_IS_FUNCTION_CALL = /^.+\(.*\)$/;

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
    }
    else {
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
const applyMethodContext = (methodProp, additionalArgs = []) => methodProp.val.apply(methodProp.node.data, [
    ...methodProp.args,
    ...additionalArgs
]);
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
    }
    else if (REGEX_IS_STRING_LITERAL.test(expression)) {
        result = getStringLiteral(expression);
    }
    else if (mapLiteral.has(expression)) {
        result = mapLiteral.get(expression);
    }
    else {
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
    if (REGEX_IS_FUNCTION_CALL.test(name)) {
        const method = evalMethod(name, node, allowUndefined);
        const methodResult = applyMethodContext(method);
        return {
            node: method.node,
            val: methodResult
        };
    }
    return evalProp(name, node, allowUndefined);
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
        const data = getPathFull(current.data, expression, true);
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
    const matched = expression.match(REGEX_GET_FUNCTION_CALL_ARGS);
    const args = !isUndefined(matched[2]) ? matched[2].split(",") : [];
    const data = getPathFull(node.$app.methods, matched[1], true);
    if (data !== null) {
        data.args = args.map((arg) => evalLiteralFromNode(arg, node));
        data.node = node.$app.$entry;
        return data;
    }
    return handleMissingProp(expression, allowUndefined);
};

/**
 * v-bind render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveBindRender = (directive, element, node) => {
    element.setAttribute(directive.opt, evalDirective(directive.content, node).val);
    return true;
};

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_DELIMITER = ":";
const DOM_ATTR_HIDDEN = "hidden";
const DOM_PROP_CHECKED = "checked";
const DOM_PROP_VALUE = "value";
const DOM_PROP_TEXT = "textContent";
const DOM_PROP_HTML = "innerHTML";

/**
 * Sets a value as directive
 *
 * @private
 * @param {HTMLElement} element
 * @param {string} key
 * @param {string} value
 */
const setDirective = (element, key, value) => element.setAttribute(DOM_ATTR_PREFIX + key, value);
/**
 * Checks a value as directive
 *
 * @private
 * @param {HTMLElement} element
 * @param {string} key
 * @returns {boolean}
 */
const hasDirective = (element, key) => element.hasAttribute(DOM_ATTR_PREFIX + key);
/**
 * Removes a directive
 *
 * @private
 * @param {HTMLElement} element
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
const isDirective = (attr) => attr.name.startsWith(DOM_ATTR_PREFIX);
/**
 * Returns array of all directives
 *
 * @private
 * @param {HTMLElement} element
 * @returns {Array<Directive>}
 */
const getDirectives = (element) => Array.from(element.attributes).filter(isDirective);
/**
 * Checks if the element has any directives
 *
 * @private
 * @param {HTMLElement} element
 * @returns {boolean}
 */
const hasDirectives = (element) => getDirectives(element).length > 0;
/**
 * Returns directives on node with name parsed
 *
 * @private
 * @param {HTMLElement} element
 * @returns {Array<Object>}
 */
const parseDirectives = (element) => getDirectives(element).map((attr) => {
    /**
     * 'x-bind:hidden="foo"' => nameFull = ["bind", "hidden"], val = "foo"
     */
    const nameFull = attr.name
        .replace(DOM_ATTR_PREFIX, "")
        .split(DOM_ATTR_DELIMITER);
    return {
        name: nameFull[0],
        opt: nameFull[1] || "",
        content: attr.value
    };
});

/**
 * addEventListener shorthand
 *
 * @private
 * @param {HTMLElement} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
const bindEvent = (element, eventType, eventFn) => element.addEventListener(eventType, eventFn);
/**
 * Checks if an element is a checkbox or a radio
 *
 * @private
 * @param {HTMLElement} element
 * @returns {boolean}
 */
const isCheckboxLike = (element) => element.type === "checkbox" ||
    element.type === "radio";
/**
 * Detects wether an input element uses the input ot change event.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/Events/input
 *
 * @private
 * @param {HTMLElement} element
 * @returns {string}
 */
const getInputEventType = (element) => isCheckboxLike(element) ? "change" : "input";
/**
 * Checks which type of content property an Element uses
 *
 * @private
 * @param {HTMLElement} element
 * @returns {string}
 */
const getElementContentProp = (element) => {
    if (!isUndefined(element[DOM_PROP_VALUE])) {
        return isCheckboxLike(element) ? DOM_PROP_CHECKED : DOM_PROP_VALUE;
    }
    else if (!isUndefined(element[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    }
    return DOM_PROP_HTML;
};
/**
 * Toggles element active mode
 *
 * @private
 * @param {HTMLElement} element
 * @param {boolean} active
 */
const setElementActive = (element, active) => active
    ? element.removeAttribute(DOM_ATTR_HIDDEN)
    : element.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);

/**
 * Creates a Proxy object with the node render method bound
 *
 * @private
 * @param {AxonNode} node
 * @returns {Object}
 */
const dataProxyFactory = (node) => {
    return {
        set: (target, key, val) => {
            if (val !== target[key]) {
                target[key] = val;
                node.run(1 /* render */);
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
    forEachEntry(result, (key, val) => {
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
 * Maps and processes Array of element children
 *
 * @private
 * @param {NodeList} children
 * @param {AxonNode} node
 * @returns {Array<Object>}
 */
const mapSubNodes = ($app, children, node) => arrFlattenDeep(Array.from(children)
    // @ts-ignore
    .map((child) => {
    if (hasDirectives(child)) {
        // -> Recurse
        return new AxonNode($app, child, node);
    }
    else if (child.children.length > 0) {
        // -> Enter Children
        return mapSubNodes($app, child.children, node);
    }
    // -> Exit dead-end
    return null;
})
    .filter((val) => val));
/**
 * Axon Node
 *
 * @private
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     *
     * @constructor
     * @param {HTMLElement} $element
     * @param {Element|null} $parent
     * @param {Object} [data={}]
     */
    constructor($app, $element, $parent, data = {}) {
        const dataStorage = data;
        this.directives = parseDirectives($element);
        this.data = bindDeepDataProxy(dataStorage, this);
        this.$app = $app;
        this.$element = $element;
        this.$parent = $parent;
        this.$children = mapSubNodes($app, $element.children, this);
    }
    /**
     * Runs directives on the node and all sub-nodes
     *
     * @private
     * @param {0|1} directiveFnId
     * @returns {Array|false}
     */
    run(directiveFnId) {
        const directiveResults = this.directives.map((directive) => {
            if (this.$app.directives.has(directive.name)) {
                const mapDirectiveEntry = this.$app.directives.get(directive.name);
                const mapDirectiveEntryFn = mapDirectiveEntry[directiveFnId];
                if (mapDirectiveEntryFn) {
                    return mapDirectiveEntryFn(directive, this.$element, this);
                }
            }
            // Ignore non-existent directive types
            return true;
        });
        // Recurse if all directives return true
        if (directiveResults.every((directiveResult) => directiveResult)) {
            this.$children.forEach(child => child.run(directiveFnId));
            return true;
        }
        return false;
    }
};

const DOM_DIR_FOR_BASE = "forbase";
const DOM_DIR_FOR_DYNAMIC = "dyn";
const FOR_REGEX_ARR = /(.+) of (.+)/;
/**
 * v-for init directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveForInit = (directive, element) => {
    setDirective(element, DOM_DIR_FOR_BASE, DOM_DIR_FOR_BASE);
    setElementActive(element, false);
    return false;
};
/**
 * v-for render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveForRender = (directive, element, node) => {
    const directiveSplit = directive.content.match(FOR_REGEX_ARR);
    const iteratorKey = directiveSplit[1];
    const iterable = evalProp(directiveSplit[2], node).val;
    node.$children = [];
    // Delete old nodes
    Array.from(element.parentElement.children).forEach(
    // @ts-ignore
    (child) => {
        if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
            child.remove();
        }
    });
    for (const i of iterable) {
        const nodeElement = element.cloneNode(true);
        const nodeData = objFrom(node.data);
        setDirective(nodeElement, DOM_DIR_FOR_DYNAMIC, DOM_DIR_FOR_DYNAMIC);
        removeDirective(nodeElement, DOM_DIR_FOR_BASE);
        removeDirective(nodeElement, "for");
        setElementActive(nodeElement, true);
        nodeData[iteratorKey] = i;
        const elementInserted = element.insertAdjacentElement("beforebegin", nodeElement);
        // Creates AxonNode for the new element and adds to node children
        const nodeNew = new AxonNode(node.$app, elementInserted, node.$parent, nodeData);
        node.$children.push(nodeNew);
        nodeNew.run(0 /* init */);
    }
    return true;
};

/**
 * v-html render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveHTMLRender = (directive, element, node) => {
    element[DOM_PROP_HTML] = String(evalDirective(directive.content, node).val);
    return true;
};

/**
 * v-if directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveIfRender = (directive, element, node) => {
    const expressionValue = Boolean(evalDirective(directive.content, node, true).val);
    setElementActive(element, expressionValue);
    return expressionValue;
};

/**
 * v-model init directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveModelInit = (directive, element, node) => {
    const elementContentProp = getElementContentProp(element);
    const elementEventType = getInputEventType(element);
    bindEvent(element, elementEventType, () => {
        const targetProp = evalProp(directive.content, node);
        // @ts-ignore
        targetProp.container[targetProp.key] = element[elementContentProp];
    });
    return true;
};
/**
 * v-model render directive
 *
 * @private
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveModelRender = (directive, element, node) => {
    const elementContentProp = getElementContentProp(element);
    const targetProp = evalProp(directive.content, node);
    // @ts-ignore
    element[elementContentProp] = targetProp.val;
    return true;
};

/**
 * v-on init directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveOnInit = (directive, element, node) => {
    bindEvent(element, directive.opt, (e) => applyMethodContext(evalMethod(directive.content, node), [e]));
    return true;
};

/**
 * v-text render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveTextRender = (directive, element, node) => {
    element[DOM_PROP_TEXT] = String(evalDirective(directive.content, node).val);
    return true;
};

/**
 * Some of the directive keys are reserved words.
 *
 * should work fine, but be careful.
 *
 * @private
 */
const directives = mapFromObject({
    if: {
        [1 /* render */]: directiveIfRender
    },
    on: {
        [0 /* init */]: directiveOnInit
    },
    model: {
        [0 /* init */]: directiveModelInit,
        [1 /* render */]: directiveModelRender
    },
    bind: {
        [1 /* render */]: directiveBindRender
    },
    text: {
        [1 /* render */]: directiveTextRender
    },
    html: {
        [1 /* render */]: directiveHTMLRender
    },
    for: {
        [0 /* init */]: directiveForInit,
        [1 /* render */]: directiveForRender
    }
});

/**
 * Axon Root Node
 *
 * @class
 */
const AxonApp = class {
    /**
     * Axon Root Constructor
     *
     * @constructor
     * @param {Object} [cfg={}] Config data for the Axon instance
     */
    constructor(cfg) {
        this.$entry = new AxonNode(this, cfg.el, null, cfg.data);
        this.methods = cfg.methods || {};
        this.directives = directives;
        this.init();
        this.render();
    }
    /**
     * Initializes directives
     */
    init() {
        return this.$entry.run(0 /* init */);
    }
    /**
     * Renders directives
     */
    render() {
        return this.$entry.run(1 /* render */);
    }
};

module.exports = AxonApp;
