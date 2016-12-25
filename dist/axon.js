/**
 * Axon v0.6.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

var _document = document;

var DOM_PREFIX = "x-";

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
 * Iterate over Object
 *
 * @private
 * @param {Object} object The Object to iterate over
 * @param {Function} fn The Function to run
 * @returns void
 */


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

var getDirectives = function getDirectives(node, allowedNames, fn) {
    eachAttribute(node.attributes, function (attributeName, attributeValue) {

        //If is Axon attribute
        if (attributeName.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            var splitName = attributeName.replace(DOM_PREFIX, "").split(":");

            //If name is allowed
            if (allowedNames.indexOf(splitName[0]) !== -1) {
                fn(splitName[0], splitName[1], attributeValue);
            }
        }
    });
};

var bindEventString = function bindEventString(node, eventType, eventFnString, instance) {
    //@TODO make this safer
    //Split up function string
    var eventFnStringSplit = eventFnString.substr(0, eventFnString.length - 1).split("(");
    var eventFnName = eventFnStringSplit[0];
    var eventFnArgs = eventFnStringSplit[1].split(",").map(Number);
    var eventFnTarget = instance.$methods[eventFnName];

    if (typeof eventFnTarget === "function") {
        var eventFn = function eventFn(e) {
            var args = Array.from(eventFnArgs);

            eventFnArgs.push(e);
            eventFnTarget.call(instance, args);
        };

        node.addEventListener(eventType, eventFn, false);
    } else {
        throw new Error("Event fn '" + eventFnName + "' not found");
    }
};

var init = function init() {
    var _this = this;

    return crawlNodes(_this.$context, function (node) {
        getDirectives(node, ["on"], function (name, eventType, eventFnString) {
            bindEventString(node, eventType, eventFnString, _this);
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

    _this.init();
    _this.render();
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    init: init,
    render: render,
    constructor: Axon
};

return Axon;

}());

//# sourceMappingURL=axon.js.map
