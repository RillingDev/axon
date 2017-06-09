"use strict";

import findPropInNode from "./findPropInNode";

//@TODO
const retrieveProp = function (expression, node) {
    const path = expression.split(".");
    const data = findPropInNode(path, node._root.methods);

    if (data !== false) {
        console.log(data);

        return data;
    } else {
        return false;
    }
};

export default retrieveProp;
