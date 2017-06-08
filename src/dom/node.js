"use strict";

import {
    cloneArray,
    flattenArray
} from "../util";
import {
    hasDirectives,
} from "./directive";

/**
 * Maps trough nodelist and filters output
 * @param {NodeList} nodelist
 * @param {Function} fn
 * @returns {Array}
 */
const mapFilterNodeList = (nodelist, fn) => cloneArray(nodelist).map(fn).filter(val => val !== null);

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
        if (hasDirectives(child)) {
            //-> Recurse
            return new AxonNode(child, element);
        } else if (child.children.length > 0) {
            //-> Enter Children
            return mapFilterNodeList(child.children, recurseSubNodes);
        } else {
            //-> Exit dead-end
            return null;
        }
    };

    return flattenArray(mapFilterNodeList(element.children, recurseSubNodes));
};

export {
    mapFilterNodeList,
    getSubNodes
};
