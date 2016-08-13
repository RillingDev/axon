"use strict";

import bindModel from "./directives""

/**
 * Binds expressions to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
export default function(ctrl) {
    return {
      model:bindModel(ctrl)
    };
}
