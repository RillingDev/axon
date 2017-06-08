"use strict";

/*import {
    bindEvent
} from "../../dom/event";
import retrieveProp from "../../controller/retrieveProp";
import getNodeValueType from "../../dom/getNodeValueType";*/

const directiveModelInit = function (directive, node) {
    /*const targetProp = retrieveProp(instanceContent.$data, directive.val);
    const eventFn = function (currentValue, newValue) {
        targetProp.ref[directive.val] = newValue;

        setTimeout(() => {
            instanceMethods.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instanceContent);

    return true;*/
    console.log("MODEL",[directive, node]);
    return true;
};

const directiveModelRender = function (directive, node) {
    /*const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instanceContent.$data, directive.val);

    node[nodeValueType] = propValue.val;*/

    console.log("MODEL",[directive, node]);
    return true;
};

export {
    directiveModelInit,
    directiveModelRender
};
