"use strict";

const REGEX_FUNCTION = /\(.*\)/;

import retrieveMethod from "./retrieveMethod";
import retrieveProp from "./retrieveProp";

/**
 * Redirects to fitting retriever and returns
 * @param {String} name
 * @param {Axon} node
 * @returns {Mixed}
 */
const evaluateExpression = (name, node) => REGEX_FUNCTION.test(name) ? retrieveMethod(name, node) : retrieveProp(name, node);

export default evaluateExpression;
