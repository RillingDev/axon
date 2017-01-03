"use strict";

import {
    DOM_ATTR_PREFIX
} from "../lib/constants";

const eachDirective = function (node, namesList) {
    const names = namesList.map(item => item.name);
    const attrArr = Array.from(node.attributes);
    let result = true;

    attrArr.forEach(attr => {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
            const splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");
            const nameIndex = names.indexOf(splitName[0]);

            //If name is allowed
            if (nameIndex !== -1) {
                result = namesList[nameIndex].fn(splitName[0], splitName[1], attr.value);
            }
        }
    });

    return result;
};

export default eachDirective;
