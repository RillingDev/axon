import {
    DOM_ATTR_PREFIX,
    DOM_ATTR_DELIMITER
} from "../constants";
import {
    arrFrom,
} from "lightdash";

/**
 * Sets a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @param {string} value
 */
const setDirective = (element: any, key: any, value: any) => element.setAttribute(DOM_ATTR_PREFIX + key, value);

/**
 * Gets a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @returns {string}
 */
const getDirective = (element: any, key: any) => element.getAttribute(DOM_ATTR_PREFIX + key);

/**
 * Checks a value as directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 * @returns {boolean}
 */
const hasDirective = (element: any, key: any) => element.hasAttribute(DOM_ATTR_PREFIX + key);

/**
 * Removes a directive
 *
 * @private
 * @param {Element} element
 * @param {string} key
 */
const removeDirective = (element: any, key: any) => element.removeAttribute(DOM_ATTR_PREFIX + key);

/**
 * Checks if an attribute is an axon directive
 *
 * @private
 * @param {Attribute} attr
 * @returns {boolean}
 */
const isDirective = (attr: any) => attr.name.startsWith(DOM_ATTR_PREFIX);

/**
 * Returns array of all directives
 *
 * @private
 * @param {Element} element
 * @returns {Array<Directive>}
 */
const getDirectives = (element: any) => arrFrom(element.attributes).filter(isDirective);

/**
 * Checks if the element has any directives
 *
 * @private
 * @param {Element} element
 * @returns {boolean}
 */
const hasDirectives = (element: any) => getDirectives(element).length > 0;

/**
 * Returns directives on node with name parsed
 *
 * @private
 * @param {Element} element
 * @returns {Array<Object>}
 */
const parseDirectives = (element: any) => getDirectives(element)
    .map((attr: any) => {
        /**
         * 'x-bind:hidden="foo"' => nameFull = ["bind", "hidden"], val = "foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);

        return {
            name: nameFull[0],
            opt: nameFull[1] || false,
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
