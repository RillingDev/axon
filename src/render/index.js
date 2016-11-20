"use strict";

import {
    _debounceTimeout
} from "../lib/constants";
import debounce from "../lib/debounce";
import renderDirectives from "./lib/renderDirectives";

const render = function(ctrl) {
    const renderFn = debounce(renderDirectives, _debounceTimeout);

    renderFn(ctrl);
};

export default render;
