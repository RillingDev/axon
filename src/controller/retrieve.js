"use strict";

import {
    findPath,
    mapArg
} from "./parse";
import {
    isDefined
} from "../util";

//@TODO test those
const REGEX_IS_FUNCTION = /\(.*\)/;
const REGEX_CONTENT_METHOD = /([\w\.]+)\s*\(((?:[^()]*)*)?\s*\)/;

/**
 * Creates a new missing-prop error
 * @param {String} propName
 * @returns {Error}
 */
const missingPropErrorFactory = propName => new Error(`missing prop/method '${propName}'`);

/**
 * Runs a method in the given context
 * @param {Object} methodProp
 * @returns {Mixed}
 */
const applyMethodContext = methodProp => methodProp._val.apply(methodProp._node, methodProp._args);

/**
 * Gets the topmost node
 * @param {Node} node
 * @returns {Node}
 */
const getNodeRoot = function (node) {
    let result = node;

    while (result._parent !== null) {
        result = result._parent;
    }

    return result;
};

/**
 * Redirects to fitting retriever and returns
 * @param {String} name
 * @param {Axon} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed}
 */
const retrieveExpression = function (name, node, allowUndefined = false) {
    if (REGEX_IS_FUNCTION.test(name)) {
        const method = retrieveMethod(name, node, allowUndefined);
        const methodResult = applyMethodContext(method);

        return {
            _node: method.node,
            _val: methodResult
        };
    } else {
        return retrieveProp(name, node, allowUndefined);
    }
};

/**
 * Retrieves a prop from the data container
 * @param {String} expression
 * @param {AxonNode} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed|false}
 */
const retrieveProp = function (expression, node, allowUndefined = false) {
    let current = node;

    while (current && current._parent !== false) {
        const data = findPath(current.data, expression);

        if (data !== false) {
            data._node = current;

            return data;
        } else {
            current = current._parent;
        }
    }

    if (allowUndefined) {
        return false;
    } else {
        throw missingPropErrorFactory(expression);
    }
};

/**
 * Retrieves a method from the method container
 * @param {String} expression
 * @param {AxonNode} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed|false}
 */
const retrieveMethod = function (expression, node, allowUndefined = false) {
    const matched = expression.match(REGEX_CONTENT_METHOD);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const _root = getNodeRoot(node);
    const data = findPath(_root.methods, matched[1]);

    if (data !== false) {
        data._args = args.map(arg => mapArg(arg, node));
        data._node = _root;

        return data;
    } else {
        if (allowUndefined) {
            return false;
        } else {
            throw missingPropErrorFactory(expression);
        }
    }
};

export {
    applyMethodContext,
    retrieveExpression,
    retrieveMethod,
    retrieveProp
};
