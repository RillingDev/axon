"use strict";

const retrieveProp = function(instance, propName) {
    const castNumber = Number(propName);
    const stringChars = ["'", "\"", "`"];

    if (!isNaN(castNumber)) {
        //If number
        return castNumber;
    } else if (stringChars.includes(propName[0])) {
        //If String
        return propName.substr(1, propName.length - 2);
    } else {
        //If prop
        const prop = instance.$data[propName];

        if (typeof prop === "undefined") {
            throw new Error(`prop '${propName}' not found`);
        } else {
            return prop;
        }
    }

    return null;
};

export default retrieveProp;
