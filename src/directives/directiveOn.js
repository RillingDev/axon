"use strict";

import bindEvent from "../dom/bindEvent";
import retrieveMethod from "../controller/retrieveMethod";

const directiveModel = {
    init: function (instance, node, eventType, methodName) {
        const targetMethod = retrieveMethod(instance, methodName);

        bindEvent(node, eventType, targetMethod.fn, targetMethod.args, instance);

        return true;
    },
    render: false
};

export default directiveModel;
