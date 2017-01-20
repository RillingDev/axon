"use strict";

import bindEvent from "../../dom/bindEvent";
import retrieveMethod from "../../controller/retrieveMethod";

const directiveOnInit = function (node, directive, instanceData) {
    const targetMethod = retrieveMethod(instanceData.$methods, directive.val);

    bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instanceData);

    return true;
};

export {
    directiveOnInit
};
