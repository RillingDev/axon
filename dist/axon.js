/**
 * Axon v0.6.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

var _document = document;

var DOM_PREFIX = "x-";
var DEBOUNCE_TIMEOUT = 40; //event timeout in ms

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

/**
 * Iterate over Object
 *
 * @private
 * @param {Object} object The Object to iterate over
 * @param {Function} fn The Function to run
 * @returns void
 */

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

var bindEvent = function bindEvent(node, eventType, eventFn, eventArgs, instance) {
    var debouncedFn = debounce(eventFn, DEBOUNCE_TIMEOUT);
    var eventFnWrapper = function eventFnWrapper(e) {
        var args = Array.from(eventArgs);

        args.push(e);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

var retrieveMethod = function retrieveMethod(app, methodName) {
    return app.$methods.getFoobar;
};

var init = function init() {
    var _this = this;

    //Bind events
    crawlNodes(_this.$context, function (node) {
        eachDirective(node, ["on"], function (directive) {
            var eventFn = retrieveMethod(_this, directive.value);

            bindEvent(node, directive.secondary, eventFn, [], _this);
        });
    });
};

var render = function render() {
    var _this = this;
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
