"use strict";

import retrieveProp from "../controller/retrieveProp";

const renderIf = function (instance, node, propName) {
    const propValue = retrieveProp(instance, propName);
    const result = Boolean(propValue);

    if (result) {
        node.removeAttribute("hidden");
    } else {
        node.setAttribute("hidden", result);
    }

    return result;
};

export default renderIf;
