"use strict";

import arrayFrom from "./arrayFrom";

const debounce = function(fn, wait, immediate) {
    let timeout;

    return function() {
        const context = this;
        const args = arrayFrom(arguments);
        const callNow = immediate && !timeout;
        const later = function() {
            timeout = null;
            if (!immediate) {
                fn.apply(context, args);
            }
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            fn.apply(context, args);
        }
    };
};

export default debounce;
