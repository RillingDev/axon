import REGEX_IS_STRING_LITERAL from "pseudo-eval/src/lib/regexIsStringLiteral";
import {
    isDefined,
    mapFromObject,
    isStringNumber
} from "lightdash";
import {
    getNodeRoot,
} from "./nodes";
import getPath from "pseudo-eval/src/lib/getPath";
import getStringLiteral from "pseudo-eval/src/lib/getStringLiteral";

const REGEX_IS_FUNCTION = /^.+\(.*\)$/;
const REGEX_CONTENT_METHOD = /([\w.]+)\s*\(((?:[^()]*)*)?\s*\)/;

const mapLiterals = mapFromObject({
    "false": false,
    "true": true,
    "null": null
});

/**
 * Creates a new missing-prop error
 *
 * @param {String} propName
 * @returns {Error}
 */
const missingPropErrorTextFactory = propName => `missing prop/method '${propName}'`;

/**
 * Runs a method in the given context
 *
 * @param {Object} methodProp
 * @returns {Mixed}
 */
const applyMethodContext = (methodProp, additionalArgs = []) => methodProp.val.apply(
    methodProp.node.data, [...methodProp.args, ...additionalArgs]
);

/**
 * Parses Literal String
 *
 * @param {String} expression
 * @param {AxonNode} node
 * @returns {Mixed}
 */
const evalLiteralFromNode = function (expression, node) {
    let result = null;

    if (isStringNumber(expression)) {
        result = Number(expression);
    } else if (REGEX_IS_STRING_LITERAL.test(expression)) {
        result = getStringLiteral(expression);
    } else if (mapLiterals.has(expression)) {
        result = mapLiterals.get(expression);
    } else {
        result = evalProp(expression, node).val;
    }

    return result;
};

/**
 * Redirects to fitting retriever and returns
 *
 * @param {String} name
 * @param {Axon} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed}
 */
const evalDirective = function (name, node, allowUndefined = false) {
    if (REGEX_IS_FUNCTION.test(name)) {
        const method = evalMethod(name, node, allowUndefined);
        const methodResult = applyMethodContext(method);

        return {
            node: method.node,
            val: methodResult
        };
    } else {
        return evalProp(name, node, allowUndefined);
    }
};

/**
 * Retrieves a prop from the data container
 *
 * @param {String} expression
 * @param {AxonNode} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed|null}
 */
const evalProp = function (expression, node, allowUndefined = false) {
    let current = node;

    while (current) {
        const data = getPath(current.data, expression, true);

        if (data !== null) {
            data.node = current;

            return data;
        } else {
            current = current.$parent;
        }
    }

    if (allowUndefined) {
        return null;
    } else {
        throw new Error(missingPropErrorTextFactory(expression));
    }
};

/**
 * Retrieves a method from the method container
 *
 * @param {String} expression
 * @param {AxonNode} node
 * @param {Boolean} allowUndefined
 * @returns {Mixed|null}
 */
const evalMethod = function (expression, node, allowUndefined = false) {
    const matched = expression.match(REGEX_CONTENT_METHOD);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const root = getNodeRoot(node);
    const data = getPath(root.methods, matched[1], true);

    if (data !== null) {
        data.args = args.map(arg => evalLiteralFromNode(arg, node));
        data.node = root;

        return data;
    }

    if (allowUndefined) {
        return null;
    } else {
        throw new Error(missingPropErrorTextFactory(expression));
    }
};

export {
    applyMethodContext,
    evalLiteralFromNode,
    evalDirective,
    evalMethod,
    evalProp
};
