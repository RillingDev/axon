/**
 * Axon v0.8.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

const _document = document;

const DEBOUNCE_TIMEOUT = 40; //event timeout in ms

const DOM_PREFIX = "x-";

/**
 * iterate over NodeList
 *
 * @private
 * @param {NodeList} nodeList The nodeList to iterate over
 * @param {Function} fn The Function to call
 * @returns void
 */
const eachNode = function(nodeList, fn) {
    const l = nodeList.length;
    let i = 0;

    while (i < l) {
        fn(nodeList[i], i);
        i++;
    }
};

/**
 * Iterate over NamedNodeMap
 *
 * @private
 * @param {NamedNodeMap} namedNodeMap The NamedNodeMap to iterate over
 * @param {Function} fn The Function to run
 * @returns void
 */
const eachAttribute = function(namedNodeMap, fn) {
    const l = namedNodeMap.length;
    let i = 0;

    while (i < l) {
        const item = namedNodeMap.item(i);

        fn(item.name, item.value, i);
        i++;
    }
};

const crawlNodes = function(entry, fn) {
    const recurseNodes = function(node, fn) {
        const children = node.children;

        if (children && children.length > 0) {
            let result = true;
            
            result = eachNode(children, childNode => {
                return recurseNodes(childNode, fn);
            });

            return result;
        } else {
            return fn(node);
        }
    };

    return recurseNodes(entry, fn);
};

const eachDirective = function (node, namesList) {
    const names = namesList.map(item => item.name);

    eachAttribute(node.attributes, (attributeName, attributeValue) => {

        //If is Axon attribute
        if (attributeName.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            const splitName = attributeName.replace(DOM_PREFIX, "").split(":");
            const nameIndex = names.indexOf(splitName[0]);

            //If name is allowed
            if (nameIndex !== -1) {
                namesList[nameIndex].fn({
                    name: splitName[0],
                    secondary: splitName[1],
                    value: attributeValue
                });
            }
        }
    });
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

const getNodeValueType = function(node) {
    if (typeof node.value !== "undefined") {
        return "value";
    } else if (typeof node.textContent !== "undefined") {
        return "textContent";
    } else {
        return "innerHTML";
    }
};

const bindEvent = function(node, eventType, eventFn, eventArgs, instance) {
    const debouncedFn = debounce(eventFn, DEBOUNCE_TIMEOUT);
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

        if (typeof prop === "undefined") {
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

    if (typeof methodFn !== "function") {
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
};

const init = function () {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, [{
                name: "on",
                fn: directive => {
                    initOn(_this, node, directive.secondary, directive.value);
                }
            }]
        );

        return true;
    });

    console.log("CALLED $init");
};

const renderModel = function(instance, node, propName) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, propName);

    node[nodeValueType] = propValue;
};

const renderBind = function (instance, node, bindType, propName) {
    //const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, propName);

    console.log(propValue);

    node.setAttribute(bindType,propValue);
};

const render = function () {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, [{
                name: "model",
                fn: directive => {
                    renderModel(_this, node, directive.value);
                }
            }, {
                name: "bind",
                fn: directive => {
                    renderBind(_this, node, directive.secondary, directive.value);
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
        _this.$render();
        _this.$init();
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
