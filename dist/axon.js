/**
 * Axon v0.12.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

var mapNodes = function mapNodes(entry, fn) {
    var result = {};
    var recurseNodes = function recurseNodes(node, depth, container) {
        container.node = node;
        container.children = [];
        fn(container, node, depth);

        if (node.childElementCount) {
            var childArr = Array.from(node.children);

            childArr.forEach(function (childNode, index) {
                container.children[index] = {};

                recurseNodes(childNode, depth + 1, container.children[index]);
            });
        }
    };

    recurseNodes(entry, 0, result);

    return result;
};

var init = function init() {
    var _this = this;
    var result = mapNodes(_this.$context, function (container, node) {});

    console.log("CALLED $init", result);

    return result;
};

var render = function render() {
    var _this = this;

    //Render DOM
    /*crawlNodes(_this.$context, node => {
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
    });*/

    console.log("CALLED $render");
};

/**
 * Basic Axon Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Axon instance
 */
var Axon = function Axon(config) {
    var _this = this;

    _this.$context = document.querySelector(config.context);
    _this.$data = config.data;
    _this.$methods = config.methods;

    _this.$cache = _this.$init();
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
