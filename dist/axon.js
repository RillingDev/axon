/**
 * Axon v0.6.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

/**
 * Store constants
 */


var _document = document;

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

var init = function init() {
    var _this = this;

    crawlNodes(_this.$context, function (node) {
        console.log("N", node);

        return true;
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
