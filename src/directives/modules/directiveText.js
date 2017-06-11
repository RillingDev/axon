"use strict";

import retrieveExpression from "../../controller/retrieveExpression";
import { DOM_PROP_TEXT } from "../../constants";

const directiveTextRender = function(directive, node) {
    node._element[DOM_PROP_TEXT] = retrieveExpression(directive.val, node).val;

    return true;
};

export {
    directiveTextRender
};
