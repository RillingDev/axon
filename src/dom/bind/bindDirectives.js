"use strict";

import {
    eachNode
} from "../../lib/util";
import directives from "../../plugins/directives/index";
import queryDirective from "../query/queryDirective";

/**
 * Binds all directive plugins to the controller
 * @param  {Object} ctrl Axon controller
 * @return {Array}      Array of directive results
 */
const bindDirectives = function(ctrl) {
    const result = [];

    directives.forEach(directive => {
        const directiveResult = [];
        const directiveNodes = queryDirective(ctrl.$context, directive.id, false, true);

        eachNode(directiveNodes, node => {
            directiveResult.push(directive.onBind(node, ctrl));
        });

        result.push(directiveResult);
    });

    return result;
};

export default bindDirectives;
