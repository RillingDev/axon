"use strict";

import bindEvent from "../dom/bindEvent";

import retrieveMethod from "../controller/retrieveMethod";

const initOn = function (instance, node, eventType, methodName) {
    const targetMethod = retrieveMethod(instance, methodName);

    bindEvent(node, eventType, targetMethod.fn, targetMethod.args, instance);
};

export default initOn;
