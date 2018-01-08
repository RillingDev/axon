import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-on init directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveOnInit: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveOnInit };
