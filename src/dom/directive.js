"use strict";

import {
    DOM_ATTR_PREFIX,
    DOM_ATTR_DELIMITER
} from "../constants";
import {
    cloneArray,
} from "../util";

/**
 * Sets a value as directive
 * @param {Element} element
 * @param {String} key
 * @param {String} value
 */
const setDirective = (element, key, value) => element.setAttribute(DOM_ATTR_PREFIX + key, value);

/**
 * Gets a value as directive
 * @param {Element} element
 * @param {String} key
 * @returns {String}
 */
const getDirective = (element, key) => element.getAttribute(DOM_ATTR_PREFIX + key);

/**
 * Checks a value as directive
 * @param {Element} element
 * @param {String} key
 * @returns {Boolean}
 */
const hasDirective = (element, key) => element.hasAttribute(DOM_ATTR_PREFIX + key);

/**
 * Removes a directive
 * @param {Element} element
 * @param {String} key
 */
const removeDirective = (element, key) => element.removeAttribute(DOM_ATTR_PREFIX + key);

/**
 * Checks if an attribute is an axon directive
 * @param {Attribute} attr
 * @returns {Boolean}
 */
const isDirective = attr => attr.name.startsWith(DOM_ATTR_PREFIX);

/**
 * Returns array of all directives
 * @param {Element} element
 * @returns {Array}
 */
const getDirectives = element => cloneArray(element.attributes).filter(isDirective);

/**
 * Checks if the element has any directives
 * @param {Element} element
 * @returns {Boolean}
 */
const hasDirectives = element => getDirectives(element).length > 0;

/**
 * Returns directives on node with name parsed
 * @param {Element} element
 * @returns {Array}
 */
const parseDirectives = function (element) {
    return getDirectives(element).map(attr => {
        /**
         * 'x-bind:hidden="foo"' => nameFull=["bind","hidden"] val="foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);

        return {
            _content: attr.value,
            _name: nameFull[0],
            _opt: nameFull[1] || false,
        };
    });
};

export {
    setDirective,
    getDirective,
    hasDirective,
    removeDirective,

    getDirectives,
    hasDirectives,
    parseDirectives,
};
