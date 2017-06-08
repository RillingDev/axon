"use strict";

/*import bindEvent from "../../dom/bindEvent";
import retrieveMethod from "../../controller/retrieveMethod";*/

const directiveOnInit = function (node, directive, instanceContent) {
    /*const targetMethod = retrieveMethod(instanceContent.$methods, directive.val);

    bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instanceContent);

    return true;*/
    return true;
};

export {
    directiveOnInit
};
