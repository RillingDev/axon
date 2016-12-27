"use strict";

import retrieveProp from "../controller/retrieveProp";
import getNodeValueType from "../dom/getNodeValueType";

const model = function(instance, node, propName) {
    const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, propName);

    node[nodeValueType] = propValue;
};

export default model;
