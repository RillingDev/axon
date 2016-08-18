"use strict";

import * as directives from "../../plugins/directives/directives";

import {
    eachObject
} from "../../util";
/**
 * Binds directives to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
export default function(ctrl) {
    const context = ctrl.$context;
    const result = {};

    eachObject(directives, (directive, key, index) => {

        result[key] = directive.onBind(ctrl, context);
    });

    return result;
}
