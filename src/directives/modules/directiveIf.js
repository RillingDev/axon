"use strict";

import evaluateExpression from "../../controller/evaluateExpression";
import {
    DOM_ATTR_HIDDEN
} from "../../lib/constants";

const directiveIfRender = function (instance, node, directive) {
    console.log([instance, node, directive]);
    const propValue = evaluateExpression(instance, directive.val);
    const result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

export {
    directiveIfRender
};
