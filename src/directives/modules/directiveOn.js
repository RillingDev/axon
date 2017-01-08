"use strict";

import bindEvent from "../../dom/bindEvent";
import retrieveMethod from "../../controller/retrieveMethod";

const directiveOnInit = function (instance, node, directive) {
    const targetMethod = retrieveMethod(instance, directive.val);

    bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instance);

    return true;
};

export {
    directiveOnInit
};
