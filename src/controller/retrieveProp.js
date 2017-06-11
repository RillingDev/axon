"use strict";

import findPropInNode from "./findPropInNode";

/**
 * Retrieves a prop from the data container
 * @param {String} expression
 * @param {AxonNode} node
 * @returns {Mixed|false}
 */
const retrieveProp = function(expression, node) {
    const path = expression.split(".");
    let endReached = false;
    let current = node;

    //console.log("&", [node, path]);

    while (!endReached) {
        const data = findPropInNode(path, current.data);

        if (data !== false) {
            data.node = current;

            return data;
        } else {
            if (current._parent !== false) {
                current = current._parent;
            } else {
                endReached = true;
            }
        }
    }

    return false;
};

export default retrieveProp;