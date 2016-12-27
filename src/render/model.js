"use strict";

import retrieveProp from "../controller/retrieveProp";

const model = function (instance, node, propName) {
    const _this = this;
    const propValue = retrieveProp(instance, propName);

    if (typeof node.value !== "undefined") {
        node.value = propValue;
    } else if (typeof node.textContent !== "undefined") {
        node.textContent = propValue;
    } else {
        node.innerHTML = propValue;
    }
};

export default model;
