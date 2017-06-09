"use strict";

import {isDefined} from "../util";

const findPropInNode = function (path, obj) {
    let entry = obj;
    let current;
    let index = 0;

    while (index < path.length) {
        const propPath = path[index];

        current = entry[propPath];

        if (isDefined(current)) {
            if (index < path.length - 1) {
                entry = current;
            } else {
                return {
                    val: current,
                    set: val => entry[propPath] = val
                };
            }
        }

        index++;
    }

    return false;
};

export default findPropInNode;
