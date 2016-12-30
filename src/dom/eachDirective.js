"use strict";

import {
    DOM_PREFIX
} from "../lib/constants";

const eachDirective = function (node, namesList) {
    const names = namesList.map(item => item.name);
    const attrArr = Array.from(node.attributes);

    attrArr.forEach(attr => {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            const splitName = attr.name.replace(DOM_PREFIX, "").split(":");
            const nameIndex = names.indexOf(splitName[0]);

            //If name is allowed
            if (nameIndex !== -1) {
                namesList[nameIndex].fn(splitName[0], splitName[1], attr.value);
            }
        }
    });
};

export default eachDirective;
