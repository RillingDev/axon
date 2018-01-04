import {
    DOM_ATTR_PREFIX,
    DOM_ATTR_DELIMITER
} from "../constants";
import {
    arrFrom,
} from "lightdash";
import { IAxonDirective } from "../interfaces";

/**
 * Sets a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @param {string} value
 */
const setDirective = (element: HTMLElement, key: string, value: string) =>
    element.setAttribute(DOM_ATTR_PREFIX + key, value);

/**
 * Gets a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @returns {string}
 */
const getDirective = (element: HTMLElement, key: string) =>
    element.getAttribute(DOM_ATTR_PREFIX + key);

/**
 * Checks a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @returns {boolean}
 */
const hasDirective = (element: HTMLElement, key: string) =>
    element.hasAttribute(DOM_ATTR_PREFIX + key);

/**
 * Removes a directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 */
const removeDirective = (element: HTMLElement, key: string) =>
    element.removeAttribute(DOM_ATTR_PREFIX + key);

/**
 * Checks if an attribute is an axon directive
 *
 * @private
 * @param {Attribute} attr
 * @returns {boolean}
 */
const isDirective = (attr: Attr) => attr.name.startsWith(DOM_ATTR_PREFIX);

/**
 * Returns array of all directives
 *
 * @private
 * @param {Element} element
 * @returns {Array<Directive>}
 */
const getDirectives = (element: HTMLElement) =>
    arrFrom(element.attributes).filter(isDirective);

/**
 * Checks if the element has any directives
 *
 * @private
 * @param {Element} element
 * @returns {boolean}
 */
const hasDirectives = (element: HTMLElement) => getDirectives(element).length > 0;

/**
 * Returns directives on node with name parsed
 *
 * @private
 * @param {Element} element
 * @returns {Array<Object>}
 */
const parseDirectives = (element: HTMLElement): IAxonDirective[] => getDirectives(element)
    .map((attr: Attr) => {
        /**
         * 'x-bind:hidden="foo"' => nameFull = ["bind", "hidden"], val = "foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);

        return {
            name: nameFull[0],
            opt: nameFull[1] || "",
            content: attr.value,
        };
    });

export {
    setDirective,
    getDirective,
    hasDirective,
    removeDirective,

    getDirectives,
    hasDirectives,
    parseDirectives,
};
