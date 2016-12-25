"use strict";

import {
    DOM_PREFIX
} from "../lib/constants";
import {
    eachAttribute
} from "../lib/util";

const getDirectives = function (node, allowedNames, fn) {
    eachAttribute(node.attributes, (attributeName, attributeValue) => {

        //If is Axon attribute
        if (attributeName.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            const splitName = attributeName.replace(DOM_PREFIX, "").split(":");

            //If name is allowed
            if (allowedNames.indexOf(splitName[0]) !== -1) {
                fn(splitName[0], splitName[1], attributeValue);
            }
        }
    });
};

export default getDirectives;
