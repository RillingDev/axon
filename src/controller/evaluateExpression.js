"use strict";

import {
    LIB_STRING_QUOTES
} from "../lib/constants";
import retrieveMethod from "./retrieveMethod";
import retrieveProp from "./retrieveProp";

const evaluateExpression = function (instance, expression) {
    if (!isNaN(Number(expression))) {
        //expression is a Number
        return Number(expression);
    } else if (LIB_STRING_QUOTES.includes(expression.substr(0, 1))) {
        //expression is a String
        return expression.substr(1, expression.length - 2);
    } else if (expression.substr(expression.length - 1) === ")") {
        //expression is a Method
        return retrieveMethod(instance, expression);
    } else {
        //expression is a Property
        return retrieveProp(instance, expression);
    }
};

export default evaluateExpression;
