"use strict";

//import evaluateExpression from "../../controller/evaluateExpression";

const directiveBindRender = function (node, directive,instanceContent) {
    /*const propValue = evaluateExpression(instanceContent, directive.val);

    node.setAttribute(directive.opt, propValue);

    return true;*/
    return true;
};

export {
    directiveBindRender
};
