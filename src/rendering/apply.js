"use strict";

import {
    _debounceTimeout
} from "../lib/constants";
import debounce from "../lib/debounce";
import renderDirectives from "./lib/renderDirectives";

// UI -> Ctrl
const apply = function(ctrl) {
    const renderFn = debounce(renderDirectives, _debounceTimeout);

    renderFn(ctrl);
};

export default apply;
