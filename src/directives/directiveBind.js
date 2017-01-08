"use strict";

import evaluateExpression from "../controller/evaluateExpression";

const directiveModel = {
    init: false,
    render: function (instance, node, bindType, expression) {
        const propValue = evaluateExpression(instance, expression);

        node.setAttribute(bindType, propValue);

        return true;
    }
};

export default directiveModel;
