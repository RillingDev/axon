"use strict";

import isDefined from "../lib/isDefined";

const retrieveProp = function (instance, expression) {
    const splitExpression = expression.split(".");
    const result = {
        val: null,
        ref: null
    };
    let container = instance.$data;
    let prop;

    splitExpression.forEach((propPath, index) => {
        prop = container[propPath];

        if (isDefined(prop)) {

            if (index < splitExpression.length - 1) {
                container = prop;
            } else {
                result.val = prop;
                result.ref = container;
            }
        } else {
            throw new Error(`Missing prop '${expression}'`);
        }
    });

       //console.log(expression,result);

    return result;
};

export default retrieveProp;
