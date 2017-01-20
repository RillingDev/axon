const directiveIgnoreBoth = function () {
    return false;
};

const DOM_EVENT_TIMEOUT = 20; //event timeout in ms
const DOM_EVENT_MODEL = "input";

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_HIDDEN = "hidden";
const DOM_ATTR_VALUE = "value";
const DOM_ATTR_TEXT = "textContent";
const DOM_ATTR_HTML = "innerHTML";

const LIB_STRING_QUOTES = ["'", "\"", "`"];

/**
 * Gets method from Axon instance
 * @private
 * @param {Object} instanceContentMethods Axon instance methods container
 * @param {String} expression Directive expression
 * @returns {Function} method of instance
 */
const retrieveMethod = function (instanceContentMethods, expression) {
    const expressionSplit = expression.substr(0, expression.length - 1).split("(");
    const methodName = expressionSplit[0];
    const methodArgs = expressionSplit[1].split(",").filter(item => item !== "").map(arg => {
        return evaluateExpression(instanceContentMethods, arg);
    });
    const methodFn = instanceContentMethods[methodName];

    if (typeof methodFn === "function") {
        return {
            fn: methodFn,
            args: methodArgs
        };
    } else {
        throw new Error(`Missing method '${expression}'`);
    }
};

/**
 * @private
 * @param {Mixed} val Value to check
 * @returns {Boolean} if the value is defined
 */
const isDefined = function (val) {
    return typeof val !== "undefined";
};

/**
 * Gets property from Axon instance
 * @private
 * @param {Object} instanceContentMethods Axon instance data container
 * @param {String} expression Directive expression
 * @returns {Mixed} property of instance
 */
const retrieveProp = function (instanceContentMethods, expression) {
    const splitExpression = expression.split(".");
    const result = {
        val: null,
        ref: null
    };
    let container = instanceContentMethods;
    let prop;

    splitExpression.forEach((propPath, index) => {
        prop = container[propPath];

        if (isDefined(prop)) {

            if (index < splitExpression.length - 1) {
                container = prop;
            } else {
                result.val = prop;
                result.ref = container;
            }
        } else {
            throw new Error(`Missing prop '${expression}'`);
        }
    });

    return result;
};

/**
 * evaluates expression from Axon instance
 * @private
 * @param {Axon} instanceContent Axon instance
 * @param {String} expression Directive expression
 * @returns {Mixed} value of expression
 */
const evaluateExpression = function (instanceContent, expression) {

    if (!isNaN(Number(expression))) {
        //expression is a Number
        return Number(expression);
    } else if (LIB_STRING_QUOTES.includes(expression.substr(0, 1))) {
        //expression is a String
        return expression.substr(1, expression.length - 2);
    } else if (expression.substr(expression.length - 1) === ")") {
        //expression is a Method
        const method = retrieveMethod(instanceContent.$methods, expression);

        return method.fn.apply(instanceContent, method.args);
    } else {
        //expression is a Property
        return retrieveProp(instanceContent.$data, expression).val;
    }
};

const directiveIfRender = function (node, directive,instanceContent) {
    const propValue = evaluateExpression(instanceContent, directive.val);
    const result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

/**
 * @private
 * @param {Function} fn function to debounce
 * @param {Number} wait timeout in ms
 * @param {Boolean} immediate if the debounc should be ignored
 * @returns {Function} debounced function
 */
const debounce = function(fn, wait, immediate) {
    let timeout;

    return function() {
        const context = this;
        const args = Array.from(arguments);
        const callNow = immediate && !timeout;
        const later = function() {
            timeout = null;
            if (!immediate) {
                fn.apply(context, args);
            }
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            fn.apply(context, args);
        }
    };
};

const getNodeValueType = function (node) {
    if (isDefined(node[DOM_ATTR_VALUE])) {
        return DOM_ATTR_VALUE;
    } else if (isDefined(node[DOM_ATTR_TEXT])) {
        return DOM_ATTR_TEXT;
    } else {
        return DOM_ATTR_HTML;
    }
};

const bindEvent = function(node, eventType, eventFn, eventArgs, instanceData) {
    const debouncedFn = debounce(eventFn, DOM_EVENT_TIMEOUT);
    const nodeValueType = getNodeValueType(node);

    const eventFnWrapper = function(event) {
        const target = event.target;
        const args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instanceData, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

const directiveOnInit = function (node, directive, instanceContent) {
    const targetMethod = retrieveMethod(instanceContent.$methods, directive.val);

    bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instanceContent);

    return true;
};

const directiveModelInit = function (node, directive, instanceContent, instanceMethods) {
    const targetProp = retrieveProp(instanceContent.$data, directive.val);
    const eventFn = function (currentValue, newValue) {
        targetProp.ref[directive.val] = newValue;

        setTimeout(() => {
            instanceMethods.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instanceContent);

    return true;
};

const directiveModelRender = function (node, directive, instanceContent) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instanceContent.$data, directive.val);

    node[nodeValueType] = propValue.val;

    return true;
};

const directiveBindRender = function (node, directive,instanceContent) {
    const propValue = evaluateExpression(instanceContent, directive.val);

    node.setAttribute(directive.opt, propValue);

    return true;
};

const directiveForInit = function (node, directive, instanceContent) {
    const splitExpression = directive.val.split(" ");
    const data = {
        val: splitExpression[0],
        in: evaluateExpression(instanceContent, splitExpression[2])
    };

    directive.data = data;

    return true;
};

const directiveForRender = function (node, directive, instanceContent, instanceMethods, mapNode) {
    const attr_clone = DOM_ATTR_PREFIX + "clone";
    const iterable = directive.data.in;
    const parent = node.parentNode;
    const parentChildren = Array.from(parent.children);

    //Clear old clones
    parentChildren.forEach(child => {
        if (child.hasAttribute(attr_clone)) {
            child.remove();
        }
    });
    //Add new clones
    iterable.forEach((item, index) => {
        let currentNode;

        if (index === 0) {
            currentNode = node;
        } else {
            const clone = node.cloneNode(true);

            clone.setAttribute(attr_clone, true);
            parent.appendChild(clone);
            currentNode = clone;
        }

        //instanceMethods.init(currentNodeMap);
        //instanceMethods.render(currentNodeMap);

        console.log(mapNode);
    });


    console.log("FOR RENDER", node);

    return true;
};

const directives = [{
        name: "ignore",
        init: directiveIgnoreBoth, //Init function
        render: directiveIgnoreBoth //Render function
    }, {
        name: "if",
        render: directiveIfRender
    },
    {
        name: "on",
        init: directiveOnInit,
    },
    {
        name: "model",
        init: directiveModelInit,
        render: directiveModelRender
    },
    {
        name: "bind",
        render: directiveBindRender
    },
    {
        name: "for",
        init: directiveForInit,
        render: directiveForRender
    }
];

const getDirectives = function (node) {
    const attrArr = Array.from(node.attributes);
    const result = [];

    attrArr.forEach(attr => {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
            const splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");

            result.push({
                name: splitName[0],
                opt: splitName[1],
                val: attr.value
            });
        }
    });


    return result.sort((a, b) => {
        //sort by proccessing order
        const indexA = directives.findIndex(item => item.name === a.name);
        const indexB = directives.findIndex(item => item.name === b.name);

        return indexA >= indexB;
    });
};

const getDomMap = function (entry) {
    const recurseNodes = function (node) {
        const nodeDirectives = getDirectives(node);
        const nodeChildren = node.children;

        if (nodeDirectives.length || nodeChildren.length) {
            let result = {
                node,
                directives: nodeDirectives,
                children: []
            };
            const childArr = Array.from(nodeChildren);

            childArr.forEach(childNode => {
                const childResult = recurseNodes(childNode);

                if (isDefined(childResult)) {
                    result.children.push(childResult);
                }
            });

            return result;
        }
    };

    return recurseNodes(entry);
};

/**
 * Runs all directives from the domMap
 * @private
 * @param {Axon} instance Axon instance
 * @param {Object} domMap domMap to run directives
 * @param {String} execMode mode to run in ("init" or "render")
 */
const execDirectives = function (instance, domMap, execMode) {
    console.log([instance, domMap, execMode]);
    const instanceContent = {
        $data: instance.$data,
        $methods: instance.$methods
    };
    const instanceMethods = {
        $render: instance.$render.bind(instance),
        $init: instance.$init.bind(instance)
    };
    const recurseMap = function (mapNode) {
        const nodeChildren = mapNode.children;
        const nodeDirectives = mapNode.directives;
        let result = true;

        //Exec on node
        if (nodeDirectives.length) {
            //Only exec if directives on domNode
            mapNode.directives.forEach(directive => {
                const directiveRef = directives.find(item => item.name === directive.name);

                if (directiveRef) {
                    //Only exec if directive exists
                    const directiveRefFn = directiveRef[execMode];

                    if (directiveRefFn) {
                        //Only exec if directive has fn for current execMode
                        //@TODO restructure args
                        const directiveResult = directiveRefFn(mapNode.node, directive, instanceContent, instanceMethods, mapNode);

                        if (!directiveResult) {
                            //Stop crawling on directive return 'false'
                            result = false;
                        }
                    }
                }
            });
        }

        //Crawl children
        if (result && nodeChildren.length) {
            nodeChildren.forEach(child => {
                recurseMap(child);
            });
        }
    };

    recurseMap(domMap);
};

/**
 * Axon Class
 * @class
 */
const Axon = class {
    /**
     * Basic Axon Constructor
     * @constructor
     * @param {Object} config Config data for the Axon instance
     * @returns {Axon} Returns Axon instance
     */
    constructor(config) {
        const _this = this;

        _this.$context = document.querySelector(config.context);
        _this.$data = config.data;
        _this.$methods = config.methods;
        _this.$cache = {};

        _this.$init();
        _this.$render();

        return _this;
    }
    /**
     * Init directives
     */
    $init(mapNode) {
        const _this = this;
        let entry;

        _this.$cache = getDomMap(_this.$context);
        entry = isDefined(mapNode) ? mapNode : _this.$cache;
        execDirectives(_this, entry, "init");
    }
    /**
     * Renders controller changes
     */
    $render(mapNode) {
        const _this = this;
        const entry = isDefined(mapNode) ? mapNode : _this.$cache;

        execDirectives(_this, entry, "render");
    }
};

export default Axon;
