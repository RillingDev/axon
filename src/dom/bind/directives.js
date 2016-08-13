"use strict";

import bindModel from "./directives/model";

/**
 * Binds expressions to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
export default function(ctrl) {
    const context = ctrl.context;

    return {
        model: bindModel(ctrl, context)
    };
}
