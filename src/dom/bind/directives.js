"use strict";

import  directives from "../../plugins/directives/index";

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
    const result = {};

    eachObject(directives, (directive, key, index) => {
        result[key] = directive.onBind(ctrl, ctrl.$context);
    });

    return result;
}
