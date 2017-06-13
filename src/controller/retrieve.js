"use strict";

import {
    isDefined
} from "../util";

//@TODO test those
const REGEX_IS_FUNCTION = /\(.*\)/;
const REGEX_IS_NUMBER = /^[\d\.]+$/;
const REGEX_IS_STRING = /^'\w+'$/;
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
const applyMethodContext = methodProp => methodProp.val.apply(methodProp.node, methodProp.args);

/**
 * Parses expression args to "real" values
 *  @param {String} arg
 * @param {Node} node
 * @returns {Mixed}
 */
const mapArg = function (arg, node) {
    if (REGEX_IS_NUMBER.test(arg)) {
        return Number(arg);
    } else if (REGEX_IS_STRING.test(arg)) {
        return arg.substr(1, arg.length - 2);
    } else {
        return retrieveProp(arg, node);
    }
};

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
 * Finds a string-path as object property
 * @param {Object} obj
 * @param {String} path
 * @returns {Object|false}
 */
const findPath = function (obj, path) {
    const arr = path.split(".");
    let last = obj;
    let current;
    let index = 0;

    while (index < arr.length) {
        const currentPath = arr[index];

        current = last[currentPath];

        if (isDefined(current)) {
            if (index < arr.length - 1) {
                last = current;
            } else {
                return {
                    val: current,
                    con: last,
                    key: currentPath
                };
            }
        }

        index++;
    }

    return false;
};

/**
 * Redirects to fitting retriever and returns
 * @param {String} name
 * @param {Axon} node
 * @returns {Mixed}
 */
const retrieveExpression = function (name, node) {
    if (REGEX_IS_FUNCTION.test(name)) {
        const method = retrieveMethod(name, node);
        const methodResult = applyMethodContext(method);

        return {
            node: method.node,
            val: methodResult
        };
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
    let current = node;

    while (current && current._parent !== false) {
        const data = findPath(current.data, expression);

        if (data !== false) {
            data.node = current;

            return data;
        } else {
            current = current._parent;
        }
    }

    throw missingPropErrorFactory(expression);
};

/**
 * Retrieves a method from the method container
 * @param {String} expression
 * @param {AxonNode} node
 * @returns {Mixed|false}
 */
const retrieveMethod = function (expression, node) {
    const matched = expression.match(REGEX_CONTENT_METHOD);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const _root = getNodeRoot(node);
    const data = findPath(_root.methods, matched[1]);

    if (data !== false) {
        data.args = args.map(arg => mapArg(arg, node));
        data.node = _root;

        return data;
    } else {
        throw missingPropErrorFactory(expression);
    }
};

export {
    applyMethodContext,
    retrieveExpression,
    retrieveMethod,
    retrieveProp
};
