"use strict";

import expressions from "../../plugins/expressions";

import {
    eachObject
} from "../../util";

/**
 * Binds expressions to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
export default function(ctrl) {
    const result = {};

    eachObject(expressions, (expressions, key, index) => {
        result[key] = expressions.onBind(ctrl, ctrl.$context);
    });

    return result;
}
