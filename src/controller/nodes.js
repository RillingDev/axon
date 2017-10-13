import AxonNode from "../axonNode";
import {
    arrClone,
    arrFlattenDeep
} from "lightdash";
import {
    hasDirectives
} from "../dom/directive";

/**
 * Gets the topmost node
 *
 * @param {AxonNode} node
 * @returns {AxonNode}
 */
const getNodeRoot = function (node) {
    let result = node;

    while (result.$parent !== null) {
        result = result.$parent;
    }

    return result;
};

/**
 * Maps and processes Array of element children
 *
 * @param {Array} children
 * @param {AxonNode} node
 * @returns {Array}
 */
const mapSubNodes = (children, node) => arrFlattenDeep(arrClone(children)
    .map(child => {
        if (hasDirectives(child)) {
            //-> Recurse
            return new AxonNode(child, node);
        } else if (child.children.length > 0) {
            //-> Enter Children
            return mapSubNodes(child.children, node);
        } else {
            //-> Exit dead-end
            return null;
        }
    })
    .filter(val => val !== null));

export {
    mapSubNodes,
    getNodeRoot
};
