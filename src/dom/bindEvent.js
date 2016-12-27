"use strict";

import debounce from "../lib/debounce";
import {
    DEBOUNCE_TIMEOUT
} from "../lib/constants";

const bindEvent = function (node, eventType, eventFn, eventArgs, instance) {
    const debouncedFn = debounce(eventFn, DEBOUNCE_TIMEOUT);
    const eventFnWrapper = function (e) {
        const args = Array.from(eventArgs);

        args.push(e.target,e);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

export default bindEvent;
