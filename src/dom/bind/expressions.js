"use strict";

import bindExpressions from "../expressions/parse";

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
        expressions: elements = queryExpressions(context)
    };
}
