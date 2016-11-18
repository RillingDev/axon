"use strict";

import directives from "../../plugins/directives/index";


/**
 * Binds directives to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
const bindDirectives = function(ctrl) {
    const result = [];

    directives.forEach(directive => {
        result.push(directive.onBind(ctrl));
    });

    return result;
};

export default bindDirectives;
