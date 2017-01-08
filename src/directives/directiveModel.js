"use strict";

import bindEvent from "../dom/bindEvent";
import retrieveProp from "../controller/retrieveProp";
import getNodeValueType from "../dom/getNodeValueType";
import {
    DOM_EVENT_MODEL,
    DOM_EVENT_TIMEOUT
} from "../lib/constants";

const directiveModel = {
    init: function (instance, node, propName) {
        const targetProp = retrieveProp(instance, propName);
        const eventFn = function (currentValue, newValue) {
            targetProp.reference[propName] = newValue;

            setTimeout(() => {
                instance.$render();
            }, DOM_EVENT_TIMEOUT);
        };

        bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instance);

        return true;
    },
    render: function (instance, node, propName) {
        const nodeValueType = getNodeValueType(node);
        const propValue = retrieveProp(instance, propName);

        node[nodeValueType] = propValue.val;

        return true;
    }
};

export default directiveModel;
