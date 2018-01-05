import { IAxonDirective, IAxonNode } from "../interfaces";
/**
 * v-model init directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveModelInit: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
/**
 * v-model render directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
declare const directiveModelRender: (directive: any, element: any, node: any) => boolean;
export { directiveModelInit, directiveModelRender };
