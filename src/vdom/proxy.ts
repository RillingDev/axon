import {
    isObject,
    forEachEntry,
} from "lightdash";
import { IAxonNode, IGenericObject } from "../interfaces";

/**
 * Creates a Proxy object with the node render method bound
 *
 * @private
 * @param {AxonNode} node
 * @returns {Object}
 */
const dataProxyFactory = (node: IAxonNode) => {
    return {
        set: (target: IGenericObject, key: string, val: any) => {
            if (val !== target[key]) {
                target[key] = val;

                node.render();
            }

            return true;
        }
    };
};

/**
 * Recursively iterates over an object and attaches proxy on on all object-like props
 *
 * @private
 * @param {Object} obj
 * @param {Object} proxyObj
 * @returns {Proxy}
 */
const mapProxy = (obj: IGenericObject, proxyObj: object): any => {
    const result = obj;

    forEachEntry(result, (val: any, key: string) => {
        if (isObject(val)) {
            result[key] = mapProxy(val, proxyObj);
        }
    });

    return new Proxy(obj, proxyObj);
};

/**
 * Binds data-proxy
 *
 * @private
 * @param {Object} obj
 * @param {AxonNode} node
 * @returns {Proxy}
 */
const bindDeepDataProxy = (obj: object, node: IAxonNode): any => mapProxy(obj, dataProxyFactory(node));

export {
    bindDeepDataProxy
};
