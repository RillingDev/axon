"use strict";

import {
    DOM_ATTR_PREFIX,
    DOM_ATTR_DELIMITER
} from "../constants";
import {
    cloneArray,
} from "../util";

/**
 * Checks if the element has any directives
 * @param {Element} element
 * @returns {Boolean}
 */
const hasDirectives = element => cloneArray(element.attributes).some(attr => attr.name.startsWith(DOM_ATTR_PREFIX));

/**
 * Returns directives on node
 * @param {Element} element
 * @returns {Array}
 */
const getDirectives = function (element) {
    const attributes = cloneArray(element.attributes).filter(attr => attr.name.startsWith(DOM_ATTR_PREFIX));

    return attributes.map(attr => {
        /**
         * 'x-bind:hidden="foo"' => nameFull=["bind","hidden"] val="foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);
        const val = attr.value;

        return {
            val,
            name: nameFull[0],
            secondary: nameFull[1] || false,
        };
    });
};

export {
    hasDirectives,
    getDirectives
};
