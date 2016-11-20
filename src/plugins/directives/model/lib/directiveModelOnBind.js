"use strict";

import queryDirective from "../../../../dom/query/queryDirective";
import getDirectiveValue from "../../../../dom/lib/getDirectiveValue";
import bindEvent from "../../../../dom/bind/lib/bindEvent";
import render from "../../../../render/index";

const directiveModelOnBind = function(node, ctrl) {
    const modelType = typeof node.value !== "undefined" ? "value" : "innerText";
    const modelFor = getDirectiveValue(node, "model");
    const eventFn = function(ev) {
        render(ctrl);
    };

    node[modelType] = ctrl[modelFor];

    bindEvent(node, "change", eventFn);
    bindEvent(node, "input", eventFn);

    return {
        modelType,
        modelFor
    };
};

export default directiveModelOnBind;
