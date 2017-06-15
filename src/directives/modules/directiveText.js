"use strict";

import {
    retrieveExpression
} from "../../controller/retrieve";
import {
    DOM_PROP_TEXT
} from "../../constants";

const directiveTextRender = function (directive, node) {
    node._element[DOM_PROP_TEXT] = retrieveExpression(directive._content, node)._val;

    return true;
};

export {
    directiveTextRender
};
