"use strict";

/**
 * Handles node->node.data redirects
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
    },
    /**
     * Redirect setting to data
     * @param {Object} target
     * @param {String} key
     * @param {Mixed} val
     * @returns {Boolean}
     */
    set: (target, key, val) => {
        if (!(key in target)) {
            target.data[key] = val;
        } else {
            target[key] = val;
        }

        return true;
    }
};

export {
    nodeProxy
};
