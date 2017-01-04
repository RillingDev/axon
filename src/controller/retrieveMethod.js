"use strict";

import {
    TYPE_NAME_FUNCTION
} from "../lib/constants";
import evaluateExpression from "./evaluateExpression";

const retrieveMethod = function (instance, expression) {
    const expressionSplit = expression.substr(0, expression.length - 1).split("(");
    const methodName = expressionSplit[0];
    const methodArgs = expressionSplit[1].split(",").filter(item => item !== "").map(arg => {
        return evaluateExpression(instance, arg);
    });
    const methodFn = instance.$methods[methodName];

    if (typeof methodFn === TYPE_NAME_FUNCTION) {
        return {
            fn: methodFn,
            args: methodArgs
        };
    } else {
        throw new Error(`method '${methodName}' is not a function`);
    }
};

export default retrieveMethod;
