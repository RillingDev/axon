import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-for init directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveForInit: (directive: IAxonDirective, element: HTMLElement) => boolean;
/**
 * v-for render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveForRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveForInit, directiveForRender };
