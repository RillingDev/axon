"use strict";

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

    console.log(expression.val, result);
    expression.parent.textContent = expression.parent.textContent.replace(expression.val, result);
    expression.val = result;

    return result;
}
