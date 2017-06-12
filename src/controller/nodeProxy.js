"use strict";

const nodeProxy = {
    get: (target, key) => {
        if (key in target.data) {
            return target.data[key];
        } else {
            return target[key];
        }
    },
    set: (target, key, value) => {
        console.log(target);
        if (key in target.data) {
            target.data[key] = value;
            target.render();

            return true;
        } else {
            target[key] = value;

            return true;
        }
    },
};



export default nodeProxy;
