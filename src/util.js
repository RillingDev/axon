"use strict";

//Utility functions
export default {
    _eachObject: function (object, fn) {
        let keys = Object.keys(object);

        keys.forEach((key, i) => {
            fn(object[key], key, i);
        });
    }
};
