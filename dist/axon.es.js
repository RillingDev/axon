/**
 * Axon v0.6.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

const _document = document;

const DOM_PREFIX = "x-";
const DEBOUNCE_TIMEOUT = 40; //event timeout in ms

/**
 * Iterate over Object
 *
 * @private
 * @param {Object} object The Object to iterate over
 * @param {Function} fn The Function to run
 * @returns void
 */


/**
 * iterate over NodeList
 *
 * @private
 * @param {NodeList} nodeList The nodeList to iterate over
 * @param {Function} fn The Function to call
 * @returns void
 */
function eachNode(nodeList, fn) {
    const l = nodeList.length;
    let i = 0;

    while (i < l) {
        fn(nodeList[i], i);
        i++;
    }
}

/**
 * Iterate over NamedNodeMap
 *
 * @private
 * @param {NamedNodeMap} namedNodeMap The NamedNodeMap to iterate over
 * @param {Function} fn The Function to run
 * @returns void
 */
function eachAttribute(namedNodeMap, fn) {
    const l = namedNodeMap.length;
    let i = 0;

    while (i < l) {
        const item = namedNodeMap.item(i);

        fn(item.name, item.value, i);
        i++;
    }
}

const crawlNodes = function (entry, fn) {
    const recurseNodes = function (node, fn) {
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

    return recurseNodes(entry, fn)
};

const eachDirective = function (node, allowedNames, fn) {
    eachAttribute(node.attributes, (attributeName, attributeValue) => {

        //If is Axon attribute
        if (attributeName.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            const splitName = attributeName.replace(DOM_PREFIX, "").split(":");

            //If name is allowed
            if (allowedNames.indexOf(splitName[0]) !== -1) {
                fn({
                    name: splitName[0],
                    secondary: splitName[1],
                    value: attributeValue
                });
            }
        }
    });
};

const debounce = function (fn, wait, immediate) {
    let timeout;

    return function () {
        const context = this;
        const args = Array.from(arguments);
        const callNow = immediate && !timeout;
        const later = function () {
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

const bindEvent = function (node, eventType, eventFn, eventArgs, instance) {
    const debouncedFn = debounce(eventFn, DEBOUNCE_TIMEOUT);
    const eventFnWrapper = function (e) {
        const args = Array.from(eventArgs);

        args.push(e);

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
        //If prop
        const prop = instance.$data[propName];

        if (typeof prop === "undefined") {
            throw new Error(`prop '${propName}' not found`);
        } else {
            return prop;
        }
    }

    return null;
};

const retrieveMethod = function (instance, methodString) {
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

const init = function () {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, ["on"],
            directive => {
                const targetMethod = retrieveMethod(_this, directive.value);

                bindEvent(node, directive.secondary, targetMethod.fn, targetMethod.args, _this);
            }
        );
    });

    console.log("CALLED $init");
};

const render = function () {
    const _this = this;

    console.log("CALLED $render");
};

/**
 * Basic Axon Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Axon instance
 */
const Axon = function (appConfig) {
    const _this = this;

    _this.$context = _document.querySelector(appConfig.context);
    _this.$data = appConfig.data;
    _this.$methods = appConfig.methods;

    _this.$init();
    _this.$render();
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    $init:init,
    $render:render,
    constructor: Axon,
};

export default Axon;
