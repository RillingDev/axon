/**
 * Axon v0.6.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

'use strict';

const _document = document;

const DOM_PREFIX = "x-";

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

const getDirectives = function (node, allowedNames, fn) {
    eachAttribute(node.attributes, (attributeName, attributeValue) => {

        //If is Axon attribute
        if (attributeName.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            const splitName = attributeName.replace(DOM_PREFIX, "").split(":");

            //If name is allowed
            if (allowedNames.indexOf(splitName[0]) !== -1) {
                fn(splitName[0], splitName[1], attributeValue);
            }
        }
    });
};

const bindEventString = function (node, eventType, eventFnString, instance) {
    //@TODO make this safer
    //Split up function string
    const eventFnStringSplit = eventFnString.substr(0, eventFnString.length - 1).split("(");
    const eventFnName = eventFnStringSplit[0];
    const eventFnArgs = eventFnStringSplit[1].split(",").map(Number);
    const eventFnTarget = instance.$methods[eventFnName];

    if (typeof eventFnTarget === "function") {
        const eventFn = function (e) {
            const args = Array.from(eventFnArgs);

            eventFnArgs.push(e);
            eventFnTarget.call(instance, args);
        };

        node.addEventListener(eventType, eventFn, false);
    } else {
        throw new Error(`Event fn '${eventFnName}' not found`);
    }
};

const init = function () {
    const _this = this;

    return crawlNodes(_this.$context, node => {
        getDirectives(
            node, ["on"],
            (name, eventType, eventFnString) => {
                bindEventString(node, eventType, eventFnString, _this);
            }
        );
    });
};

const render = function () {
    const _this = this;

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

    _this.init();
    _this.render();
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    init,
    render,
    constructor: Axon,
};

module.exports = Axon;
