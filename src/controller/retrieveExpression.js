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
const evaluateExpression = function (name, node) {
    if (REGEX_FUNCTION.test(name)) {
        const methodProp = retrieveMethod(name, node);

        methodProp.val = methodProp.val.apply(node._root, methodProp.args);

        return methodProp;
    } else {
        return retrieveProp(name, node);
    }
};

export default evaluateExpression;
