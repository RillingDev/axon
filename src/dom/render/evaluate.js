"use strict";

import {replaceFrom} from "../../util";

/**
 * calculates Expression
 *
 * @private
 * @param {Object} ctrl The Controller
 * @param {Object} expression The Expression
 * @return void
 */
export default function(ctrl, expression) {
    const result = ctrl[expression.data];
    //console.log([ctrl, expression.data, ctrl[expression.data]]);


    //console.log(["!!!!!!!!!!!!!", expression.val, result]);
    expression.parent.textContent = replaceFrom(expression.parent.textContent, expression.val, result, expression.index);

    expression.val = result;

    return result;
}
