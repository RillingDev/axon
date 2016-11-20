"use strict";

import queryDirective from "../../../../dom/query/queryDirective";
import getDirectiveValue from "../../../../dom/lib/getDirectiveValue";
import bindEvent from "../../../../dom/bind/lib/bindEvent";

const directiveModelOnBind = function(node, ctrl) {
    const modelType = typeof node.value !== "undefined" ? "value" : "innerText";
    const modelFor = getDirectiveValue(node, "model");
    const eventFn = function(ev) {
        console.log("EV!", node, ev);
    };

    console.log({
        modelType,
        modelFor
    });

    node[modelType] = ctrl[modelFor];

    bindEvent(node, "change", eventFn);
    bindEvent(node, "input", eventFn);
};

export default directiveModelOnBind;
