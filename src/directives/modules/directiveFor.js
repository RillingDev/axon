"use strict";

import {
    retrieveProp
} from "../../controller/retrieve";
import {
    DOM_PROP_HTML
} from "../../constants";

const directiveForRender = function (directive, node) {
    const directiveSplit = directive.val.split(" ");
    const iterator = directiveSplit[0];
    const iterable = retrieveProp(directiveSplit[2], node);
    //node._element[DOM_PROP_HTML] = retrieveExpression(directive.val, node).val;

    console.log({
        iterator,
        iterable
    })

    return false;
};

export {
    directiveForRender
};
