"use strict";

import retrieveProp from "../controller/retrieveProp";
import getNodeValueType from "../dom/getNodeValueType";

const renderBind = function (instance, node, bindType, propName) {
    //const nodeValueType = getNodeValueType(node);
    const propValue = retrieveProp(instance, propName);

    console.log(propValue);

    node.setAttribute(bindType,propValue);
};

export default renderBind;
