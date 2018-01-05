import { IAxonNode } from "../interfaces";
/**
 * Binds data-proxy
 *
 * @private
 * @param {Object} obj
 * @param {AxonNode} node
 * @returns {Proxy}
 */
declare const bindDeepDataProxy: (obj: object, node: IAxonNode) => any;
export { bindDeepDataProxy };
