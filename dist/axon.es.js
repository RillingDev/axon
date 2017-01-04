/**
 * Axon v0.12.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

const DOM_EVENT_TIMEOUT = 20; //event timeout in ms
const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_HIDDEN = "hidden";
const DOM_EVENT_MODEL = "input";
const DOM_NODE_CONTENT = ["value", "textContent", "innerHTML"];

const LIB_STRING_QUOTES = ["'", "\"", "`"];

const eachDirective = function (node, namesList) {
    const names = namesList.map(item => item.name);
    const attrArr = Array.from(node.attributes);
    let result = true;

    attrArr.forEach(attr => {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
            const splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");
            const nameIndex = names.indexOf(splitName[0]);

            //If name is allowed
            if (nameIndex !== -1) {
                result = namesList[nameIndex].fn(splitName[0], splitName[1], attr.value);
            }
        }
    });

    return result;
};

const crawlNodes = function (entry, fn) {
    const recurseNodes = function (node, fn) {
        let result = fn(node);

        if (result && node.childElementCount) {
            const childArr = Array.from(node.children);

            childArr.forEach(childNode => {
                result = recurseNodes(childNode, fn);
            });
        }

        return result;
    };

    return recurseNodes(entry, fn);
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

const isDefined = function (val) {
    return typeof val !== "undefined";
};

const getNodeValueType = function (node) {
    if (isDefined(node[DOM_NODE_CONTENT[0]])) {
        return DOM_NODE_CONTENT[0];
    } else if (isDefined(node[DOM_NODE_CONTENT[1]])) {
        return DOM_NODE_CONTENT[1];
    } else {
        return DOM_NODE_CONTENT[2];
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

const initOn = function (instance, node, eventType, methodName) {
    const targetMethod = retrieveMethod(instance, methodName);

    bindEvent(node, eventType, targetMethod.fn, targetMethod.args, instance);

    return true;
};

const initModel = function (instance, node, propName) {
    const targetProp = retrieveProp(instance, propName);
    const eventFn = function (currentValue, newValue) {
        targetProp.reference[propName] = newValue;

        setTimeout(() => {
            instance.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instance);

    return true;
};

const init = function () {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        return eachDirective(
            node, [{
                name: "on",
                fn: (name, nameSecondary, value) => {
                    return initOn(_this, node, nameSecondary, value);
                }
            }, {
                name: "model",
                fn: (name, nameSecondary, value) => {
                    return initModel(_this, node, value);
                }
            }]
        );
    });

    console.log("CALLED $init");
};

const renderIf = function (instance, node, expression) {
    const propValue = evaluateExpression(instance, expression);
    const result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

const renderModel = function (instance, node, propName) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, propName);

    node[nodeValueType] = propValue.val;

    return true;
};

const renderBind = function (instance, node, bindType, expression) {
    const propValue = evaluateExpression(instance, expression);

    node.setAttribute(bindType,propValue);

    return true;
};

const render = function () {
    const _this = this;

    //Render DOM
    crawlNodes(_this.$context, node => {
        return eachDirective(
            node, [{
                name: "ignore",
                fn: () => {
                    return false;
                }
            }, {
                name: "if",
                fn: (name, nameSecondary, value) => {
                    return renderIf(_this, node, value);
                }
            }, {
                name: "model",
                fn: (name, nameSecondary, value) => {
                    return renderModel(_this, node, value);
                }
            }, {
                name: "bind",
                fn: (name, nameSecondary, value) => {
                    return renderBind(_this, node, nameSecondary, value);
                }
            }]
        );
    });

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

export default Axon;
