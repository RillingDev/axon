/**
 * Axon v0.12.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

'use strict';

const mapNodes = function (entry, fn) {
    const result = {};
    const recurseNodes = function (node, depth, container) {
        container.node = node;
        container.children = [];
        fn(container, node, depth);

        if (node.childElementCount) {
            const childArr = Array.from(node.children);

            childArr.forEach((childNode, index) => {
                container.children[index] = {};

                recurseNodes(childNode, depth + 1, container.children[index]);
            });
        }
    };

    recurseNodes(entry, 0, result);

    return result;
};

const init = function () {
    const _this = this;
    const result = mapNodes(_this.$context, (container, node) => {

    });

    console.log("CALLED $init", result);

    return result;
};

const render = function () {
    const _this = this;

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
const Axon = function (config) {
    const _this = this;

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
    constructor: Axon,
};

module.exports = Axon;
