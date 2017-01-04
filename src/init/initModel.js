"use strict";

import bindEvent from "../dom/bindEvent";
import retrieveProp from "../controller/retrieveProp";
import {
    DOM_EVENT_MODEL,
    DOM_EVENT_TIMEOUT
} from "../lib/constants";

const initModel = function (instance, node, propName) {
    const targetProp = retrieveProp(instance, propName);
    const eventFn = function (currentValue, newValue) {
        targetProp.reference[propName] = newValue;

        setTimeout(() => {
            instance.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instance);

    return true;
};

export default initModel;
