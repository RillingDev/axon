"use strict";

import {
    DOM_PREFIX
} from "../lib/constants";
import {
    eachAttribute
} from "../lib/util";

const eachDirective = function (node, allowedNames, fn) {
    eachAttribute(node.attributes, (attributeName, attributeValue) => {

        //If is Axon attribute
        if (attributeName.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            const splitName = attributeName.replace(DOM_PREFIX, "").split(":");

            //If name is allowed
            if (allowedNames.indexOf(splitName[0]) !== -1) {
                fn({
                    name: splitName[0],
                    secondary: splitName[1],
                    value: attributeValue
                });
            }
        }
    });
};

export default eachDirective;
