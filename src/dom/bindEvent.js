"use strict";

import debounce from "../lib/debounce";
import {
    DEBOUNCE_TIMEOUT
} from "../lib/constants";
import getNodeValueType from "./getNodeValueType";

const bindEvent = function(node, eventType, eventFn, eventArgs, instance) {
    const debouncedFn = debounce(eventFn, DEBOUNCE_TIMEOUT);
    const nodeValueType = getNodeValueType(node);

    const eventFnWrapper = function(event) {
        const target = event.target;
        const args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

export default bindEvent;
