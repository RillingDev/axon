import { IAxonDirective } from "../interfaces";
/**
 * Sets a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @param {string} value
 */
declare const setDirective: (element: HTMLElement, key: string, value: string) => void;
/**
 * Gets a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @returns {string}
 */
declare const getDirective: (element: HTMLElement, key: string) => string;
/**
 * Checks a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @returns {boolean}
 */
declare const hasDirective: (element: HTMLElement, key: string) => boolean;
/**
 * Removes a directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 */
declare const removeDirective: (element: HTMLElement, key: string) => void;
/**
 * Returns array of all directives
 *
 * @private
 * @param {Element} element
 * @returns {Array<Directive>}
 */
declare const getDirectives: (element: HTMLElement) => Attr[];
/**
 * Checks if the element has any directives
 *
 * @private
 * @param {Element} element
 * @returns {boolean}
 */
declare const hasDirectives: (element: HTMLElement) => boolean;
/**
 * Returns directives on node with name parsed
 *
 * @private
 * @param {Element} element
 * @returns {Array<Object>}
 */
declare const parseDirectives: (element: HTMLElement) => IAxonDirective[];
export { setDirective, getDirective, hasDirective, removeDirective, getDirectives, hasDirectives, parseDirectives };
