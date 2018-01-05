/**
 * Runs a method in the given context
 *
 * @private
 * @param {Object} methodProp
 * @param {Array<any>} [additionalArgs=[]]
 * @returns {any}
 */
declare const applyMethodContext: (methodProp: any, additionalArgs?: any[]) => any;
/**
 * Parses Literal String
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @returns {any}
 */
declare const evalLiteralFromNode: (expression: any, node: any) => any;
/**
 * Redirects to fitting retriever and returns
 *
 * @private
 * @param {string} name
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any}
 */
declare const evalDirective: (name: any, node: any, allowUndefined?: boolean) => any;
/**
 * Retrieves a prop from the data container
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any|null}
 */
declare const evalProp: (expression: any, node: any, allowUndefined?: boolean) => any;
/**
 * Retrieves a method from the method container
 *
 * @private
 * @param {string} expression
 * @param {AxonNode} node
 * @param {boolean} [allowUndefined=false]
 * @returns {any|null}
 */
declare const evalMethod: (expression: any, node: any, allowUndefined?: boolean) => any;
export { applyMethodContext, evalLiteralFromNode, evalDirective, evalMethod, evalProp };
