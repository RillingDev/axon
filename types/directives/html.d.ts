import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-html render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveHTMLRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveHTMLRender };
