"use strict";

import bindEvent from "../../dom/bindEvent";
import retrieveProp from "../../controller/retrieveProp";
import getNodeValueType from "../../dom/getNodeValueType";
import {
    DOM_EVENT_MODEL,
    DOM_EVENT_TIMEOUT
} from "../../lib/constants";

const directiveModelInit = function (node, directive, instanceContent, instanceMethods) {
    const targetProp = retrieveProp(instanceContent.$data, directive.val);
    const eventFn = function (currentValue, newValue) {
        targetProp.ref[directive.val] = newValue;

        setTimeout(() => {
            instanceMethods.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instanceContent);

    return true;
};

const directiveModelRender = function (node, directive, instanceContent) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instanceContent.$data, directive.val);

    node[nodeValueType] = propValue.val;

    return true;
};

export {
    directiveModelInit,
    directiveModelRender
};
