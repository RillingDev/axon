import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-model init directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveModelInit: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
/**
 * v-model render directive
 *
 * @private
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveModelRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveModelInit, directiveModelRender };
