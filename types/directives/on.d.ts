import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-on init directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveOnInit: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveOnInit };
