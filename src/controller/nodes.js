import AxonNode from "../axonNode";
import {
    arrClone,
    arrFlattenDeep
} from "lightdash";
import {
    hasDirectives
} from "../dom/directive";

/**
 * Recursively gets all subnodes
 *
 * @param {AxonNode} node
 * @param {ElementList} children
 * @returns {Array}
 */
const getSubNodes = function (children, node) {
    /**
     * Iterate over a single child DOM element
     *
     * @param {Element} child
     * @returns {AxonNode|null}
     */
    const recurseSubNodes = function (child) {
        if (hasDirectives(child)) {
            //-> Recurse
            return new AxonNode(child, node);
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
     *
     * @param {Array} children
     * @returns {Array}
     */
    const mapSubNodes = children => arrFlattenDeep(arrClone(children).map(recurseSubNodes).filter(val => val !== null));

    return mapSubNodes(children);
};

/**
 * Gets the topmost node
 *
 * @param {Node} node
 * @returns {Node}
 */
const getNodeRoot = function (node) {
    let result = node;

    while (result.$parent !== null) {
        result = result.$parent;
    }

    return result;
};

export {
    getSubNodes,
    getNodeRoot
};
