"use strict";

import retrieveExpression from "../../controller/retrieveExpression";

import {DOM_ATTR_HIDDEN} from "../../constants";

const directiveIfRender = function (directive, node) {
    const element = node._element;
    const expressionValue = retrieveExpression(directive.val, node);
    const result = Boolean(expressionValue);

    if (result) {
        element.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        element.setAttribute(DOM_ATTR_HIDDEN, true);
    }

    return result;
};

export {directiveIfRender};
