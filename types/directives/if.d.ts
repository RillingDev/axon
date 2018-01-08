import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-if directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveIfRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveIfRender };
