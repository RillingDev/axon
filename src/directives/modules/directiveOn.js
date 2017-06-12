"use strict";

import {
    bindEvent
} from "../../dom/event";
import {
    applyMethodContext,
    retrieveMethod
} from "../../controller/retrieve";

const directiveOnInit = function (directive, node) {
    const methodProp = retrieveMethod(directive.val, node);

    bindEvent(node._element, directive.opt, () => applyMethodContext(methodProp));

    return true;
};

export {
    directiveOnInit
};
