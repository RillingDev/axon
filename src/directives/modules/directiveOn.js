"use strict";

import { bindEvent } from "../../dom/event";
import retrieveMethod from "../../controller/retrieveMethod";

const directiveOnInit = function(directive, node) {
    bindEvent(node._element, directive.opt, retrieveMethod(directive.val, node).val);

    return true;
};

export {
    directiveOnInit
};
