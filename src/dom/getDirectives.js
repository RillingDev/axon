"use strict";

import directiveRefList from "../directives/index";
import {
    DOM_ATTR_PREFIX
} from "../lib/constants";

const getDirectives = function (node) {
    console.log(node);
    const attrArr = Array.from(node.attributes);
    const result = [];

    attrArr.forEach(attr => {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
            const splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");

            result.push({
                name: splitName[0],
                opt: splitName[1],
                val: attr.value
            });
        }
    });


    return result.sort((a, b) => {
        //sort by proccessing order
        const indexA = directiveRefList.findIndex(item => item.name === a.name);
        const indexB = directiveRefList.findIndex(item => item.name === b.name);

        return indexA >= indexB;
    });
};

export default getDirectives;
