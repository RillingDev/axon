"use strict";

import {
    bindEvent
} from "../../dom/event";
import {
    applyMethodContext,
    retrieveMethod
} from "../../controller/retrieve";

const directiveOnInit = function (directive, node) {
    const methodProp = retrieveMethod(directive._content, node);

    bindEvent(node._element, directive._opt, () => applyMethodContext(methodProp));

    return true;
};

export {
    directiveOnInit
};
