"use strict";

import {
    bindEvent
} from "../../dom/event";
import {retrieveMethod} from "../../controller/retrieve";

const directiveOnInit = function (directive, node) {
    const methodProp = retrieveMethod(directive.val, node);

    bindEvent(node._element, directive.opt, () => {
        return methodProp.val.apply(methodProp.node.data, methodProp.args);
    });

    return true;
};

export {
    directiveOnInit
};
