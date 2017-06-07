"use strict";

import {
    DOM_ATTR_PREFIX
} from "../constants";
import {
    cloneArray,
    flattenArray
} from "../util";

/**
 * Checks if the element has any directives
 * @param {Element} element
 * @returns {Boolean}
 */
const hasDirectives = element => cloneArray(element.attributes).some(attr => attr.name.startsWith(DOM_ATTR_PREFIX));

/**
 * maps trough nodelist and filters output
 * @param {NodeList} nodelist
 * @param {Function} fn
 * @returns {Array}
 */
const mapFilterNodeList = (nodelist, fn) => cloneArray(nodelist).map(item => fn(item)).filter(val => val !== null);

/**
 * Returns deep-children
 * @param {Element} element
 * @returns {AxonNode}
 */
const getSubNodes = function (element, AxonNode) {
    /**
     * Recurse and map subNodes
     * @param {Element} child
     * @returns {Mixed}
     */
    const recurseSubNodes = child => {
        //console.log([child]);
        if (hasDirectives(child)) {
            return new AxonNode(child, element);
        } else if (child.children.length > 0) {
            return mapFilterNodeList(child.children, recurseSubNodes);
        } else {
            return null;
        }
    };

    return flattenArray(mapFilterNodeList(element.children, recurseSubNodes));
};

export {
    hasDirectives,
    mapFilterNodeList,
    getSubNodes
};
