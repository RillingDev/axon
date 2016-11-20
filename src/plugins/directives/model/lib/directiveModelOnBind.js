"use strict";

import queryDirective from "../../../../dom/query/queryDirective";
import getDirectiveValue from "../../../../dom/lib/getDirectiveValue";

const directiveModelOnBind = function(node, ctrl) {
    const modelType = typeof node.value !== "undefined" ? "value" : "innerText";
    const modelFor = getDirectiveValue(node, "model");

    console.log({
        modelType,
        modelFor
    });

    node[modelType] = ctrl[modelFor];

    //bindEvent(elements, "change", eventFn);
    //bindEvent(elements, "input", eventFn);
};

export default directiveModelOnBind;
