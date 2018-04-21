import { forEachEntry, isObject } from "lightdash";
import { EDirectiveFn } from "../enums";
import { IAxonNode, IGenericObject } from "../interfaces";

/**
 * Creates a Proxy object with the node render method bound
 *
 * @private
 * @param {AxonNode} node
 * @returns {Object}
 */
const dataProxyFactory = (node: IAxonNode): object => {
    return {
        set: (target: IGenericObject, key: string, val: any) => {
            if (val !== target[key]) {
                target[key] = val;

                node.run(EDirectiveFn.render);
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
const mapProxy = (
    obj: IGenericObject,
    proxyObj: object
): ProxyHandler<object> => {
    const result = obj;

    forEachEntry(result, (key: string, val: any) => {
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
const bindDeepDataProxy = (
    obj: object,
    node: IAxonNode
): ProxyHandler<object> => mapProxy(obj, dataProxyFactory(node));

export { bindDeepDataProxy };
