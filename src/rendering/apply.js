"use strict";

import {
    _debounceTimeout
} from "../lib/constants";
import debounce from "../lib/debounce";
import applyDirectives from "./lib/applyDirectives";
import renderDirectives from "./lib/renderDirectives";

// UI -> Ctrl
const apply = function(ctrl) {
    const applyFn = debounce(applyDirectives, _debounceTimeout);
    const renderFn = debounce(renderDirectives, _debounceTimeout);

    console.log("C:APPLY");
    console.log(ctrl);

    applyFn(ctrl);
    renderFn(ctrl);
};

export default apply;
