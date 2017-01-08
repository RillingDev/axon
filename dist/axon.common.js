/**
 * Axon v0.13.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

'use strict';

const DOM_EVENT_TIMEOUT = 20; //event timeout in ms
const DOM_EVENT_MODEL = "input";

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_HIDDEN = "hidden";
const DOM_ATTR_VALUE = "value";
const DOM_ATTR_TEXT = "textContent";
const DOM_ATTR_HTML = "innerHTML";

const LIB_STRING_QUOTES = ["'", "\"", "`"];

const getDirectives = function (node) {
    const attrArr = Array.from(node.attributes);
    const result = [];

    attrArr.forEach(attr => {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
            const splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");

            result.push({
                key: splitName[0],
                opt: splitName[1] || false,
                val: attr.value
            });
        }
    });

    return result;
};

const directiveIgnoreBoth = function () {
    return false;
};

const retrieveMethod = function (instance, expression) {
    const expressionSplit = expression.substr(0, expression.length - 1).split("(");
    const methodName = expressionSplit[0];
    const methodArgs = expressionSplit[1].split(",").filter(item => item !== "").map(arg => {
        return evaluateExpression(instance, arg);
    });
    const methodFn = instance.$methods[methodName];

    if (typeof methodFn === "function") {
        return {
            fn: methodFn,
            args: methodArgs
        };
    } else {
        throw new Error(`Method not found: '${expression}'`);
    }
};

const isDefined = function (val) {
    return typeof val !== "undefined";
};

const retrieveProp = function (instance, expression) {
    const splitExpression = expression.split(".");
    const result = {
        val: null,
        reference: null
    };
    let container = instance.$data;
    let prop;

    splitExpression.forEach((propPath, index) => {
        prop = container[propPath];

        if (isDefined("undefined")) {

            if (index < splitExpression.length - 1) {
                container = prop;
            } else {
                result.val = prop;
                result.reference = container;
            }
        } else {
            throw new Error(`Property not found: '${expression}'`);
        }
    });

    return result;
};

const evaluateExpression = function (instance, expression) {
    if (!isNaN(Number(expression))) {
        //expression is a Number
        return Number(expression);
    } else if (LIB_STRING_QUOTES.includes(expression.substr(0, 1))) {
        //expression is a String
        return expression.substr(1, expression.length - 2);
    } else if (expression.substr(expression.length - 1) === ")") {
        //expression is a Method
        const method = retrieveMethod(instance, expression);

        return method.fn.apply(instance, method.args);
    } else {
        //expression is a Property
        return retrieveProp(instance, expression).val;
    }
};

const directiveIfRender = function (instance, node, directive) {
    const propValue = evaluateExpression(instance, directive.val);
    const result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

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

const bindEvent = function(node, eventType, eventFn, eventArgs, instance) {
    const debouncedFn = debounce(eventFn, DOM_EVENT_TIMEOUT);
    const nodeValueType = getNodeValueType(node);

    const eventFnWrapper = function(event) {
        const target = event.target;
        const args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

const directiveOnInit = function (instance, node, directive) {
    const targetMethod = retrieveMethod(instance, directive.val);

    bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instance);

    return true;
};

const directiveModelInit = function (instance, node, directive) {
    const targetProp = retrieveProp(instance, directive.val);
    const eventFn = function (currentValue, newValue) {
        targetProp.reference[directive.val] = newValue;

        setTimeout(() => {
            instance.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instance);

    return true;
};

const directiveModelRender = function (instance, node, directive) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, directive.val);

    node[nodeValueType] = propValue.val;

    return true;
};

const directiveBindRender = function (instance, node, directive) {
    const propValue = evaluateExpression(instance, directive.val);

    node.setAttribute(directive.opt, propValue);

    return true;
};

const directives = {
    ignore: {
        init: directiveIgnoreBoth, //Init function
        render: directiveIgnoreBoth //Render function
    },
    if: {
        render: directiveIfRender
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
    }
};

const execDirectives = function (instance, domMap, execMode) {
    const recurseMap = function (mapNode) {
        const nodeChildren = mapNode.children;
        const nodeDirectives = mapNode.directives;
        let result = true;

        //Exec on node
        if (nodeDirectives.length) {
             //Only exec if directives on domNode
            mapNode.directives.forEach(directive => {
                const directiveRef = directives[directive.key];

                if (directiveRef) {
                     //Only exec if directive exists
                    const directiveRefFn = directiveRef[execMode];

                    if (directiveRefFn) {
                        //Only exec if directive has fn for current execMode
                        const directiveResult = directiveRefFn(instance, mapNode.node, directive);

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

const getDomMap = function (entry, fn) {
    const result = {};
    const recurseNodes = function (node, container) {
        container.node = node;
        container.children = [];
        fn(container, node);

        if (node.childElementCount) {
            const childArr = Array.from(node.children);

            childArr.forEach((childNode, index) => {
                container.children[index] = {};

                recurseNodes(childNode, container.children[index]);
            });
        }
    };

    recurseNodes(entry, result);

    return result;
};

const init = function () {
    const _this = this;

     _this.$cache = getDomMap(_this.$context, (container, node) => {
        //Cache all nodes & directives in the context
        const directives = getDirectives(node);

        container.directives = directives;
    });

    execDirectives(_this, _this.$cache, "init");
    console.log("CALLED $init");
};

const render = function () {
    const _this = this;

    execDirectives(_this, _this.$cache, "render");
    console.log("CALLED $render");
};

/**
 * Basic Axon Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Axon instance
 */
const Axon = function (config) {
    const _this = this;

    _this.$context = document.querySelector(config.context);
    _this.$data = config.data;
    _this.$methods = config.methods;
    _this.$cache = {};
    
    _this.$init();
    _this.$render();
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    $init: init,
    $render: render,
    constructor: Axon,
};

module.exports = Axon;
