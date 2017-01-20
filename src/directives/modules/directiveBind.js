"use strict";

import evaluateExpression from "../../controller/evaluateExpression";

const directiveBindRender = function (node, directive,instanceData) {
    const propValue = evaluateExpression(instanceData, directive.val);

    node.setAttribute(directive.opt, propValue);

    return true;
};

export {
    directiveBindRender
};
