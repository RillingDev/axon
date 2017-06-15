"use strict";

import {
    retrieveExpression
} from "../../controller/retrieve";

const directiveBindRender = function (directive, node) {
    node._element.setAttribute(directive._opt, retrieveExpression(directive._val, node)._val);

    return true;
};

export {
    directiveBindRender
};
