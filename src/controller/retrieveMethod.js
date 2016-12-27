"use strict";

import retrieveProp from "./retrieveProp";

const retrieveMethod = function(instance, methodString) {
    const methodStringSplit = methodString.substr(0, methodString.length - 1).split("(");
    const methodName = methodStringSplit[0];
    const methodArgs = methodStringSplit[1].split(",").filter(item => item !== "").map(arg => retrieveProp(instance, arg));

    const methodFn = instance.$methods[methodName];

    if (typeof methodFn !== "function") {
        throw new Error(`method '${methodName}' not found`);
    } else {
        return {
            fn: methodFn,
            args: methodArgs
        };
    }
};

export default retrieveMethod;
