"use strict";

import {
    eachNode
} from "../lib/util";
import directives from "../directives/index";
import queryDirective from "../dom/query/queryDirective";
import getDirectiveValue from "../dom/lib/getDirectiveValue";

/**
 * Binds all directive plugins to the controller
 * @param  {Object} ctrl Axon controller
 * @return {Array}      Array of directive results
 */
const bindDirectives = function(ctrl) {
    const result = [];

    directives.forEach(directive => {
        const directiveResult = [];
        const directiveNodes = queryDirective(ctrl.$context, directive.name, false, true);

        eachNode(directiveNodes, node => {
            directiveResult.push({
                node,
                instanceOf: directive,
                data: directive.onInit(node, ctrl, getDirectiveValue(node, directive.name))
            });
        });

        result.push(directiveResult);
    });

    return result;
};

export default bindDirectives;
