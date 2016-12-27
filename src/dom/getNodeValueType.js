"use strict";

const getNodeValueType = function(node) {
    if (typeof node.value !== "undefined") {
        return "value";
    } else if (typeof node.textContent !== "undefined") {
        return "textContent";
    } else {
        return "innerHTML";
    }
};

export default getNodeValueType;
