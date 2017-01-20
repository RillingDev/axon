"use strict";

import {
    LIB_STRING_QUOTES
} from "../lib/constants";
import retrieveMethod from "./retrieveMethod";
import retrieveProp from "./retrieveProp";

/**
 * evaluates expression from Axon instance
 * @private
 * @param {Axon} instanceData Axon instance
 * @param {String} expression Directive expression
 * @returns {Mixed} value of expression
 */
const evaluateExpression = function (instanceData, expression) {

    if (!isNaN(Number(expression))) {
        //expression is a Number
        return Number(expression);
    } else if (LIB_STRING_QUOTES.includes(expression.substr(0, 1))) {
        //expression is a String
        return expression.substr(1, expression.length - 2);
    } else if (expression.substr(expression.length - 1) === ")") {
        //expression is a Method
        const method = retrieveMethod(instanceData.$methods, expression);

        return method.fn.apply(instanceData, method.args);
    } else {
        //expression is a Property
        return retrieveProp(instanceData.$data, expression).val;
    }
};

export default evaluateExpression;
