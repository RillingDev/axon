// @TODO: fix duplicate imports
import {
    getPathFull,
    getStringLiteral,
    mapLiteral,
    REGEX_GET_FUNCTION_CALL_ARGS,
    REGEX_IS_FUNCTION_CALL,
    REGEX_IS_STRING_LITERAL
} from "pseudo-eval";
import { isDefined } from "lightdash";
import { IAxonNode } from "../interfaces";

/**
 * Handles not-found properties
 *
 * @private
 * @param {string} propName
 * @param {boolean} allowUndefined
 * @returns {false|void}
 */
const handleMissingProp = (propName: string, allowUndefined: boolean) => {
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
const applyMethodContext = (methodProp: any, additionalArgs: any[] = []) =>
    methodProp.val.apply(methodProp.node.data, [
        ...methodProp.args,
        ...additionalArgs
    ]);

/**
 * Parses Literal String
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @returns {any}
 */
const evalLiteralFromNode = (expression: string, node: IAxonNode) => {
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
const evalDirective = (
    name: string,
    node: IAxonNode,
    allowUndefined: boolean = false
) => {
    if (REGEX_IS_FUNCTION_CALL.test(name)) {
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
const evalProp = (
    expression: string,
    node: IAxonNode,
    allowUndefined: boolean = false
) => {
    let current = node;

    while (current) {
        const data = getPathFull(current.data, expression, true);

        if (data !== null) {
            data.node = current;

            return data;
        }

        // @ts-ignore
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
const evalMethod = (
    expression: string,
    node: IAxonNode,
    allowUndefined: boolean = false
) => {
    const matched = expression.match(REGEX_GET_FUNCTION_CALL_ARGS);
    // @ts-ignore
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    // @ts-ignore
    const data = getPathFull(node.$app.methods, matched[1], true);

    if (data !== null) {
        data.args = args.map((arg: string) => evalLiteralFromNode(arg, node));
        data.node = node.$app.$entry;

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
