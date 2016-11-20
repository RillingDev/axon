"use strict";

import {
    _debounceTimeout
} from "../../../lib/constants";
import debounce from "../../../lib/debounce";

const bindEvent = function(node, eventType, eventFn) {
    const debouncedFn = debounce(eventFn, _debounceTimeout);

    node.addEventListener(eventType, debouncedFn, false);
};

export default bindEvent;
