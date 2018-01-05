import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-for init directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveForInit: (directive: IAxonDirective, element: HTMLElement) => boolean;
/**
 * v-for render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveForRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveForInit, directiveForRender };
