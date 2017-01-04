"use strict";

import {
    TYPE_NAME_UNDEFINED
} from "../lib/constants";

const retrieveProp = function (instance, expression) {
    const splitExpression = expression.split(".");
    let prop = instance.$data;

    splitExpression.forEach(propPath => {
        prop = prop[propPath];
    });

    if (typeof prop === TYPE_NAME_UNDEFINED) {
        throw new Error(`prop '${expression}' not found`);
    } else {
        return prop;
    }
};

export default retrieveProp;
