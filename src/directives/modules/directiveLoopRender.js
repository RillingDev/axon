"use strict";

import evaluateExpression from "../../controller/evaluateExpression";
import {
    DOM_ATTR_HIDDEN
} from "../../lib/constants";

const directiveLoopRender = function (instance, node, directive) {
    const propValue = evaluateExpression(instance, directive.val);

    if (propValue) {
       console.log('loop plz')
    } else {
        console.log('loop plz')
    }

    return propValue
};

export {
    directiveLoopRender
};
