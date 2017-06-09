"use strict";

import {isDefined} from "../util";

const findPropInNode = function (path, node) {
    let entry = node.data;
    let current;
    let index = 0;

    while (index < path.length) {
        const propPath = path[index];

        current = entry[propPath];

        if (isDefined(current)) {
            if (index < path.length - 1) {
                entry = current;
            } else {
                return {
                    node,
                    val: current,
                    set: val => entry[propPath] = val
                };
            }
        }

        index++;
    }

    return false;
};

/**
 * Gets property from Axon instance
 * @private
 * @param {Object} instanceContentMethods Axon instance data container
 * @param {String} expression Directive expression
 * @returns {Mixed} property of instance
 */
const retrieveProp = function (expression, node) {
    const path = expression.split(".");
    let endReached = false;
    let walker = node;

    while (!endReached) {
        const data = findPropInNode(path, walker);

        if (data) {
            return data;
        } else {
            if (walker._parent !== false) {
                walker = walker._parent;
            } else {
                endReached = true;
            }
        }
    }

    return false;
};

export default retrieveProp;
