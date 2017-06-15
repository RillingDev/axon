"use strict";

/**
 * Redirects `node.foo` to `node.data.foo` if that exists
 */
const nodeProxy = {
    /**
     * Redirects prop lookup
     * @param {Object} target
     * @param {String} key
     * @returns {Mixed}
     */
    get: (target, key) => {
        if (key in target.data) {
            return target.data[key];
        } else {
            return target[key];
        }
    }
};

export {
    nodeProxy
};
