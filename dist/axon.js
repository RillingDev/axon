/**
 * Axon v0.7.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

var _document = document;

var DOM_PREFIX = "x-";
var DEBOUNCE_TIMEOUT = 40; //event timeout in ms

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
    var l = nodeList.length;
    var i = 0;

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
    var l = namedNodeMap.length;
    var i = 0;

    while (i < l) {
        var item = namedNodeMap.item(i);

        fn(item.name, item.value, i);
        i++;
    }
}

var crawlNodes = function crawlNodes(entry, fn) {
    var recurseNodes = function recurseNodes(node, fn) {
        var children = node.children;

        if (children && children.length > 0) {
            var result = true;

            result = eachNode(children, function (childNode) {
                return recurseNodes(childNode, fn);
            });

            return result;
        } else {
            return fn(node);
        }
    };

    return recurseNodes(entry, fn);
};

var eachDirective = function eachDirective(node, allowedNames, fn) {
    eachAttribute(node.attributes, function (attributeName, attributeValue) {

        //If is Axon attribute
        if (attributeName.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            var splitName = attributeName.replace(DOM_PREFIX, "").split(":");

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

var debounce = function debounce(fn, wait, immediate) {
    var timeout = void 0;

    return function () {
        var context = this;
        var args = Array.from(arguments);
        var callNow = immediate && !timeout;
        var later = function later() {
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

var getNodeValueType = function getNodeValueType(node) {
    if (typeof node.value !== "undefined") {
        return "value";
    } else if (typeof node.textContent !== "undefined") {
        return "textContent";
    } else {
        return "innerHTML";
    }
};

var bindEvent = function bindEvent(node, eventType, eventFn, eventArgs, instance) {
    var debouncedFn = debounce(eventFn, DEBOUNCE_TIMEOUT);
    var nodeValueType = getNodeValueType(node);

    var eventFnWrapper = function eventFnWrapper(event) {
        var target = event.target;
        var args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

var retrieveProp = function retrieveProp(instance, propName) {
    var castNumber = Number(propName);
    var stringChars = ["'", "\"", "`"];

    if (!isNaN(castNumber)) {
        //If number
        return castNumber;
    } else if (stringChars.includes(propName[0])) {
        //If String
        return propName.substr(1, propName.length - 2);
    } else {
        //If prop
        var prop = instance.$data[propName];

        if (typeof prop === "undefined") {
            throw new Error("prop '" + propName + "' not found");
        } else {
            return prop;
        }
    }

    return null;
};

var retrieveMethod = function retrieveMethod(instance, methodString) {
    var methodStringSplit = methodString.substr(0, methodString.length - 1).split("(");
    var methodName = methodStringSplit[0];
    var methodArgs = methodStringSplit[1].split(",").filter(function (item) {
        return item !== "";
    }).map(function (arg) {
        return retrieveProp(instance, arg);
    });

    var methodFn = instance.$methods[methodName];

    if (typeof methodFn !== "function") {
        throw new Error("method '" + methodName + "' not found");
    } else {
        return {
            fn: methodFn,
            args: methodArgs
        };
    }
};

var init = function init() {
    var _this = this;

    //Bind events
    crawlNodes(_this.$context, function (node) {
        eachDirective(node, ["on"], function (directive) {
            var targetMethod = retrieveMethod(_this, directive.value);

            bindEvent(node, directive.secondary, targetMethod.fn, targetMethod.args, _this);
        });
    });

    console.log("CALLED $init");
};

var model = function model(instance, node, propName) {
    var nodeValueType = getNodeValueType(node);
    var propValue = retrieveProp(instance, propName);

    node[nodeValueType] = propValue;
};

var render = function render() {
    var _this = this;

    //Bind events
    crawlNodes(_this.$context, function (node) {
        eachDirective(node, ["model"], function (directive) {
            if (directive.name === "model") {
                model(_this, node, directive.value);
            }
        });
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
var Axon = function Axon(appConfig) {
    var _this = this;

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
    $init: init,
    $render: render,
    constructor: Axon
};

return Axon;

}());

//# sourceMappingURL=axon.js.map
