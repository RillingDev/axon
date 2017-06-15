"use strict";

import {
    retrieveExpression
} from "../../controller/retrieve";
import {
    setElementActive
} from "../../dom/element";

const directiveIfBoth = function (directive, node) {
    const element = node._element;
    const expressionValue = Boolean(retrieveExpression(directive._content, node, true)._val);

    setElementActive(element,expressionValue);

    return expressionValue;
};

export {
    directiveIfBoth
};
