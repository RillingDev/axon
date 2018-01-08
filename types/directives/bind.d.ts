import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-bind render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveBindRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveBindRender };
