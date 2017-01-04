"use strict";

import bindEvent from "../dom/bindEvent";
import retrieveProp from "../controller/retrieveProp";
import {
    DOM_EVENT_MODEL
} from "../lib/constants";

const initModel = function (instance, node, propName) {
    const targetProp = retrieveProp(instance, propName);
    const eventFn = function (prop, value) {
        console.log("MODEL FN", prop, value);
        instance.$data[prop] = value;
        instance.$render(true);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp], instance);

    console.log("MODEL", propName);

    return true;
};

export default initModel;
