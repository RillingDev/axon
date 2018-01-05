import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-bind render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveBindRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveBindRender };
