"use strict";

import retrieveProp from "../controller/retrieveProp";

const renderBind = function (instance, node, bindType, propName) {
    const propValue = retrieveProp(instance, propName);

    node.setAttribute(bindType,propValue);
};

export default renderBind;
