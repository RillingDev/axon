"use strict";

import {
    DOM_PREFIX
} from "../lib/constants";
import {
    eachAttribute
} from "../lib/util";

const eachDirective = function (node, namesList) {
    const names = namesList.map(item => item.name);

    eachAttribute(node.attributes, (attributeName, attributeValue) => {

        //If is Axon attribute
        if (attributeName.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            const splitName = attributeName.replace(DOM_PREFIX, "").split(":");
            const nameIndex = names.indexOf(splitName[0]);

            //If name is allowed
            if (nameIndex !== -1) {
                namesList[nameIndex].fn({
                    name: splitName[0],
                    secondary: splitName[1],
                    value: attributeValue
                });
            }
        }
    });
};

export default eachDirective;
