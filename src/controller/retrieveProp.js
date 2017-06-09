"use strict";

import {isDefined} from "../util";

/**
 * Gets property from Axon instance
 * @private
 * @param {Object} instanceContentMethods Axon instance data container
 * @param {String} expression Directive expression
 * @returns {Mixed} property of instance
 */
const retrieveProp = function (expression, node) {
    const splitExpression = expression.split(".");
    let result = false;
    let foundResult = false;
    let mustExit = false;
    let walker = node;
    let prop;

    while (!foundResult && !mustExit) { //Node-level
        let index = 0;

        console.log("ND", {walker});

        while (!foundResult && index < splitExpression.length) { //prop-level
            const propPath = splitExpression[index];

            console.log("PR", {walker, propPath, index});

            prop = walker.data[propPath];

            if (isDefined(prop)) {
                if (index < splitExpression.length - 1) {
                    walker = prop;
                } else {
                    result = {
                        val: prop,
                        ref: walker
                    };

                    console.log("RESULT", {result});

                    foundResult = true;
                }
            }

            index++;
        }

        if (walker._parent !== false) {
            walker = walker._parent;
        } else {
            mustExit = true;
        }
    }

    console.log()

    return result;
};

export default retrieveProp;
