"use strict";

import retrieveExpression from "../../controller/retrieveExpression";

const directiveBindRender = function(directive, node) {
    node._element.setAttribute(directive.opt, retrieveExpression(directive.val, node).val);

    return true;
};

export {
    directiveBindRender
};
