/**
 * Axon v0.10.1
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

const _document = document;

const TYPE_NAME_UNDEFINED = "undefined";
const TYPE_NAME_FUNCTION = "function";
const LIB_DEBOUNCE_TIMEOUT = 32; //event timeout in ms

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_HIDDEN = "hidden";

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
    if (typeof node.value !== TYPE_NAME_UNDEFINED) {
        return "value";
    } else if (typeof node.textContent !== TYPE_NAME_UNDEFINED) {
        return "textContent";
    } else {
        return "innerHTML";
    }
};

const bindEvent = function(node, eventType, eventFn, eventArgs, instance) {
    const debouncedFn = debounce(eventFn, LIB_DEBOUNCE_TIMEOUT);
    const nodeValueType = getNodeValueType(node);

    const eventFnWrapper = function(event) {
        const target = event.target;
        const args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

const retrieveProp = function (instance, propName) {
    const castNumber = Number(propName);
    const stringChars = ["'", "\"", "`"];

    if (!isNaN(castNumber)) {
        //If number
        return castNumber;
    } else if (stringChars.includes(propName[0])) {
        //If String
        return propName.substr(1, propName.length - 2);
    } else {
        //If Prop
        const propPath = propName.split(".");
        let prop = instance.$data;

        propPath.forEach(propItem => {
            prop = prop[propItem];
        });

        if (typeof prop === TYPE_NAME_UNDEFINED) {
            throw new Error(`prop '${propName}' not found`);
        } else {
            return prop;
        }
    }
};

const retrieveMethod = function(instance, methodString) {
    const methodStringSplit = methodString.substr(0, methodString.length - 1).split("(");
    const methodName = methodStringSplit[0];
    const methodArgs = methodStringSplit[1].split(",").filter(item => item !== "").map(arg => retrieveProp(instance, arg));

    const methodFn = instance.$methods[methodName];

    if (typeof methodFn !== TYPE_NAME_FUNCTION) {
        throw new Error(`method '${methodName}' not found`);
    } else {
        return {
            fn: methodFn,
            args: methodArgs
        };
    }
};

const initOn = function (instance, node, eventType, methodName) {
    const targetMethod = retrieveMethod(instance, methodName);

    bindEvent(node, eventType, targetMethod.fn, targetMethod.args, instance);

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
            }]
        );
    });

    console.log("CALLED $init");
};

const renderIf = function (instance, node, propName) {
    const propValue = retrieveProp(instance, propName);
    const result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

const renderModel = function(instance, node, propName) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, propName);

    node[nodeValueType] = propValue;

    return true;
};

const renderBind = function (instance, node, bindType, propName) {
    const propValue = retrieveProp(instance, propName);

    node.setAttribute(bindType,propValue);

    return true;
};

const render = function () {
    const _this = this;

    //Render DOM
    crawlNodes(_this.$context, node => {
        //console.log(node);
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
const Axon = function (config, autoInit = true) {
    const _this = this;

    _this.$context = _document.querySelector(config.context);
    _this.$data = config.data;
    _this.$methods = config.methods;

    if (autoInit) {
        _this.$init();
        _this.$render();
    }
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
