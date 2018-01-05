import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-text render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveTextRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveTextRender };
