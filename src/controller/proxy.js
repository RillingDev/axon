"use strict";

const nodeProxy = {
    get: (target, key) => {
        if (key in target.data) {
            return target.data[key];
        } else {
            return target[key];
        }
    }
};

export {
    nodeProxy
};
