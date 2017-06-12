"use strict";

import {
    cloneArray,
    flattenArray
} from "../util";
import {
    hasDirectives
} from "./directive";

/**
 * Recursively gets all subnodes
 * @param {AxonNode} node
 * @param {ElementList} children
 * @param {class} AxonNode
 * @returns {Array}
 */
const getSubNodes = function (node, children, AxonNode) {
    /**
     * Iterate over a single child DOM element
     * @param {Element} child
     * @returns {AxonNode|null}
     */
    const recurseSubNodes = function (child) {
        if (hasDirectives(child)) {
            //-> Recurse
            return new AxonNode(child, node, {});
        } else if (child.children.length > 0) {
            //-> Enter Children
            return mapSubNodes(child.children);
        } else {
            //-> Exit dead-end
            return null;
        }
    };
    /**
     * Maps and processes Array of children
     * @param {Array} children
     * @returns {Array}
     */
    const mapSubNodes = children => flattenArray(cloneArray(children).map(recurseSubNodes).filter(val => val !== null));

    return mapSubNodes(children);
};

export {
    getSubNodes
};
