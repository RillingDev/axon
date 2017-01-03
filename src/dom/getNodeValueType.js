"use strict";

import {
    TYPE_NAME_UNDEFINED
} from "../lib/constants";

const getNodeValueType = function (node) {
    if (typeof node.value !== TYPE_NAME_UNDEFINED) {
        return "value";
    } else if (typeof node.textContent !== TYPE_NAME_UNDEFINED) {
        return "textContent";
    } else {
        return "innerHTML";
    }
};

export default getNodeValueType;
