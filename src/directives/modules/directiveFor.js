"use strict";

import {
    retrieveExpression
} from "../../controller/retrieve";
import {
    DOM_PROP_HTML
} from "../../constants";

const directiveHTMLRender = function (directive, node) {
    node._element[DOM_PROP_HTML] = retrieveExpression(directive.val, node).val;

    return true;
};

export {
    directiveHTMLRender
};
