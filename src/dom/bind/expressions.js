"use strict";

import queryExpressions from "../query/expressions/query";

/**
 * Binds directives to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
export default function(ctrl) {
    const context = ctrl.context;

    return {
        expressions: queryExpressions(context)
    };
}
