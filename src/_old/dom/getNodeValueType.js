"use strict";

import isDefined from "../lib/isDefined";
import {
    DOM_ATTR_VALUE,
    DOM_ATTR_TEXT,
    DOM_ATTR_HTML
} from "../lib/constants";

const getNodeValueType = function (node) {
    if (isDefined(node[DOM_ATTR_VALUE])) {
        return DOM_ATTR_VALUE;
    } else if (isDefined(node[DOM_ATTR_TEXT])) {
        return DOM_ATTR_TEXT;
    } else {
        return DOM_ATTR_HTML;
    }
};

export default getNodeValueType;
