"use strict";

import retrieveProp from "../controller/retrieveProp";
import getNodeValueType from "../dom/getNodeValueType";

const renderModel = function(instance, node, propName) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, propName);

    node[nodeValueType] = propValue;

    return true;
};

export default renderModel;
