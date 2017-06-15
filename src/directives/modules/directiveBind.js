"use strict";

import {
    retrieveExpression
} from "../../controller/retrieve";

const directiveBindRender = function (directive, node) {
    node._element.setAttribute(directive._opt, retrieveExpression(directive._content, node)._val);

    return true;
};

export {
    directiveBindRender
};
