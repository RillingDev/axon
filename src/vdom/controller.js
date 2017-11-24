import REGEX_IS_STRING_LITERAL from "pseudo-eval/src/lib/regex/regexIsStringLiteral";
import REGEX_IS_FUNCTION from "pseudo-eval/src/lib/regex/regexIsFunction";
import REGEX_FUNCTION_CALL_CONTENT from "pseudo-eval/src/lib/regex/regexFunctionCallContent";
import getPath from "pseudo-eval/src/lib/get/getPath";
import getStringLiteral from "pseudo-eval/src/lib/get/getStringLiteral";
import mapLiteral from "pseudo-eval/src/lib/map/mapLiteral";
import {
    isDefined,
} from "lightdash";
import {
    getNodeRoot,
} from "./node";

/**
 * Handles not-found properties
 *
 * @private
 * @param {string} propName
 * @param {boolean} allowUndefined
 * @returns {false|void}
 */
const handleMissingProp = (propName, allowUndefined) => {
    if (!allowUndefined) {
        throw new Error(`missing prop/method '${propName}'`);
    } else {
        return false;
    }
};

/**
 * Runs a method in the given context
 *
 * @private
 * @param {Object} methodProp
 * @param {Array<any>} [additionalArgs=[]]
 * @returns {any}
 */
const applyMethodContext = (methodProp, additionalArgs = []) => methodProp.val.apply(
    methodProp.node.data, [...methodProp.args, ...additionalArgs]
);

/**
 * Parses Literal String
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @returns {any}
 */
const evalLiteralFromNode = (expression, node) => {
    let result = null;

    if (!isNaN(Number(expression))) {
        result = Number(expression);
    } else if (REGEX_IS_STRING_LITERAL.test(expression)) {
        result = getStringLiteral(expression);
    } else if (mapLiteral.has(expression)) {
        result = mapLiteral.get(expression);
    } else {
        result = evalProp(expression, node).val;
    }

    return result;
};

/**
 * Redirects to fitting retriever and returns
 *
 * @private
 * @param {string} name
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any}
 */
const evalDirective = (name, node, allowUndefined = false) => {
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
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any|null}
 */
const evalProp = (expression, node, allowUndefined = false) => {
    let current = node;

    while (current) {
        const data = getPath(current.data, expression, true);

        if (data !== null) {
            data.node = current;

            return data;
        }

        current = current.$parent;
    }

    return handleMissingProp(expression, allowUndefined);
};

/**
 * Retrieves a method from the method container
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any|null}
 */
const evalMethod = (expression, node, allowUndefined = false) => {
    const matched = expression.match(REGEX_FUNCTION_CALL_CONTENT);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const root = getNodeRoot(node);
    const data = getPath(root.methods, matched[1], true);

    if (data !== null) {
        data.args = args.map(arg => evalLiteralFromNode(arg, node));
        data.node = root;

        return data;
    } else {
        return handleMissingProp(expression, allowUndefined);
    }
};

export {
    applyMethodContext,
    evalLiteralFromNode,
    evalDirective,
    evalMethod,
    evalProp
};
