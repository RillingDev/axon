import {
    isObjectLike,
    forEachEntry,
} from "lightdash";


/**
 * Creates a Proxy object with the node render method bound
 *
 * @private
 * @param {AxonNode} node
 * @returns {Object}
 */
const dataProxyFactory = function (node) {
    return {
        set: (target, key, val) => {
            if (val !== target[key]) {
                target[key] = val;

                node.render();
            }

            return true;
        }
    };
};

/**
 * Recursively iterates over an object and attaches proxy on on all obvject-like props
 *
 * @private
 * @param {Object} obj
 * @param {Object} proxyObj
 * @returns {Proxy}
 */
const mapProxy = (obj, proxyObj) => {
    const result = obj;

    forEachEntry(result, (val, key) => {
        if (isObjectLike(val)) {
            result[key] = mapProxy(val, proxyObj);
        }
    });

    return new Proxy(obj, proxyObj);
};

/**
 * Binds data-proxy
 *
 * @param {Object} obj
 * @param {AxonNode} node
 * @returns {Proxy}
 */
const bindDeepDataProxy = (obj, node) => mapProxy(obj, dataProxyFactory(node));

export {
    bindDeepDataProxy
};
