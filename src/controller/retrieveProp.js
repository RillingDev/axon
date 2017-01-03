"use strict";

import {
    TYPE_NAME_UNDEFINED
} from "../lib/constants";

const retrieveProp = function (instance, propName) {
    const castNumber = Number(propName);
    const stringChars = ["'", "\"", "`"];

    if (!isNaN(castNumber)) {
        //If number
        return castNumber;
    } else if (stringChars.includes(propName[0])) {
        //If String
        return propName.substr(1, propName.length - 2);
    } else {
        //If Prop
        const propPath = propName.split(".");
        let prop = instance.$data;

        propPath.forEach(propItem => {
            prop = prop[propItem];
        });

        if (typeof prop === TYPE_NAME_UNDEFINED) {
            throw new Error(`prop '${propName}' not found`);
        } else {
            return prop;
        }
    }
};

export default retrieveProp;
