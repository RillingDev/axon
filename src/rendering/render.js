"use strict";

import {
    _debounceTimeout
} from "../lib/constants";
import debounce from "../lib/debounce";
import renderDirectives from "./lib/renderDirectives";
import applyDirectives from "./lib/applyDirectives";

// Ctrl -> UI
const render = function(ctrl) {
    const renderFn = debounce(renderDirectives, _debounceTimeout);
    const applyFn = debounce(applyDirectives, _debounceTimeout);

    console.log("C:RENDER");
    renderFn(ctrl);
    applyFn(ctrl);
};

export default render;
