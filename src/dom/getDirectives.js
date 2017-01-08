"use strict";

import {
    DOM_ATTR_PREFIX
} from "../lib/constants";

const getDirectives = function (node) {
    const attrArr = Array.from(node.attributes);
    const result = [];

    attrArr.forEach(attr => {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
            const splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");

            result.push({
                key: splitName[0],
                opt: splitName[1] || false,
                val: attr.value
            });
        }
    });

    return result;
};

export default getDirectives;
