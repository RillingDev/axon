/**
 * Axon v0.6.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

'use strict';

/**
 * Store constants
 */

const _document = document;

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

const init = function () {
    const _this = this;

    crawlNodes(_this.$context, node => {
        console.log("N", node);

        return true;
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
