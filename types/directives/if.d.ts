import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-if directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveIfRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveIfRender };
