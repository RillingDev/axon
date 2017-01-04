"use strict";

import isDefined from "../lib/isDefined";

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

        if (isDefined("undefined")) {

            if (index < splitExpression.length - 1) {
                container = prop;
            } else {
                result.val = prop;
                result.reference = container;
            }
        } else {
            throw new Error(`Property not found: '${expression}'`);
        }
    });

    return result;
};

export default retrieveProp;
