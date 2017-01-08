"use strict";

import evaluateExpression from "../controller/evaluateExpression";
import {
    DOM_ATTR_HIDDEN
} from "../lib/constants";

const directiveModel = {
    init: false,
    render: function (instance, node, expression) {
        const propValue = evaluateExpression(instance, expression);
        const result = Boolean(propValue);

        if (result) {
            node.removeAttribute(DOM_ATTR_HIDDEN);
        } else {
            node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
        }

        return result;
    }
};

export default directiveModel;
