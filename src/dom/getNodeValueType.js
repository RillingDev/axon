"use strict";

import isDefined from "../lib/isDefined";
import {
    DOM_NODE_CONTENT
} from "../lib/constants";

const getNodeValueType = function (node) {
    if (isDefined(node[DOM_NODE_CONTENT[0]])) {
        return DOM_NODE_CONTENT[0];
    } else if (isDefined(node[DOM_NODE_CONTENT[1]])) {
        return DOM_NODE_CONTENT[1];
    } else {
        return DOM_NODE_CONTENT[2];
    }
};

export default getNodeValueType;
