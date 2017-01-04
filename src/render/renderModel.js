"use strict";

import evaluateExpression from "../controller/evaluateExpression";
import getNodeValueType from "../dom/getNodeValueType";

const renderModel = function(instance, node, propName) {
    const nodeValueType = getNodeValueType(node);
    const propValue = evaluateExpression(instance, propName);

    node[nodeValueType] = propValue;

    return true;
};

export default renderModel;
