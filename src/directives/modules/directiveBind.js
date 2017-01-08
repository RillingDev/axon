"use strict";

import evaluateExpression from "../../controller/evaluateExpression";

const directiveBindRender = function (instance, node, directive) {
    const propValue = evaluateExpression(instance, directive.val);

    node.setAttribute(directive.opt, propValue);

    return true;
};

export {
    directiveBindRender
};
