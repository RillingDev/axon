"use strict";

import {
    TYPE_NAME_UNDEFINED
} from "../lib/constants";

const retrieveProp = function (instance, expression) {
    const splitExpression = expression.split(".");
    const result = {
        val: null,
        reference: null
    };
    let container = instance.$data;
    let prop;

    splitExpression.forEach((propPath, index) => {
        prop = container[propPath];

        if (typeof prop !== TYPE_NAME_UNDEFINED) {

            if (index < splitExpression.length - 1) {
                container = prop;
            } else {
                result.val = prop;
                result.reference = container;
            }
        } else {
            throw new Error(`prop '${expression}' not found`);
        }
    });

    return result;
};

export default retrieveProp;
