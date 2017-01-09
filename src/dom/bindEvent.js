"use strict";

import debounce from "../lib/debounce";
import {
    DOM_EVENT_TIMEOUT
} from "../lib/constants";
import getNodeValueType from "./getNodeValueType";
import arrayFrom from "../lib/arrayFrom";

const bindEvent = function(node, eventType, eventFn, eventArgs, instance) {
    const debouncedFn = debounce(eventFn, DOM_EVENT_TIMEOUT);
    const nodeValueType = getNodeValueType(node);

    const eventFnWrapper = function(event) {
        const target = event.target;
        const args = arrayFrom(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

export default bindEvent;
