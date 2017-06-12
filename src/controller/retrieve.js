"use strict";

const REGEX_IS_FUNCTION = /\(.*\)/;
const REGEX_CONTENT_METHOD = /([\w\.]+)\s*\(((?:[^()]+)*)?\s*\)\s*/;

import {
    isDefined
} from "../util";

const getNodeRoot = function (node) {
    let result = node;

    while (result._parent !== null) {
        result = result._parent;
    }

    return result;
};

const findPropInNode = function (path, obj) {
    let entry = obj;
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
                    val: current,
                    set: val => entry[propPath] = val
                };
            }
        }

        index++;
    }

    return false;
};

const applyContext = methodProp => methodProp.val.apply(methodProp.node.data, methodProp.args);

/**
 * Redirects to fitting retriever and returns
 * @param {String} name
 * @param {Axon} node
 * @returns {Mixed}
 */
const retrieveExpression = function (name, node) {
    if (REGEX_IS_FUNCTION.test(name)) {
        const methodProp = retrieveMethod(name, node);

        //Call method with context set to rootnode data
        return applyContext(methodProp);
    } else {
        return retrieveProp(name, node);
    }
};

/**
 * Retrieves a prop from the data container
 * @param {String} expression
 * @param {AxonNode} node
 * @returns {Mixed|false}
 */
const retrieveProp = function (expression, node) {
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

//@TODO
const retrieveMethod = function (expression, node) {
    const matched = expression.match(REGEX_CONTENT_METHOD);
    const path = matched[1].split(".");
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const _root = getNodeRoot(node);

    const data = findPropInNode(path, _root.methods);

    if (data !== false) {
        data.args = args;
        data.node = _root;

        return data;
    } else {
        return false;
    }
};

export {
    retrieveExpression,
    retrieveMethod,
    retrieveProp
};
