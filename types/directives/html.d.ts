import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-html render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveHTMLRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveHTMLRender };
