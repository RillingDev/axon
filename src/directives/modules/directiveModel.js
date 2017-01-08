"use strict";

import bindEvent from "../../dom/bindEvent";
import retrieveProp from "../../controller/retrieveProp";
import getNodeValueType from "../../dom/getNodeValueType";
import {
    DOM_EVENT_MODEL,
    DOM_EVENT_TIMEOUT
} from "../../lib/constants";

const directiveModelInit = function (instance, node, directive) {
    const targetProp = retrieveProp(instance, directive.val);
    const eventFn = function (currentValue, newValue) {
        targetProp.reference[directive.val] = newValue;

        setTimeout(() => {
            instance.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instance);

    return true;
};

const directiveModelRender = function (instance, node, directive) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, directive.val);

    node[nodeValueType] = propValue.val;

    return true;
};

export {
    directiveModelInit,
    directiveModelRender
};
