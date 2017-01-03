"use strict";

import retrieveProp from "../controller/retrieveProp";
import {
    DOM_ATTR_HIDDEN
} from "../lib/constants";

const renderIf = function (instance, node, propName) {
    const propValue = retrieveProp(instance, propName);
    const result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

export default renderIf;
